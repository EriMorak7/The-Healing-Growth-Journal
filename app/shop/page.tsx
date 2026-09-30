import React from "react";
import Link from "next/link";
import { Download, Sparkles, ShieldCheck, HelpCircle } from "lucide-react";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop — Digital Guided Journals & Workbooks",
  description:
    "Curated digital printables, fillable tablet journals, and prompt workbooks for grief support, healing, and intentional growth.",
};

async function getShopProducts() {
  return await db.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ShopPage() {
  const products = await getShopProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-[#EAE0D1] pb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
          The Printables & Guides
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#22160D] tracking-tight">
          The Shop
        </h1>
        <p className="text-base sm:text-lg font-editorial text-[#4F3925] leading-relaxed">
          Mindfully crafted digital journals, prompt decks, and reflective companions. Download instantly, print at home, or use on your tablet.
        </p>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F4ECE0]/80 p-8 rounded-sm border border-[#E6DCCE]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E5EDE6] text-[#283E2C] flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-base text-[#22160D] font-semibold">
              Instant PDF Delivery
            </h4>
            <p className="text-xs text-[#6A4F35] leading-relaxed">
              Files are delivered immediately via secure download link and emailed to your receipt.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E5EDE6] text-[#283E2C] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-base text-[#22160D] font-semibold">
              Printable & Tablet Ready
            </h4>
            <p className="text-xs text-[#6A4F35] leading-relaxed">
              High-res files optimized for standard A4/US Letter printing or GoodNotes/Notability.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E5EDE6] text-[#283E2C] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-base text-[#22160D] font-semibold">
              Secure Paystack Checkout
            </h4>
            <p className="text-xs text-[#6A4F35] leading-relaxed">
              Protected 256-bit encrypted card and bank transfer checkout across Nigeria and globally.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAE0D1]">
          <h2 className="text-2xl font-serif text-[#22160D]">
            Available Resources ({products.length})
          </h2>
          <span className="text-xs text-[#866746]">Prices listed in NGN (₦)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              tagline={product.tagline}
              description={product.description}
              price={product.price}
              currency={product.currency}
              mockupImage={product.mockupImage}
              isFeatured={product.isFeatured}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
