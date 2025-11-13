import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Zap, Clock, Upload, Inbox } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/context/DataContext";
import { Link } from "react-router-dom";

const Reports = () => {
  const { isDataLoaded } = useData();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Performance insights and automation metrics
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            {!isDataLoaded ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No data available</p>
                <Link to="/upload">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Data
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Processed (MTD)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isDataLoaded ? "$8.4M" : "$0"}</div>
                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                      <TrendingUp className="h-3 w-3" />
                      {isDataLoaded ? "+18.2% vs last month" : "N/A"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Automation Rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isDataLoaded ? "94.5%" : "0%"}</div>
                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                      <Zap className="h-3 w-3" />
                      {isDataLoaded ? "+2.1% improvement" : "N/A"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Time Saved</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isDataLoaded ? "127 hrs" : "0 hrs"}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      This month
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Cost Savings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isDataLoaded ? "$12,400" : "$0"}</div>
                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                      <DollarSign className="h-3 w-3" />
                      vs manual processing
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Charts Placeholder */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Volume Trend</CardTitle>
                  <CardDescription>Daily transaction volumes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
                    <p className="text-muted-foreground">Chart: Processing volume over time</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Match Rate by Type</CardTitle>
                  <CardDescription>Distribution of match types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
                    <p className="text-muted-foreground">Chart: Match type distribution</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed automation performance breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Exact Matches</h4>
                      <p className="text-sm text-muted-foreground">Perfect name & amount match</p>
                    </div>
                    <span className="text-2xl font-bold text-success">{isDataLoaded ? "72%" : "0%"}</span>
                  </div>
                  <Progress value={isDataLoaded ? 72 : 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Fuzzy Matches</h4>
                      <p className="text-sm text-muted-foreground">AI-corrected name variations</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{isDataLoaded ? "18%" : "0%"}</span>
                  </div>
                  <Progress value={isDataLoaded ? 18 : 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Contextual Matches</h4>
                      <p className="text-sm text-muted-foreground">Advanced AI reasoning</p>
                    </div>
                    <span className="text-2xl font-bold text-accent">{isDataLoaded ? "8%" : "0%"}</span>
                  </div>
                  <Progress value={isDataLoaded ? 8 : 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Manual Review</h4>
                      <p className="text-sm text-muted-foreground">Requires human validation</p>
                    </div>
                    <span className="text-2xl font-bold text-warning">{isDataLoaded ? "2%" : "0%"}</span>
                  </div>
                  <Progress value={isDataLoaded ? 2 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence Score Distribution</CardTitle>
                <CardDescription>AI confidence levels across all matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
                  <p className="text-muted-foreground">Chart: Confidence score histogram</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Impact</CardTitle>
                <CardDescription>ROI and cost savings analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Manual Processing Cost</p>
                    <p className="text-2xl font-bold text-destructive">{isDataLoaded ? "$18,500" : "$0"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Per month (estimated)</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Automated Cost</p>
                    <p className="text-2xl font-bold text-primary">{isDataLoaded ? "$6,100" : "$0"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Per month (actual)</p>
                  </div>
                  <div className="p-4 rounded-lg border border-success bg-success/5">
                    <p className="text-sm text-muted-foreground mb-1">Net Savings</p>
                    <p className="text-2xl font-bold text-success">{isDataLoaded ? "$12,400" : "$0"}</p>
                    <p className="text-xs text-success mt-1">{isDataLoaded ? "67% cost reduction" : "N/A"}</p>
                  </div>
                </div>

                <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
                  <p className="text-muted-foreground">Chart: Monthly savings trend</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
