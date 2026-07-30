import * as XLSX from "xlsx";
import { supabase } from "@/supabase/client";

export async function exportDatabase() {
  const { data, error } = await supabase
    .from("flats")
    .select("*")
    .order("flat_number");

  if (error) throw error;

  const worksheet = XLSX.utils.json_to_sheet(data ?? []);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Flats"
  );

  const date = new Date()
    .toISOString()
    .slice(0, 10);

  XLSX.writeFile(
    workbook,
    `Udayan-Backup-${date}.xlsx`
  );
}