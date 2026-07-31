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
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-8">

      <h2 className="text-xl md:text-2xl font-bold mb-5">
        Recent Payments
      </h2>

      {/* ---------------- Desktop Table ---------------- */}

      <div className="hidden md:block overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Flat</th>
              <th className="text-left py-3">Owner</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Mode</th>
              <th className="text-left py-3">Collector</th>

            </tr>

          </thead>

          <tbody>

            {payments.map((payment) => (

              <tr
                key={payment.flat_number}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 font-medium">
                  {payment.flat_number}
                </td>

                <td>{payment.owner_name || "-"}</td>

                <td className="font-semibold text-green-700">
                  ₹{payment.subscription_amount}
                </td>

                <td>{payment.payment_mode || "-"}</td>

                <td>{payment.collected_by || "-"}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ---------------- Mobile Cards ---------------- */}

      <div className="md:hidden space-y-4">

        {payments.map((payment) => (

          <div
            key={payment.flat_number}
            className="border rounded-xl p-4 shadow-sm"
          >

            <div className="flex justify-between items-center mb-3">

              <h3 className="font-bold text-blue-900">
                {payment.flat_number}
              </h3>

              <span className="text-lg font-bold text-green-700">
                ₹{payment.subscription_amount}
              </span>

            </div>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Owner
                </span>

                <span className="font-medium text-right">
                  {payment.owner_name || "-"}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Payment Mode
                </span>

                <span>
                  {payment.payment_mode || "-"}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Collector
                </span>

                <span className="text-right">
                  {payment.collected_by || "-"}
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}