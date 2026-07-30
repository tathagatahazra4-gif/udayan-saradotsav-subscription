import * as XLSX from "xlsx";
import { supabase } from "@/supabase/client";

export async function importFlats(file: File) {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  let imported = 0;
  let updated = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      const flatNumber =
        row["Flat Number"]?.toString().trim();

      if (!flatNumber) {
        failed++;
        continue;
      }

      const { data: existing } = await supabase
        .from("flats")
        .select("flat_number")
        .eq("flat_number", flatNumber)
        .single();

      const payload = {
        flat_number: flatNumber,
        owner_name: row["Owner Name"] || "",
        mobile_number: row["Mobile Number"] || "",
        family_members: Number(row["Family Members"] || 0),
        subscription_amount: Number(
          row["Subscription Amount"] || 0
        ),
      };

      if (existing) {
        const { error } = await supabase
          .from("flats")
          .update(payload)
          .eq("flat_number", flatNumber);

        if (error) throw error;

        updated++;
      } else {
        const { error } = await supabase
          .from("flats")
          .insert([
            {
              ...payload,
              status: "Pending",
            },
          ]);

        if (error) throw error;

        imported++;
      }
    } catch (err) {
      console.error(err);
      failed++;
    }
  }

  return {
    imported,
    updated,
    failed,
  };
}