import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, CheckCircle2, ShieldCheck, Heart, Sparkles, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import BuyButton from "@/components/BuyButton";

interface ProductSlugProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductSlugProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — Digital Journal`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductSlugProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  // Related products
  const relatedProducts = await db.product.findMany({
    where: {
      isPublished: true,
      id: { not: product.id },
    },
    take: 2,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      {/* Back to Shop Link */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#866746] hover:text-[#283E2C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Mockup & Format Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="paper-card p-12 bg-[#F4ECE0] border border-[#EAE0D1] flex flex-col items-center justify-center text-center min-h-[380px] rounded-sm relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-[#E5EDE6] text-[#283E2C] flex items-center justify-center mb-6 shadow-sm">
              <FileText className="w-10 h-10" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
              The Healing & Growth Digital Edition
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#22160D] mt-2 max-w-sm">
              {product.name}
            </h2>
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] text-[#283E2C] rounded-full text-xs font-medium border border-[#E6DCCE]">
              <Sparkles className="w-3.5 h-3.5 text-[#BD7350]" />
              <span>Instant Digital PDF Download</span>
            </div>
          </div>

          {/* Format Specifications */}
          <div className="p-6 bg-[#FAF7F2] border border-[#EAE0D1] rounded-sm space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#866746]">
              Digital File Specifications
            </h4>
            <ul className="text-xs text-[#4F3925] space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#283E2C]" />
                <span>Format: High-resolution fillable & printable PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#283E2C]" />
                <span>Compatibility: Works with GoodNotes, Notability, Apple Books, Adobe Acrobat</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#283E2C]" />
                <span>Printing: Formatted for standard US Letter & A4 paper</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Purchase Action */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3 border-b border-[#EAE0D1] pb-6">
            {product.tagline && (
              <span className="text-xs uppercase tracking-widest text-[#BD7350] font-semibold">
                {product.tagline}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-serif text-[#22160D] leading-tight">
              {product.name}
            </h1>
            <div className="pt-2">
              <span className="text-3xl font-serif font-bold text-[#22160D]">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="text-xs text-[#866746] ml-2">
                One-time payment • Lifetime access
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#866746]">
              About this Resource
            </h3>
            <p className="text-sm font-sans text-[#4F3925] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Who It's For */}
          {product.whoItsFor && (
            <div className="p-5 bg-[#F4ECE0]/60 border border-[#E6DCCE] rounded-sm space-y-2">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#283E2C]">
                Who This Is For
              </h4>
              <p className="text-xs font-sans text-[#4F3925] leading-relaxed">
                {product.whoItsFor}
              </p>
            </div>
          )}

          {/* What's Included */}
          {product.whatsIncluded && (
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#866746]">
                What is Included
              </h4>
              <div className="text-xs font-sans text-[#4F3925] space-y-2 whitespace-pre-line leading-relaxed">
                {product.whatsIncluded}
              </div>
            </div>
          )}

          {/* Purchase Action Box */}
          <div className="p-6 bg-[#FAF7F2] border-2 border-[#283E2C] rounded-sm space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#866746] block">Total Amount</span>
                <span className="text-2xl font-serif font-bold text-[#22160D]">
                  {formatPrice(product.price, product.currency)}
                </span>
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#283E2C] bg-[#E5EDE6] px-2.5 py-1 rounded-sm">
                Paystack Protected
              </span>
            </div>

            <BuyButton
              productId={product.id}
              productName={product.name}
              price={product.price}
              currency={product.currency}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-[#EAE0D1] space-y-8">
          <h3 className="text-2xl font-serif text-[#22160D]">
            Other Gentle Companions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                tagline={p.tagline}
                description={p.description}
                price={p.price}
                currency={p.currency}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
