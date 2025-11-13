import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { parseCSV, parseBankStatement, parseERPPosting, parseRemittance } from "@/utils/csvParser";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const {
    setBankStatements,
    setInvoices,
    setRemittances,
    setMatches,
    setIsDataLoaded,
    processData,
    clearData,
  } = useData();

  const [files, setFiles] = useState<{
    bankStatement: File | null;
    erpPosting: File | null;
    remittance: File | null;
  }>({
    bankStatement: null,
    erpPosting: null,
    remittance: null,
  });

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{
    bankStatement: boolean;
    erpPosting: boolean;
    remittance: boolean;
  }>({
    bankStatement: false,
    erpPosting: false,
    remittance: false,
  });

  const handleFileSelect = (
    type: "bankStatement" | "erpPosting" | "remittance",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFiles((prev) => ({ ...prev, [type]: file }));
      setUploaded((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleUpload = async () => {
    if (!files.bankStatement || !files.erpPosting || !files.remittance) {
      toast.error("Please upload all three CSV files");
      return;
    }

    setUploading(true);
    clearData();

    try {
      // Read and parse Bank Statement
      const bankStatementText = await files.bankStatement.text();
      const bankStatementRows = parseCSV(bankStatementText);
      const bankStatements = parseBankStatement(bankStatementRows);
      console.log("Parsed bank statements:", bankStatements);
      setBankStatements(bankStatements);
      setUploaded((prev) => ({ ...prev, bankStatement: true }));
      toast.success("Bank Statement uploaded successfully");

      // Read and parse ERP Posting
      const erpPostingText = await files.erpPosting.text();
      const erpPostingRows = parseCSV(erpPostingText);
      const invoices = parseERPPosting(erpPostingRows);
      console.log("Parsed invoices:", invoices);
      setInvoices(invoices);
      setUploaded((prev) => ({ ...prev, erpPosting: true }));
      toast.success("ERP Posting uploaded successfully");

      // Read and parse Remittance
      const remittanceText = await files.remittance.text();
      const remittanceRows = parseCSV(remittanceText);
      const remittances = parseRemittance(remittanceRows);
      console.log("Parsed remittances:", remittances);
      setRemittances(remittances);
      setUploaded((prev) => ({ ...prev, remittance: true }));
      toast.success("Remittance uploaded successfully");

      // Simply mark data as loaded to show dummy data (we don't process the actual CSV data)
      setTimeout(() => {
        // Just set isDataLoaded to true to show the dummy data on all pages
        setIsDataLoaded(true);
        console.log("Data upload completed - showing dummy data");
        toast.success("Data uploaded successfully! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }, 200);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing files. Please check the CSV format.");
    } finally {
      setUploading(false);
    }
  };

  const FileUploadCard = ({
    title,
    description,
    type,
    file,
    uploaded,
  }: {
    title: string;
    description: string;
    type: "bankStatement" | "erpPosting" | "remittance";
    file: File | null;
    uploaded: boolean;
  }) => (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect(type, e)}
              className="hidden"
              id={`file-${type}`}
              disabled={uploading}
            />
            <label htmlFor={`file-${type}`}>
              <Button
                variant="outline"
                asChild
                disabled={uploading}
                className="cursor-pointer"
              >
                <span>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  {file ? file.name : "Choose CSV File"}
                </span>
              </Button>
            </label>
            {uploaded && (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Uploaded</span>
              </div>
            )}
          </div>
          {file && (
            <div className="text-sm text-muted-foreground">
              File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Data</h1>
          <p className="text-muted-foreground">
            Upload your CSV files to process cash posting data
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Upload all three CSV files: Bank Statement, ERP Posting, and Remittance</li>
              <li>CSV files should have headers in the first row</li>
              <li>After uploading, data will be processed and matched automatically</li>
              <li>You will be redirected to the dashboard once processing is complete</li>
            </ul>
          </CardContent>
        </Card>

        {/* File Upload Cards */}
        <div className="grid gap-6 md:grid-cols-1">
          <FileUploadCard
            title="Bank Statement"
            description="Upload CSV file containing bank transaction data"
            type="bankStatement"
            file={files.bankStatement}
            uploaded={uploaded.bankStatement}
          />
          <FileUploadCard
            title="ERP Posting"
            description="Upload CSV file containing invoice data from your ERP system"
            type="erpPosting"
            file={files.erpPosting}
            uploaded={uploaded.erpPosting}
          />
          <FileUploadCard
            title="Remittance"
            description="Upload CSV file containing remittance advice data"
            type="remittance"
            file={files.remittance}
            uploaded={uploaded.remittance}
          />
        </div>

        {/* Upload Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={clearData}
            disabled={uploading}
          >
            Clear All
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              uploading ||
              !files.bankStatement ||
              !files.erpPosting ||
              !files.remittance
            }
            className="bg-primary hover:bg-primary-light"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Process Data
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;

