export interface Flat {
  flat_number: string;

  building_type: string;

  building_no: number;

  owner_name: string;

  mobile_number: string;

  family_members: number;

  subscription_amount: number;

  payment_mode: string;

  transaction_id: string;

  receipt_number: string;

  collected_by: string;

  status: "Paid" | "Pending";

  remarks: string;

  payment_date: string | null;

  last_updated_by: string;

  created_at: string;

  updated_at: string;
}