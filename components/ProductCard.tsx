import React from "react";
import Link from "next/link";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  price: number;
  currency?: string;
  mockupImage?: string | null;
  isFeatured?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  tagline,
  description,
  price,
  currency = "NGN",
  isFeatured = false,
}: ProductCardProps) {
  return (
    <div className="paper-card flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
      {/* Visual Cover / Preview Block */}
      <div className="relative bg-[#F4ECE0] p-8 border-b border-[#EAE0D1] flex flex-col items-center justify-center text-center min-h-[220px]">
        {isFeatured && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-[#283E2C] text-[#FAF7F2] rounded-sm">
            <Sparkles className="w-3 h-3 text-[#A6C4AA]" />
            Featured
          </span>
        )}
        <div className="w-12 h-12 rounded-full bg-[#E5EDE6] text-[#283E2C] flex items-center justify-center mb-3">
          <Download className="w-5 h-5" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#866746] font-medium font-sans">
          Digital Journal / Guide
        </span>
        <h4 className="font-serif text-lg text-[#22160D] mt-2 font-medium">
          {name}
        </h4>
      </div>

      {/* Description & Details */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {tagline && (
            <p className="text-xs uppercase tracking-wider text-[#A3845F] font-semibold">
              {tagline}
            </p>
          )}
          <p className="text-sm font-sans text-[#4F3925] leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-6 border-t border-[#EAE0D1] flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#866746]">
              Instant PDF Access
            </span>
            <span className="text-xl font-serif font-bold text-[#22160D]">
              {formatPrice(price, currency)}
            </span>
          </div>
          <Link
            href={`/shop/${slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm bg-[#4F3925] text-[#FAF7F2] group-hover:bg-[#283E2C] transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
