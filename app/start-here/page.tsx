import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, BookOpen, Sparkles, Heart } from "lucide-react";
import { db } from "@/lib/db";
import { SIX_PATHWAYS } from "@/lib/constants";
import SubstackCta from "@/components/SubstackCta";

export const metadata = {
  title: "Start Here — Curated Reading Pathways",
  description:
    "Find your starting point. Curated pathways through The Healing and Growth Journal for grief, heartbreak, starting over, and self-discovery.",
};

async function getStartHereData() {
  const articles = await db.article.findMany({
    where: { isPublished: true },
    include: {
      categories: {
        include: { category: true },
      },
    },
    take: 12,
  });

  return { articles };
}

export default async function StartHerePage() {
  const { articles } = await getStartHereData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EDE6] text-[#283E2C] text-xs uppercase tracking-widest font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Reader Orientation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#22160D] tracking-tight">
          Where would you like to begin?
        </h1>
        <p className="text-base sm:text-lg font-editorial text-[#4F3925] leading-relaxed">
          You don&apos;t have to read every article in order. We have curated six intentional pathways based on what your heart and mind may be navigating right now.
        </p>
      </div>

      {/* Quick Pathway Jumper Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto pb-8 border-b border-[#EAE0D1]">
        {SIX_PATHWAYS.map((p, i) => (
          <a
            key={p.slug}
            href={`#${p.slug}`}
            className="px-3.5 py-1.5 text-xs font-sans text-[#4F3925] bg-[#F4ECE0] hover:bg-[#283E2C] hover:text-[#FAF7F2] rounded-sm transition-colors border border-[#E6DCCE]"
          >
            {i + 1}. {p.name.replace("Start here if ", "")}
          </a>
        ))}
      </div>

      {/* The 6 Pathways Detailed Sections */}
      <div className="space-y-16">
        {SIX_PATHWAYS.map((pathway, index) => (
          <div
            key={pathway.slug}
            id={pathway.slug}
            className="paper-card p-8 sm:p-12 space-y-8 scroll-mt-28"
          >
            {/* Pathway Headline */}
            <div className="space-y-2 border-b border-[#EAE0D1] pb-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
                Pathway 0{index + 1}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#22160D]">
                {pathway.name}
              </h2>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#A3845F]">
                {pathway.headline}
              </p>
              <p className="text-base font-editorial text-[#4F3925] leading-relaxed pt-1">
                {pathway.description}
              </p>
            </div>

            {/* Curated Recommendations for this Pathway */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
                Recommended Reading & Prompts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 2).map((article) => (
                  <div
                    key={article.id}
                    className="p-5 bg-[#FAF7F2] border border-[#EAE0D1] rounded-sm flex flex-col justify-between hover:border-[#D3BEA1] transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-[#283E2C]">
                        Selected Essay
                      </span>
                      <h4 className="font-serif text-lg text-[#22160D]">
                        <Link href={`/journal/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-[#6A4F35] line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#EAE0D1]/60 flex items-center justify-between">
                      <span className="text-xs text-[#866746]">
                        {article.readingTime}
                      </span>
                      <Link
                        href={`/journal/${article.slug}`}
                        className="text-xs font-semibold uppercase tracking-wider text-[#283E2C] inline-flex items-center gap-1 hover:underline"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Evergreen SEO Prompt Link */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F4ECE0]/50 p-4 rounded-sm border border-[#E6DCCE]">
              <span className="text-xs text-[#4F3925] font-sans">
                Need guided reflective questions? Check our dedicated prompt guide:
              </span>
              <Link
                href="/prompts"
                className="text-xs uppercase tracking-widest font-semibold text-[#283E2C] inline-flex items-center gap-1 hover:underline"
              >
                <span>View Prompts Library</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Substack Call to Action */}
      <SubstackCta
        title="Continue the Journey Each Sunday"
        description="Our weekly Substack letters explore these pathways in depth with fresh essays, reader questions, and guided journaling spaces."
      />
    </div>
  );
}
