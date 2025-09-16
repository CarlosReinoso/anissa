"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import SectionHero from "@/components/SectionHero";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any cart items or session data if needed
    localStorage.removeItem("cart");
  }, []);

  return (
    <section className="min-h-screen bg-third">
      <SectionHero title="Order Confirmed" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h2>

          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. We will send you an
            email confirmation with your order details shortly.
          </p>

          <div className="space-y-4">
            <Button onClick={() => router.push("/shop")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
