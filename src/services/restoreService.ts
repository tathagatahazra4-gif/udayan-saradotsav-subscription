import * as XLSX from "xlsx";
import { supabase } from "@/supabase/client";

export async function restoreDatabase(file: File) {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  for (const row of rows) {
    const { error } = await supabase
      .from("flats")
      .upsert(row, {
        onConflict: "flat_number",
      });

    if (error) {
      throw error;
    }
  }
}