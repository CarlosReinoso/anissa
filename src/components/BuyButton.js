"use client";
import { useState } from "react";
import Button from "./Button";

const BuyButton = ({ product, selectedVariant }) => {
  console.log("🚀 ~ BuyButton ~ product:", product);
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    // Use product price if no variant is selected
    const price = selectedVariant?.price || product.price;
    // Convert price to an integer (remove currency symbol and convert to pence)
    const priceInPence = price * 100;

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          amount: priceInPence, // Stripe expects amount in cents
          currency: "gbp",
          quantity: 1,
        }),
      });

      const data = await response.json();
      console.log("🚀 ~ handleBuyNow ~ data:", data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Error creating Stripe session:", data);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred while processing your payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleBuyNow} disabled={loading}>
      {loading ? "Processing..." : "Buy Now"}
    </Button>
  );
};

export default BuyButton;
