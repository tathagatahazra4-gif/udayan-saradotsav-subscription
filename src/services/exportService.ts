import * as XLSX from "xlsx";

export function exportToExcel(data: any[]) {
  const rows = data.map((row) => ({
    "Flat Number": row.flat_number,
    "Owner Name": row.owner_name || "",
    "Mobile Number": row.mobile_number || "",
    "Family Members": row.family_members || 0,
    "Subscription Amount": row.subscription_amount || 0,
    Status: row.status,
    "Payment Mode": row.payment_mode || "",
    "Receipt Number": row.receipt_number || "",
    "Transaction ID": row.transaction_id || "",
    "Collected By": row.collected_by || "",
    Remarks: row.remarks || "",
    "Payment Date": row.payment_date || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 25 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Subscriptions"
  );

  const today = new Date().toISOString().split("T")[0];

  XLSX.writeFile(
    workbook,
    `Udayan_Subscription_Report_${today}.xlsx`
  );
}