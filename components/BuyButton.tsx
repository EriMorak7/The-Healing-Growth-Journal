"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ShieldCheck, Check, X, ArrowRight, Lock } from "lucide-react";
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
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenModal = () => {
    setError("");
    setModalOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Initialize checkout in database
      const initRes = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          customerEmail,
          customerName,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok) throw new Error(initData.error || "Failed to initialize order.");

      const { reference, publicKey, amountKobo } = initData;

      // 2. Check if Paystack script is available or load it dynamically
      const loadPaystack = () => {
        return new Promise<boolean>((resolve) => {
          if ((window as any).PaystackPop) return resolve(true);
          const script = document.createElement("script");
          script.src = "https://js.paystack.co/v1/inline.js";
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const hasPaystack = await loadPaystack();

      // If valid Paystack key and script loaded
      if (hasPaystack && (window as any).PaystackPop && publicKey.startsWith("pk_live_")) {
        const handler = (window as any).PaystackPop.setup({
          key: publicKey,
          email: customerEmail,
          amount: amountKobo,
          currency: currency,
          ref: reference,
          callback: async (response: any) => {
            // Verify payment on server
            await fetch("/api/shop/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: response.reference || reference }),
            });
            router.push(`/shop/order-success?ref=${reference}`);
          },
          onClose: () => {
            setLoading(false);
          },
        });
        handler.openIframe();
      } else {
        // Test / Development environment: verify automatically
        await fetch("/api/shop/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        router.push(`/shop/order-success?ref=${reference}`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <button
          onClick={handleOpenModal}
          className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs uppercase tracking-widest font-bold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" />
          <span>Purchase & Download ({formatPrice(price, currency)})</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[#866746]">
          <ShieldCheck className="w-4 h-4 text-[#283E2C]" />
          <span>Paystack-secured instant PDF download</span>
        </div>
      </div>

      {/* Checkout Email Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#EAE0D1]">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#866746]">
                  Digital Download Checkout
                </span>
                <h3 className="font-serif text-xl text-[#22160D]">
                  {productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-[#866746] hover:bg-[#EAE0D1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 text-xs bg-[#FDF2F0] border border-[#F3C8C2] text-[#A83226] rounded-sm">
                {error}
              </div>
            )}

            <div className="p-3.5 bg-[#F4ECE0]/50 rounded-sm border border-[#EAE0D1] flex items-center justify-between">
              <span className="text-xs text-[#4F3925]">Total Due:</span>
              <span className="font-serif text-lg font-bold text-[#BD7350]">
                {formatPrice(price, currency)}
              </span>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1.5">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-sm text-[#22160D] focus:outline-none focus:ring-1 focus:ring-[#283E2C]"
                />
                <span className="block text-[11px] text-[#866746] mt-1">
                  Your PDF download link will be delivered here.
                </span>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-[#4F3925] mb-1.5">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Glory Ade"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-sm text-[#22160D] focus:outline-none focus:ring-1 focus:ring-[#283E2C]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest font-bold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] shadow-md transition-all disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{loading ? "Preparing Order..." : "Proceed to Secure Payment"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-center text-[#866746] pt-1">
                Secured by Paystack • Instant file delivery upon completion
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
