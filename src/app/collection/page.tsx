"use client";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import PaymentForm from "@/components/forms/PaymentForm";

export default function CollectionPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-4xl mx-auto mt-10">

          <h1 className="text-3xl font-bold mb-8">
            Subscription Collection
          </h1>

          <PaymentForm />

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}