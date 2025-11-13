export interface CSVRow {
  [key: string]: string;
}

export function parseCSV(content: string): CSVRow[] {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  // Parse header
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  
  // Parse rows
  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    if (values.length === 0 || values.every((v) => !v)) continue;
    
    const row: CSVRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    rows.push(row);
  }

  return rows;
}

export function parseBankStatement(csvRows: CSVRow[]): any[] {
  return csvRows.map((row, index) => {
    // Try to find common column names (with various formats)
    const id = row["Reference_No"] || row["Reference No"] || row["Transaction ID"] || row["ID"] || row["id"] || row["Reference"] || `TRX-${Date.now()}-${index}`;
    const date = row["Value_Date"] || row["Value Date"] || row["Date"] || row["date"] || row["Transaction Date"] || "";
    const payer = row["Payer_Name"] || row["Payer Name"] || row["Payer"] || row["payer"] || row["From"] || row["Description"] || "";
    const amountStr = row["Amount"] || row["amount"] || row["Transaction Amount"] || "0";
    // Remove commas and other non-numeric characters except decimal point and minus sign
    const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ""));
    const reference = row["Reference_No"] || row["Reference No"] || row["Reference"] || row["reference"] || row["Ref"] || "";
    const description = row["Description"] || row["description"] || "";

    return {
      id,
      date,
      payer,
      amount: isNaN(amount) ? 0 : amount,
      reference,
      description,
    };
  });
}

export function parseERPPosting(csvRows: CSVRow[]): any[] {
  return csvRows.map((row, index) => {
    const id = row["Invoice_ID"] || row["Invoice ID"] || row["ID"] || row["id"] || `INV-${Date.now()}-${index}`;
    const client = row["Client_Name"] || row["Client Name"] || row["Client"] || row["client"] || row["Customer"] || "";
    const matter = row["Matter_ID"] || row["Matter ID"] || row["Matter"] || row["matter"] || "";
    const date = row["Invoice_Date"] || row["Invoice Date"] || row["Date"] || row["date"] || "";
    const amountStr = row["Invoice_Amount (USD)"] || row["Invoice_Amount"] || row["Invoice Amount"] || row["Amount"] || row["amount"] || "0";
    // Remove commas and other non-numeric characters except decimal point and minus sign
    const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ""));
    const currency = row["Currency"] || row["currency"] || "USD";
    const dueDate = row["Due_Date"] || row["Due Date"] || row["dueDate"] || row["Due"] || "";

    return {
      id,
      client,
      matter,
      date,
      amount: isNaN(amount) ? 0 : amount,
      currency,
      dueDate,
      status: "pending" as const,
    };
  });
}

export function parseRemittance(csvRows: CSVRow[]): any[] {
  return csvRows.map((row, index) => {
    const id = row["Remittance_ID"] || row["Remittance ID"] || row["ID"] || row["id"] || `REM-${Date.now()}-${index}`;
    const invoiceId = row["Invoice_Reference"] || row["Invoice Reference"] || row["Invoice_ID"] || row["Invoice ID"] || row["Invoice"] || row["invoiceId"] || "";
    const amountStr = row["Payment_Amount"] || row["Payment Amount"] || row["Amount"] || row["amount"] || row["Remittance Amount"] || "0";
    // Remove commas and other non-numeric characters except decimal point and minus sign
    const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, ""));
    const date = row["Date"] || row["date"] || row["Remittance Date"] || "";
    const reference = row["Notes"] || row["Reference"] || row["reference"] || row["Ref"] || "";

    return {
      id,
      invoiceId,
      amount: isNaN(amount) ? 0 : amount,
      date,
      reference,
    };
  });
}

