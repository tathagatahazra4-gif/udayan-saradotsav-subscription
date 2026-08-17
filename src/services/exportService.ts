import * as XLSX from "xlsx";

function getToday() {
  return new Date()
    .toISOString()
    .split("T")[0];
}

// ======================================================
// SUBSCRIPTION EXPORT
// ======================================================

export function exportToExcel(data: any[]) {
  const rows = data.map((row) => ({
    "Flat Number": row.flat_number,
    "Owner Name": row.owner_name || "",
    "Mobile Number": row.mobile_number || "",
    "Family Members": row.family_members || 0,
    "Subscription Amount":
      row.subscription_amount || 0,
    Status: row.status,
    "Payment Mode":
      row.payment_mode || "",
    "Receipt Number":
      row.receipt_number || "",
    "Transaction ID":
      row.transaction_id || "",
    "Collected By":
      row.collected_by || "",
    Remarks:
      row.remarks || row.comments || "",
    "Payment Date":
      row.payment_date || "",
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

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
    { wch: 30 },
    { wch: 18 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Subscriptions"
  );

  XLSX.writeFile(
    workbook,
    `Udayan_Subscription_Report_${getToday()}.xlsx`
  );
}

// ======================================================
// DONATION EXPORT
// ======================================================

export function exportDonationsToExcel(
  data: any[]
) {
  const rows = data.map((row) => ({
    "Donor Name":
      row.donor_name || "",

    Amount:
      Number(row.amount || 0),

    "Flat Number":
      row.flat_number || "",

    "Mobile Number":
      row.mobile_number || "",

    "Bill Number":
      row.bill_number || "",

    "Payment Mode":
      row.payment_mode || "",

    "Purpose / Remarks":
      row.purpose || "",

    "Collected By":
      row.collected_by ||
      row.created_by ||
      "",

    "Donation Date":
      row.donation_date || "",
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 40 },
    { wch: 22 },
    { wch: 18 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Donations"
  );

  XLSX.writeFile(
    workbook,
    `Udayan_Donation_Report_${getToday()}.xlsx`
  );
}

// ======================================================
// SPONSOR / ADVERTISEMENT EXPORT
// ======================================================

export function exportSponsorsToExcel(
  data: any[]
) {
  const rows = data.map((row) => ({
    "Company Name":
      row.company_name || "",

    Amount:
      Number(row.amount || 0),

    "Payment Mode":
      row.payment_mode || "",

    "Cheque Number":
      row.cheque_number || "",

    "Voucher ID":
      row.voucher_id || "",

    "Collected By":
      row.collected_by || "",

    "Collection Date":
      row.collection_date || "",
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Sponsors"
  );

  XLSX.writeFile(
    workbook,
    `Udayan_Sponsor_Report_${getToday()}.xlsx`
  );
}

// ======================================================
// OVERALL COLLECTION SUMMARY EXPORT
// ======================================================

export function exportOverallCollectionSummary(
  values: {
    subscriptionCollection: number;
    donationCollection: number;
    sponsorCollection: number;
    governmentGrantCollection: number;
  }
) {
  const grandTotal =
    Number(
      values.subscriptionCollection || 0
    ) +
    Number(
      values.donationCollection || 0
    ) +
    Number(
      values.sponsorCollection || 0
    ) +
    Number(
      values.governmentGrantCollection || 0
    );

  const rows = [
    {
      "Collection Segment":
        "Subscription Collection",

      Amount:
        Number(
          values.subscriptionCollection ||
            0
        ),
    },

    {
      "Collection Segment":
        "Donation Collection",

      Amount:
        Number(
          values.donationCollection ||
            0
        ),
    },

    {
      "Collection Segment":
        "Advertisement / Sponsors",

      Amount:
        Number(
          values.sponsorCollection ||
            0
        ),
    },

    {
      "Collection Segment":
        "Government Grants",

      Amount:
        Number(
          values.governmentGrantCollection ||
            0
        ),
    },

    {
      "Collection Segment":
        "GRAND TOTAL",

      Amount:
        grandTotal,
    },
  ];

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 32 },
    { wch: 20 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Collection Summary"
  );

  XLSX.writeFile(
    workbook,
    `Udayan_Overall_Collection_Summary_${getToday()}.xlsx`
  );
}