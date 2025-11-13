import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ArrowRight, TrendingUp, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Match {
  id: number;
  payment_reference: string;
  payer_name: string;
  amount: number;
  invoice_number: string;
  match_type: string;
  confidence_score: number;
  status: string;
  matched_at: string;
}

interface MatchStats {
  auto_posted: number;
  pending_review: number;
  match_rate: number;
  avg_confidence: number;
}

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoMatching, setIsAutoMatching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchesData, statsData] = await Promise.all([
        api.getMatches(),
        api.getMatchStats(),
      ]);
      setMatches(matchesData);
      setStats(statsData);
    } catch (error: any) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoMatch = async () => {
    setIsAutoMatching(true);
    try {
      const result = await api.autoMatchPayments();
      toast.success(result.message);
      await fetchData(); // Refresh data
    } catch (error: any) {
      toast.error("Failed to auto-match payments");
    } finally {
      setIsAutoMatching(false);
    }
  };

  const handleApprove = async (matchId: number) => {
    try {
      await api.approveMatch(matchId);
      toast.success("Match approved and posted!");
      await fetchData();
    } catch (error: any) {
      toast.error("Failed to approve match");
    }
  };

  const handleReject = async (matchId: number) => {
    try {
      await api.rejectMatch(matchId);
      toast.success("Match rejected");
      await fetchData();
    } catch (error: any) {
      toast.error("Failed to reject match");
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "text-success";
    if (confidence >= 85) return "text-warning";
    return "text-destructive";
  };

  const getMatchTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      exact: "bg-success/10 text-success",
      fuzzy: "bg-primary/10 text-primary",
      contextual: "bg-accent/10 text-accent",
      reference: "bg-primary/10 text-primary",
    };
    return colors[type] || "bg-secondary";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment Matches</h1>
            <p className="text-muted-foreground">
              AI-matched transactions and pending reviews
            </p>
          </div>
          <Button
            onClick={handleAutoMatch}
            disabled={isAutoMatching}
            className="bg-primary hover:bg-primary-light"
          >
            {isAutoMatching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Matching...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Auto-Match Payments
              </>
            )}
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Auto-Posted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                {stats?.auto_posted || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                {stats?.pending_review || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Match Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {stats?.match_rate || 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Confidence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avg_confidence || 0}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Matches Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>
              AI-powered payment to invoice matching results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No matches yet. Upload payment and invoice files to get started.
                </p>
                <Button onClick={handleAutoMatch} disabled={isAutoMatching}>
                  <Zap className="mr-2 h-4 w-4" />
                  Run Auto-Match
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Ref</TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Matched Invoice</TableHead>
                    <TableHead>Match Type</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match) => (
                    <TableRow key={match.id} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">
                        {match.payment_reference}
                      </TableCell>
                      <TableCell>{match.payer_name}</TableCell>
                      <TableCell className="font-semibold">
                        ${match.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-primary">{match.invoice_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getMatchTypeBadge(match.match_type)}
                        >
                          {match.match_type.charAt(0).toUpperCase() +
                            match.match_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span
                              className={`font-medium ${getConfidenceColor(
                                match.confidence_score
                              )}`}
                            >
                              {match.confidence_score.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={match.confidence_score}
                            className="h-1.5"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={match.status === "posted" ? "default" : "secondary"}
                          className={
                            match.status === "posted"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }
                        >
                          {match.status === "posted" ? "Auto-Posted" : "Review"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {match.status === "review" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(match.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(match.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        {matches.length > 0 && (
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                • <span className="font-semibold">{stats?.match_rate || 0}%</span> of
                payments matched automatically
              </p>
              <p className="text-sm">
                • <span className="font-semibold">{stats?.pending_review || 0}</span>{" "}
                payment{stats?.pending_review !== 1 ? "s" : ""} require manual review
              </p>
              <p className="text-sm">
                • Average confidence score:{" "}
                <span className="font-semibold text-success">
                  {stats?.avg_confidence || 0}%
                </span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Matches;
