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

const Dashboard = () => {
  const stats = [
    {
      title: "Total Processed",
      value: "$2,847,290",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "Match Rate",
      value: "98.2%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Pending Review",
      value: "23",
      change: "-8",
      trend: "down",
      icon: AlertCircle,
      color: "text-warning",
    },
    {
      title: "Auto-Posted",
      value: "487",
      change: "+94",
      trend: "up",
      icon: Zap,
      color: "text-accent",
    },
  ];

  const recentMatches = [
    {
      id: "TRX-554982",
      payer: "Acme Holdings",
      invoice: "INV-2025-001",
      amount: "$24,500",
      confidence: 99,
      status: "posted",
    },
    {
      id: "TRX-555142",
      payer: "Global Tech Ltd",
      invoice: "INV-2025-002",
      amount: "$31,150",
      confidence: 94,
      status: "posted",
    },
    {
      id: "TRX-555490",
      payer: "Silverstone Cap",
      invoice: "INV-2025-003",
      amount: "$18,750",
      confidence: 98,
      status: "posted",
    },
    {
      id: "TRX-555812",
      payer: "Horizon Infra",
      invoice: "INV-2025-004",
      amount: "$45,000",
      confidence: 87,
      status: "review",
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
          {stats.map((stat) => (
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
                {recentMatches.map((match) => (
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
                ))}
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
                    <span className="text-sm text-muted-foreground">98.2%</span>
                  </div>
                  <Progress value={98.2} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Processing Speed</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Data Quality</span>
                    <span className="text-sm text-muted-foreground">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
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
