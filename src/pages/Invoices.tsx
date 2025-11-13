import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText, Upload, Inbox } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/context/DataContext";
import { Link } from "react-router-dom";
import { useState } from "react";

const Invoices = () => {
  const { isDataLoaded } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  // Original dummy data
  const invoices = [
    {
      id: "INV-2025-001",
      client: "ABC Holdings Ltd",
      matter: "MTR-1029",
      date: "2025-10-10",
      amount: "$125,000.00",
      currency: "USD",
      dueDate: "2025-11-09",
      status: "pending",
    },
    {
      id: "INV-2025-002",
      client: "Orion Real Estate",
      matter: "MTR-1132",
      date: "2025-10-12",
      amount: "$68,500.00",
      currency: "USD",
      dueDate: "2025-11-11",
      status: "pending",
    },
    {
      id: "INV-2025-003",
      client: "Zenith Energy Corp.",
      matter: "MTR-1204",
      date: "2025-10-15",
      amount: "$93,200.00",
      currency: "GBP",
      dueDate: "2025-11-14",
      status: "pending",
    },
    {
      id: "INV-2025-004",
      client: "Federal Motors",
      matter: "MTR-1158",
      date: "2025-10-16",
      amount: "$34,800.00",
      currency: "USD",
      dueDate: "2025-11-15",
      status: "pending",
    },
    {
      id: "INV-2025-005",
      client: "Nova Shipping Co.",
      matter: "MTR-1087",
      date: "2025-10-18",
      amount: "$17,500.00",
      currency: "EUR",
      dueDate: "2025-11-17",
      status: "pending",
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      invoice.id.toLowerCase().includes(query) ||
      invoice.client.toLowerCase().includes(query) ||
      invoice.matter.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Open Invoices</h1>
            <p className="text-muted-foreground">
              Manage and track outstanding receivables
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-light">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Outstanding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isDataLoaded ? "$339,000.00" : "$0.00"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {isDataLoaded ? "Across 5 invoices" : "No invoices"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Invoice Value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isDataLoaded ? "$67,800.00" : "$0.00"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per invoice
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Days Outstanding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isDataLoaded ? "18 days" : "0 days"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average aging
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invoice List</CardTitle>
                <CardDescription>All outstanding invoices</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isDataLoaded || filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  {!isDataLoaded
                    ? "No data uploaded yet"
                    : "No invoices found matching your search"}
                </p>
                {!isDataLoaded && (
                  <Link to="/upload">
                    <Button variant="outline" className="mt-4">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Data
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Matter</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {invoice.id}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{invoice.matter}</span>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell className="font-semibold">{invoice.amount}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-warning/10 text-warning">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
