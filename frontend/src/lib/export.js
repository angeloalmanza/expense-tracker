import toast from "react-hot-toast";

const buildCsv = (rows) => {
  const headers = ["id", "name", "amount", "type", "category", "date"];
  const escapeCsv = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    const escaped = stringValue.replace(/"/g, '""');
    return `="${escaped}"`;
  };

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(","),
    ),
  ];

  return csvRows.join("\n");
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportCsv = (transactions) => {
  if (transactions.length === 0) {
    toast.error("Nessuna transazione da esportare");
    return;
  }

  const csvContent = buildCsv(transactions);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `transactions-${timestamp}.csv`);
};

export const exportJson = (transactions) => {
  if (transactions.length === 0) {
    toast.error("Nessuna transazione da esportare");
    return;
  }

  const jsonContent = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadBlob(blob, `transactions-${timestamp}.json`);
};
