import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ArrowRight, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Matches = () => {
  const matches = [
    {
      paymentRef: "TRX-554982",
      payer: "Acme Holdings",
      amount: "$24,500.00",
      invoice: "INV-2025-001",
      matchType: "Exact",
      confidence: 99,
      status: "posted",
    },
    {
      paymentRef: "TRX-555142",
      payer: "Global Tech Ltd",
      amount: "$31,150.00",
      invoice: "INV-2025-002",
      matchType: "Fuzzy (name)",
      confidence: 94,
      status: "posted",
    },
    {
      paymentRef: "TRX-555490",
      payer: "Silverstone Cap",
      amount: "$18,750.00",
      invoice: "INV-2025-003",
      matchType: "Exact",
      confidence: 98,
      status: "posted",
    },
    {
      paymentRef: "TRX-555812",
      payer: "Horizon Infra Group",
      amount: "$45,000.00",
      invoice: "INV-2025-004",
      matchType: "Contextual",
      confidence: 87,
      status: "review",
    },
    {
      paymentRef: "TRX-556023",
      payer: "Contl. Partners",
      amount: "$12,900.00",
      invoice: "INV-2025-005",
      matchType: "Reference",
      confidence: 97,
      status: "review",
    },
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "text-success";
    if (confidence >= 85) return "text-warning";
    return "text-destructive";
  };

  const getMatchTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Exact: "bg-success/10 text-success",
      "Fuzzy (name)": "bg-primary/10 text-primary",
      Contextual: "bg-accent/10 text-accent",
      Reference: "bg-primary/10 text-primary",
    };
    return colors[type] || "bg-secondary";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Payment Matches</h1>
          <p className="text-muted-foreground">
            AI-matched transactions and pending reviews
          </p>
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
                487
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
                23
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
                98.2%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Confidence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95.2%</div>
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
                  <TableRow key={match.paymentRef} className="hover:bg-secondary/50">
                    <TableCell className="font-medium">{match.paymentRef}</TableCell>
                    <TableCell>{match.payer}</TableCell>
                    <TableCell className="font-semibold">{match.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-primary">{match.invoice}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getMatchTypeBadge(match.matchType)}
                      >
                        {match.matchType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className={`font-medium ${getConfidenceColor(match.confidence)}`}>
                            {match.confidence}%
                          </span>
                        </div>
                        <Progress value={match.confidence} className="h-1.5" />
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
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              • <span className="font-semibold">98.2%</span> of payments matched automatically
            </p>
            <p className="text-sm">
              • <span className="font-semibold">2 payments</span> require manual review due to name variations
            </p>
            <p className="text-sm">
              • Average confidence score increased by <span className="font-semibold text-success">3.2%</span> this week
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Matches;
