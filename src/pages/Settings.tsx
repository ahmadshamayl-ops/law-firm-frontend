import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/FileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();

  const handleFileUploadComplete = () => {
    toast.success("File processed successfully! Check Dashboard for results.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your CashPost AI preferences and upload files
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* File Upload */}
          <FileUpload onUploadComplete={handleFileUploadComplete} />
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.full_name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Global Law Partners LLP" />
              </div>
              <Button className="bg-primary hover:bg-primary-light">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Automation Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure AI matching preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-post high confidence matches</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically post matches with confidence ≥ 95%
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for exceptions and pending reviews
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fuzzy name matching</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable AI to match similar company names
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="confidence">Minimum confidence threshold</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="confidence"
                    type="number"
                    defaultValue="85"
                    min="0"
                    max="100"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle>ERP Integration</CardTitle>
              <CardDescription>Connect your accounting system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="erp-system">ERP System</Label>
                <Input id="erp-system" defaultValue="SAP S/4HANA" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  defaultValue="https://api.company.com/v1"
                  disabled
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm text-success">Connected</span>
              </div>
              <Button variant="outline">Reconfigure Integration</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
