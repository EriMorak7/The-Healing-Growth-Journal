import React from "react";
import Link from "next/link";
import { ArrowRight, Feather, Sparkles } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Journal Prompt & Evergreen Library",
  description:
    "An evergreen collection of journal prompts answering real emotional questions around grief, heartbreak, starting over, and self-discovery.",
};

async function getPromptsData() {
  return await db.seoPage.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export default async function PromptsHubPage() {
  const seoPages = await getPromptsData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-[#EAE0D1] pb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
          Evergreen Guidance
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#22160D] tracking-tight">
          Prompt & Question Library
        </h1>
        <p className="text-base sm:text-lg font-editorial text-[#4F3925] leading-relaxed">
          Ten dedicated sanctuaries built around the questions our hearts ask in private. Not generic keyword articles—tender, compassionate companions for difficult seasons.
        </p>
      </div>

      {/* Grid of the 10 SEO Prompt Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {seoPages.map((page, index) => (
          <div
            key={page.id}
            className="paper-card p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
                Topic 0{index + 1}
              </span>
              <h2 className="text-2xl font-serif text-[#22160D] group-hover:text-[#283E2C] transition-colors leading-snug">
                <Link href={`/prompts/${page.slug}`}>{page.title}</Link>
              </h2>
              <p className="text-xs uppercase tracking-wider font-medium text-[#BD7350]">
                {page.question}
              </p>
              <p className="text-sm font-sans text-[#4F3925] leading-relaxed line-clamp-3">
                {page.intro}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EAE0D1] flex items-center justify-between">
              <span className="text-xs text-[#866746]">Guided prompts included</span>
              <Link
                href={`/prompts/${page.slug}`}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#283E2C] group-hover:text-[#1D2D20] transition-colors"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
