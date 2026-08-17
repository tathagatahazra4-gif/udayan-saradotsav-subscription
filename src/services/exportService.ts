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
  const rows = data.map((row) => {
    const paidAmount =
      Number(
        row.subscription_amount || 0
      );

    const subscriptionAmount =
      paidAmount > 1300
        ? 1300
        : paidAmount;

    const extraDonation =
      paidAmount > 1300
        ? paidAmount - 1300
        : 0;

    return {
      "Flat Number":
        row.flat_number,

      "Owner Name":
        row.owner_name || "",

      "Mobile Number":
        row.mobile_number || "",

      "Family Members":
        row.family_members || 0,

      "Subscription Amount":
        subscriptionAmount,

      "Extra Donation":
        extraDonation,

      Status:
        row.status,

      "Payment Mode":
        row.payment_mode || "",

      "Receipt Number":
        row.receipt_number || "",

      "Transaction ID":
        row.transaction_id || "",

      "Collected By":
        row.collected_by || "",

      Remarks:
        row.remarks ||
        row.comments ||
        "",

      "Payment Date":
        row.payment_date || "",
    };
  });

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 15 }, // Flat Number
    { wch: 25 }, // Owner Name
    { wch: 18 }, // Mobile Number
    { wch: 15 }, // Family Members
    { wch: 20 }, // Subscription Amount
    { wch: 18 }, // Extra Donation
    { wch: 12 }, // Status
    { wch: 18 }, // Payment Mode
    { wch: 18 }, // Receipt Number
    { wch: 25 }, // Transaction ID
    { wch: 20 }, // Collected By
    { wch: 30 }, // Remarks
    { wch: 18 }, // Payment Date
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

    "Point Of Contact":
      row.point_of_contact || "",

    "Collected By":
      row.collected_by || "",

    "Collection Date":
      row.collection_date || "",
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 30 }, // Company Name
    { wch: 15 }, // Amount
    { wch: 18 }, // Payment Mode
    { wch: 20 }, // Cheque Number
    { wch: 18 }, // Voucher ID
    { wch: 25 }, // Point Of Contact
    { wch: 22 }, // Collected By
    { wch: 18 }, // Collection Date
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