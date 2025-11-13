import { createContext, useContext, useState, ReactNode } from "react";

export interface BankTransaction {
  id: string;
  date: string;
  payer: string;
  amount: number;
  reference?: string;
  description?: string;
}

export interface Invoice {
  id: string;
  client: string;
  matter: string;
  date: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "pending" | "paid" | "partial";
}

export interface Remittance {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  reference?: string;
}

export interface Match {
  paymentRef: string;
  payer: string;
  amount: number;
  invoice: string;
  matchType: "Exact" | "Fuzzy (name)" | "Contextual" | "Reference";
  confidence: number;
  status: "posted" | "review";
}

interface DataContextType {
  bankStatements: BankTransaction[];
  invoices: Invoice[];
  remittances: Remittance[];
  matches: Match[];
  isDataLoaded: boolean;
  setBankStatements: (data: BankTransaction[]) => void;
  setInvoices: (data: Invoice[]) => void;
  setRemittances: (data: Remittance[]) => void;
  setMatches: (data: Match[]) => void;
  setIsDataLoaded: (value: boolean) => void;
  processData: (data?: { bankStatements?: BankTransaction[]; invoices?: Invoice[]; remittances?: Remittance[] }) => void;
  clearData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [bankStatements, setBankStatements] = useState<BankTransaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [remittances, setRemittances] = useState<Remittance[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const processData = (overrideData?: { bankStatements?: BankTransaction[]; invoices?: Invoice[]; remittances?: Remittance[] }) => {
    // Use override data if provided, otherwise use state
    const statementsToProcess = overrideData?.bankStatements || bankStatements;
    const invoicesToProcess = overrideData?.invoices || invoices;
    const remittancesToProcess = overrideData?.remittances || remittances;
    
    console.log("Processing data:", {
      bankStatements: statementsToProcess.length,
      invoices: invoicesToProcess.length,
      remittances: remittancesToProcess.length
    });
    
    // Match bank transactions to invoices
    const processedMatches: Match[] = [];
    
    statementsToProcess.forEach((transaction) => {
      // Try to find matching invoice
      const matchingInvoice = invoicesToProcess.find((inv) => {
        // Exact amount match (with small tolerance for floating point)
        if (Math.abs(inv.amount - transaction.amount) < 0.01) {
          // Check if payer name matches (exact or fuzzy)
          const payerLower = (transaction.payer || "").toLowerCase().trim();
          const clientLower = (inv.client || "").toLowerCase().trim();
          
          // Remove common suffixes and special characters for better matching
          const payerNormalized = payerLower.replace(/[^a-z0-9]/g, "").replace(/\b(ltd|llc|inc|corp|limited|corporation)\b/g, "");
          const clientNormalized = clientLower.replace(/[^a-z0-9]/g, "").replace(/\b(ltd|llc|inc|corp|limited|corporation)\b/g, "");
          
          if (payerLower === clientLower || 
              payerLower.includes(clientLower) || 
              clientLower.includes(payerLower) ||
              payerNormalized === clientNormalized ||
              payerNormalized.includes(clientNormalized) ||
              clientNormalized.includes(payerNormalized)) {
            return true;
          }
        }
        return false;
      });

      if (matchingInvoice) {
        // Determine match type
        let matchType: Match["matchType"] = "Exact";
        let confidence = 99;

        const payerLower = transaction.payer.toLowerCase();
        const clientLower = matchingInvoice.client.toLowerCase();

        if (payerLower !== clientLower) {
          if (payerLower.includes(clientLower) || clientLower.includes(payerLower)) {
            matchType = "Fuzzy (name)";
            confidence = 94;
          } else {
            matchType = "Contextual";
            confidence = 87;
          }
        }

        // Check if there's a remittance reference
        const remittance = remittancesToProcess.find(
          (rem) => rem.invoiceId === matchingInvoice.id
        );
        if (remittance && remittance.reference) {
          matchType = "Reference";
          confidence = 97;
        }

        processedMatches.push({
          paymentRef: transaction.id,
          payer: transaction.payer,
          amount: transaction.amount,
          invoice: matchingInvoice.id,
          matchType,
          confidence,
          status: confidence >= 95 ? "posted" : "review",
        });
      }
    });

    setMatches(processedMatches);
    setIsDataLoaded(true);
  };

  const clearData = () => {
    setBankStatements([]);
    setInvoices([]);
    setRemittances([]);
    setMatches([]);
    setIsDataLoaded(false);
  };

  return (
    <DataContext.Provider
      value={{
        bankStatements,
        invoices,
        remittances,
        matches,
        isDataLoaded,
        setBankStatements,
        setInvoices,
        setRemittances,
        setMatches,
        setIsDataLoaded,
        processData,
        clearData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

