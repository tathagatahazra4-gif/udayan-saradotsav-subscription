export interface Payment {
  flat_number: string;

  owner_name: string;

  mobile_number: string;

  subscription_amount: number;

  payment_mode: string;

  receipt_number: string;

  transaction_id: string;

  collected_by: string;

  payment_date: string;

  status: string;
}