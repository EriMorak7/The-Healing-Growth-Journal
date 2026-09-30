import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date | string;
  readingTime?: string;
  categories?: { name: string; slug: string }[];
  isSundayLove?: boolean;
  featured?: boolean;
}

export default function ArticleCard({
  title,
  slug,
  excerpt,
  publishedAt,
  readingTime = "4 min read",
  categories = [],
  isSundayLove = false,
  featured = false,
}: ArticleCardProps) {
  return (
    <article
      className={`paper-card p-6 sm:p-8 flex flex-col justify-between group ${
        featured ? "border-l-4 border-l-[#283E2C]" : ""
      }`}
    >
      <div className="space-y-4">
        {/* Meta badges: Sunday Love badge or Category */}
        <div className="flex flex-wrap items-center gap-2">
          {isSundayLove && (
            <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-semibold bg-[#E5EDE6] text-[#283E2C] rounded-sm">
              The Sunday Love Series
            </span>
          )}
          {categories.map((cat) => (
            <span
              key={cat.slug}
              className="text-[10px] uppercase tracking-widest font-semibold text-[#866746]"
            >
              {cat.name}
            </span>
          ))}
          <span className="text-xs text-[#BCA17E]">•</span>
          <span className="text-xs text-[#866746] font-sans">
            {formatDate(publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-serif text-[#22160D] group-hover:text-[#283E2C] transition-colors leading-tight ${
            featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
          }`}
        >
          <Link href={`/journal/${slug}`}>{title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm font-sans text-[#4F3925] leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-6 mt-6 border-t border-[#EAE0D1]/80 flex items-center justify-between">
        <span className="text-xs text-[#866746] font-medium flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#A3845F]" />
          <span>{readingTime}</span>
        </span>
        <Link
          href={`/journal/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#283E2C] group-hover:text-[#1D2D20] transition-colors"
        >
          <span>Read Piece</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
