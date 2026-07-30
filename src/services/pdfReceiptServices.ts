import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateReceipt(data: any) {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("UDAYAN SARADOTSAV SAMITY", 105, 18, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Subscription Collection Receipt", 105, 26, {
    align: "center",
  });

  doc.text(`Puja Year: 2026`, 105, 33, {
    align: "center",
  });

  autoTable(doc, {
    startY: 42,
    theme: "grid",
    head: [["Field", "Value"]],
    body: [
      ["Receipt No.", data.receipt_number || "-"],
      ["Flat Number", data.flat_number],
      ["Owner Name", data.owner_name || "-"],
      ["Mobile Number", data.mobile_number || "-"],
      ["Family Members", String(data.family_members ?? "-")],
      ["Subscription Amount", `₹${data.subscription_amount ?? 0}`],
      ["Payment Mode", data.payment_mode || "-"],
      ["Transaction ID", data.transaction_id || "-"],
      ["Collected By", data.collected_by || "-"],
      ["Status", data.status || "-"],
      [
        "Payment Date",
        data.payment_date
          ? new Date(data.payment_date).toLocaleString()
          : "-",
      ],
      ["Remarks", data.remarks || "-"],
    ],
  });

  const finalY =
    (doc as any).lastAutoTable?.finalY ?? 120;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);

  doc.text(
    "Thank you for your contribution towards Udayan Saradotsav Samity.",
    14,
    finalY + 15
  );

  doc.save(
    `Receipt-${data.flat_number}.pdf`
  );
}