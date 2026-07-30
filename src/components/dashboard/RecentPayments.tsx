"use client";

interface Payment {
  flat_number: string;
  owner_name: string;
  subscription_amount: number;
  payment_mode: string;
  collected_by: string;
}

interface Props {
  payments: Payment[];
}

export default function RecentPayments({ payments }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Recent Payments
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Flat</th>
            <th className="text-left py-2">Owner</th>
            <th className="text-left py-2">Amount</th>
            <th className="text-left py-2">Mode</th>
            <th className="text-left py-2">Collector</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.flat_number}
              className="border-b"
            >
              <td className="py-2">{payment.flat_number}</td>
              <td>{payment.owner_name || "-"}</td>
              <td>₹{payment.subscription_amount}</td>
              <td>{payment.payment_mode || "-"}</td>
              <td>{payment.collected_by || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}