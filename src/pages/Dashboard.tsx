import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Clock,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface DashboardStats {
  total_processed: number;
  total_processed_change: number;
  match_rate: number;
  match_rate_change: number;
  pending_review: number;
  pending_review_change: number;
  auto_posted: number;
  auto_posted_change: number;
}

interface PerformanceMetrics {
  auto_match_rate: number;
  processing_speed: number;
  data_quality: number;
}

interface RecentMatch {
  id: string;
  payer: string;
  invoice: string;
  amount: string;
  confidence: number;
  status: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, metricsData, matchesData] = await Promise.all([
          api.getDashboardStats(),
          api.getPerformanceMetrics(),
          api.getRecentMatches(4),
        ]);

        setStats(statsData);
        setMetrics(metricsData);
        setRecentMatches(matchesData);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: "Total Processed",
      value: `$${stats?.total_processed.toLocaleString() || 0}`,
      change: `+${stats?.total_processed_change || 0}%`,
      trend: "up",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "Match Rate",
      value: `${stats?.match_rate || 0}%`,
      change: `+${stats?.match_rate_change || 0}%`,
      trend: "up",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Pending Review",
      value: stats?.pending_review || 0,
      change: `${stats?.pending_review_change || 0}`,
      trend: (stats?.pending_review_change || 0) < 0 ? "down" : "up",
      icon: AlertCircle,
      color: "text-warning",
    },
    {
      title: "Auto-Posted",
      value: stats?.auto_posted || 0,
      change: `+${stats?.auto_posted_change || 0}`,
      trend: "up",
      icon: Zap,
      color: "text-accent",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your cash posting automation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <span
                    className={
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }
                  >
                    {stat.change}
                  </span>
                  <span>from last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Matches
                <Link to="/matches">
                  <Button variant="ghost" size="sm">
                    View All <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Latest AI-matched transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMatches.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No matches yet. Upload files to get started.
                  </p>
                ) : (
                  recentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{match.payer}</div>
                        <div className="text-xs text-muted-foreground">
                          {match.id} → {match.invoice}
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <div className="font-semibold text-sm">{match.amount}</div>
                        <div className="text-xs text-muted-foreground">
                          {match.confidence}% confidence
                        </div>
                      </div>
                      <Badge
                        variant={match.status === "posted" ? "default" : "secondary"}
                        className={
                          match.status === "posted"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-warning/10 text-warning hover:bg-warning/20"
                        }
                      >
                        {match.status === "posted" ? "Posted" : "Review"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity & Performance */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Today's automation performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Auto-Match Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.auto_match_rate || 0}%
                    </span>
                  </div>
                  <Progress value={metrics?.auto_match_rate || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Processing Speed</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.processing_speed || 0}%
                    </span>
                  </div>
                  <Progress value={metrics?.processing_speed || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Data Quality</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.data_quality || 0}%
                    </span>
                  </div>
                  <Progress value={metrics?.data_quality || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/invoices">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    View Open Invoices
                  </Button>
                </Link>
                <Link to="/matches">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Review Pending Matches
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
