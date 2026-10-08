import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Mail,
  Heart,
} from "lucide-react";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  if (!searchParams.ref) {
    notFound();
  }

  const order = await db.order.findUnique({
    where: { paystackReference: searchParams.ref },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) {
    notFound();
  }

  const product = order.items[0]?.product;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
      {/* Top Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E5EDE6] text-[#283E2C] mx-auto flex items-center justify-center border-2 border-[#283E2C] shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
          Payment Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#22160D] tracking-tight">
          Thank you for welcoming this into your journey.
        </h1>

        <p className="text-base font-editorial text-[#4F3925] max-w-xl mx-auto leading-relaxed">
          Your order has been verified. We hope these pages offer you comfort, courage, and a gentle place to breathe.
        </p>
      </div>

      {/* Order Details & Download Card */}
      <div className="paper-card p-8 sm:p-10 space-y-8 bg-[#FAF7F2]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE0D1]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#866746] font-semibold">
              Order Reference
            </span>
            <div className="font-mono text-sm font-bold text-[#22160D]">
              {order.orderNumber}
            </div>
          </div>
          <div className="sm:text-right">
            <span className="text-[10px] uppercase tracking-widest text-[#866746] font-semibold">
              Date Completed
            </span>
            <div className="text-xs text-[#4F3925]">
              {formatDate(order.createdAt)}
            </div>
          </div>
        </div>

        {/* Product Purchased Info */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
            Item Purchased
          </span>
          <div className="p-5 bg-[#F4ECE0]/50 rounded-sm border border-[#EAE0D1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-lg text-[#22160D]">
                {product?.name || "Digital Guide"}
              </h3>
              <p className="text-xs text-[#6A4F35]">
                {product?.tagline || "Immediate digital download in printable PDF format."}
              </p>
            </div>
            <div className="font-serif text-lg font-bold text-[#BD7350] sm:text-right">
              {formatPrice(order.totalAmount, order.currency)}
            </div>
          </div>
        </div>

        {/* Primary Download Button */}
        <div className="text-center pt-4 space-y-3">
          <a
            href={`/api/shop/download/${order.orderNumber}`}
            className="inline-flex items-center justify-center gap-2.5 px-10 py-4 text-xs uppercase tracking-widest font-bold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download Digital Workbook (PDF)</span>
          </a>
          <p className="text-[11px] text-[#866746]">
            File delivery verified • Download link is associated with {order.customerEmail}
          </p>
        </div>

        {/* Support Note */}
        <div className="pt-6 border-t border-[#EAE0D1] flex items-start gap-3 text-xs text-[#4F3925] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#283E2C] shrink-0 mt-0.5" />
          <span>
            A purchase confirmation has been logged for your records. If you experience any technical difficulties accessing your workbook, please contact us at{" "}
            <a
              href="mailto:hello@thehealingandgrowthjournal.com"
              className="underline text-[#283E2C]"
            >
              hello@thehealingandgrowthjournal.com
            </a>
            .
          </span>
        </div>
      </div>

      {/* Return Links */}
      <div className="text-center pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs uppercase tracking-wider font-semibold">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-[#283E2C] hover:underline"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read the Journal</span>
        </Link>
        <span className="text-[#C4B19B] hidden sm:inline">•</span>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-[#866746] hover:text-[#283E2C]"
        >
          <span>Return to Shop</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
