"use client";

import React, { useState } from "react";
import { Download, ShieldCheck, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface BuyButtonProps {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
}

export default function BuyButton({
  productId,
  productName,
  price,
  currency = "NGN",
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    // Simulating Paystack test-mode checkout initialization
    setTimeout(() => {
      setLoading(false);
      setPurchased(true);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {purchased ? (
        <div className="p-6 bg-[#E5EDE6] border border-[#283E2C] rounded-sm text-center space-y-3 animate-in fade-in duration-300">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#283E2C] text-[#FAF7F2] flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <h4 className="font-serif text-lg text-[#283E2C] font-semibold">
            Order Confirmed!
          </h4>
          <p className="text-xs text-[#283E2C] leading-relaxed">
            Thank you for purchasing <strong>{productName}</strong>. Your instant download link has been prepared.
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Downloading digital PDF package...");
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] shadow-sm hover:bg-[#1D2D20] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Now</span>
          </a>
        </div>
      ) : (
        <>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 px-6 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
          >
            <Download className="w-4 h-4" />
            <span>
              {loading
                ? "Connecting to Paystack..."
                : `Purchase for ${formatPrice(price, currency)}`}
            </span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#866746] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#283E2C]" />
            <span>Instant delivery • Protected by Paystack Nigeria</span>
          </div>
        </>
      )}
    </div>
  );
}
