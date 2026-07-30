import { Flat } from "@/types/flat";
import {
  MIG_BUILDINGS,
  LIG_BUILDINGS,
  SPECIAL_BUILDINGS,
} from "@/data/buildings";

export function generateFlats(): Flat[] {
  const flats: Flat[] = [];

  const now = new Date().toISOString();

  // Standard MIG Layout (16 flats)
  const migLayout = [
    "01A", "01B", "01C", "01D",
    "02A", "02B", "02C", "02D",
    "03A", "03B", "03C", "03D",
    "04A", "04B", "04C", "04D",
  ];

  // LIG Layout (11 flats)
  const ligLayout = [
    "01A", "01B", "01C", "01D",
    "02A", "02B", "02C", "02D",
    "03B", "03C",
    "04C",
  ];

  // ---------------- MIG Buildings ----------------

  MIG_BUILDINGS.forEach((buildingNo) => {
    migLayout.forEach((flat) => {
      flats.push({
        flat_number: `UV-${buildingNo.toString().padStart(2, "0")}-${flat}`,
        building_type: "MIG",
        building_no: buildingNo,

        owner_name: "",
        mobile_number: "",
        family_members: 0,

        subscription_amount: 0,

        payment_mode: "",

        transaction_id: "",

        receipt_number: "",

        collected_by: "",

        status: "Pending",

        remarks: "",

        payment_date: null,

        last_updated_by: "",

        created_at: now,

        updated_at: now,
      });
    });
  });

  // ---------------- Special Buildings ----------------

  SPECIAL_BUILDINGS.forEach((building) => {
    building.flats.forEach((flat) => {
      flats.push({
        flat_number: `UV-${building.number}-${flat}`,
        building_type: "MIG",
        building_no: building.number,

        owner_name: "",
        mobile_number: "",
        family_members: 0,

        subscription_amount: 0,

        payment_mode: "",

        transaction_id: "",

        receipt_number: "",

        collected_by: "",

        status: "Pending",

        remarks: "",

        payment_date: null,

        last_updated_by: "",

        created_at: now,

        updated_at: now,
      });
    });
  });

  // ---------------- LIG Buildings ----------------

  LIG_BUILDINGS.forEach((buildingNo) => {
    ligLayout.forEach((flat) => {
      flats.push({
        flat_number: `UG-${buildingNo.toString().padStart(2, "0")}-${flat}`,
        building_type: "LIG",
        building_no: buildingNo,

        owner_name: "",
        mobile_number: "",
        family_members: 0,

        subscription_amount: 0,

        payment_mode: "",

        transaction_id: "",

        receipt_number: "",

        collected_by: "",

        status: "Pending",

        remarks: "",

        payment_date: null,

        last_updated_by: "",

        created_at: now,

        updated_at: now,
      });
    });
  });

  return flats;
}