import * as XLSX from "xlsx";

import {
  Filesystem,
  Directory,
} from "@capacitor/filesystem";

import {
  Capacitor,
} from "@capacitor/core";

// ======================================================
// DATE
// ======================================================

function getToday() {
  return new Date()
    .toISOString()
    .split("T")[0];
}

// ======================================================
// SAVE WORKBOOK
//
// Desktop / browser:
// XLSX.writeFile()
//
// Capacitor Android / native:
// Generate Base64 XLSX and save using Filesystem
// ======================================================

async function saveWorkbook(
  workbook: XLSX.WorkBook,
  fileName: string
) {
  try {
    const isNative =
      Capacitor.isNativePlatform();

    // ============================================
    // NORMAL DESKTOP / MOBILE BROWSER
    // ============================================

    if (!isNative) {
      XLSX.writeFile(
        workbook,
        fileName
      );

      return;
    }

    // ============================================
    // CAPACITOR ANDROID / NATIVE APP
    // ============================================

    const base64Data =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "base64",
        }
      );

    const result =
      await Filesystem.writeFile({
        path: fileName,

        data: base64Data,

        directory:
          Directory.Documents,

        recursive: true,
      });

    console.log(
      "Excel report saved:",
      result.uri
    );

    alert(
      `Report saved successfully.\n\nFile: ${fileName}`
    );
  } catch (error) {
    console.error(
      "Failed to save Excel report:",
      error
    );

    alert(
      "Failed to save Excel report."
    );

    throw error;
  }
}

// ======================================================
// SUBSCRIPTION EXPORT
// ======================================================

export async function exportToExcel(
  data: any[]
) {
  const rows = data.map((row) => {
    const paidAmount =
      Number(
        row.subscription_amount || 0
      );

    // Normal yearly subscription = ₹1300
    //
    // Example:
    // ₹1300 -> Subscription ₹1300 / Extra ₹0
    // ₹1500 -> Subscription ₹1300 / Extra ₹200
    // ₹2500 -> Subscription ₹1300 / Extra ₹1200

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
    XLSX.utils.json_to_sheet(
      rows
    );

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

  await saveWorkbook(
    workbook,
    `Udayan_Subscription_Report_${getToday()}.xlsx`
  );
}

// ======================================================
// DONATION EXPORT
// ======================================================

export async function exportDonationsToExcel(
  data: any[]
) {
  const rows = data.map(
    (row) => ({
      "Donor Name":
        row.donor_name || "",

      Amount:
        Number(
          row.amount || 0
        ),

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
    })
  );

  const worksheet =
    XLSX.utils.json_to_sheet(
      rows
    );

  worksheet["!cols"] = [
    { wch: 28 }, // Donor
    { wch: 15 }, // Amount
    { wch: 18 }, // Flat
    { wch: 18 }, // Mobile
    { wch: 18 }, // Bill
    { wch: 18 }, // Mode
    { wch: 40 }, // Purpose
    { wch: 22 }, // Collected By
    { wch: 18 }, // Date
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Donations"
  );

  await saveWorkbook(
    workbook,
    `Udayan_Donation_Report_${getToday()}.xlsx`
  );
}

// ======================================================
// SPONSOR / ADVERTISEMENT EXPORT
// ======================================================

export async function exportSponsorsToExcel(
  data: any[]
) {
  const rows = data.map(
    (row) => ({
      "Company Name":
        row.company_name || "",

      Amount:
        Number(
          row.amount || 0
        ),

      "Payment Mode":
        row.payment_mode || "",

      "Cheque Number":
        row.cheque_number || "",

      "Voucher ID":
        row.voucher_id || "",

      "Point Of Contact":
        row.point_of_contact || "",

      "Collected By":
        row.collected_by ||
        row.created_by ||
        "",

      "Collection Date":
        row.collection_date || "",
    })
  );

  const worksheet =
    XLSX.utils.json_to_sheet(
      rows
    );

  worksheet["!cols"] = [
    { wch: 30 }, // Company
    { wch: 15 }, // Amount
    { wch: 18 }, // Payment Mode
    { wch: 20 }, // Cheque
    { wch: 18 }, // Voucher
    { wch: 25 }, // Point Of Contact
    { wch: 22 }, // Collected By
    { wch: 18 }, // Date
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Sponsors"
  );

  await saveWorkbook(
    workbook,
    `Udayan_Sponsor_Report_${getToday()}.xlsx`
  );
}

// ======================================================
// OVERALL COLLECTION SUMMARY EXPORT
// ======================================================

export async function exportOverallCollectionSummary(
  values: {
    subscriptionCollection: number;
    donationCollection: number;
    sponsorCollection: number;
    governmentGrantCollection: number;
  }
) {
  const grandTotal =
    Number(
      values.subscriptionCollection ||
        0
    ) +
    Number(
      values.donationCollection ||
        0
    ) +
    Number(
      values.sponsorCollection ||
        0
    ) +
    Number(
      values.governmentGrantCollection ||
        0
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
    XLSX.utils.json_to_sheet(
      rows
    );

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

  await saveWorkbook(
    workbook,
    `Udayan_Overall_Collection_Summary_${getToday()}.xlsx`
  );
}