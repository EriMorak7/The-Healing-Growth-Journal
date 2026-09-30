import React from "react";
import Link from "next/link";
import { Heart, Feather, Calendar, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";
import SubstackCta from "@/components/SubstackCta";

export const metadata = {
  title: "The Sunday Love Series — Letters, Poems & Reflections",
  description:
    "A weekly sanctuary of love articles, tender letters, and contemplative poetry. Published every Sunday morning by Glory.",
};

async function getSundayLoveData() {
  const articles = await db.article.findMany({
    where: {
      isPublished: true,
      isSundayLove: true,
    },
    orderBy: { publishedAt: "desc" },
    include: {
      categories: { include: { category: true } },
    },
  });

  return { articles };
}

export default async function SundayLovePage() {
  const { articles } = await getSundayLoveData();

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* Editorial Sunday Love Hero Banner */}
      <section className="bg-[#1C2B19] text-[#FAF7F2] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#283E2C] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#283E2C] text-[#CBDECE] text-xs uppercase tracking-[0.25em] font-semibold">
            <Heart className="w-3.5 h-3.5 text-[#BD7350]" />
            <span>The Weekly Tradition</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#FAF7F2] tracking-tight">
            The Sunday Love Series
          </h1>

          <p className="text-lg sm:text-xl font-editorial italic text-[#E5EDE6] max-w-2xl mx-auto leading-relaxed">
            &ldquo;Every Sunday morning, when the world pauses to exhale, we share letters on love, tenderness, distance, and memory.&rdquo;
          </p>

          <p className="text-xs uppercase tracking-[0.2em] text-[#A6C4AA] font-sans">
            Published weekly on Substack & archived here on the journal
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#EAE0D1]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
              The Sunday Archive
            </span>
            <h2 className="text-3xl font-serif text-[#22160D]">
              Sunday Letters & Poems
            </h2>
          </div>
          <span className="text-xs text-[#866746] mt-2 sm:mt-0 font-medium">
            {articles.length} {articles.length === 1 ? "letter" : "letters"} in collection
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="paper-card p-12 text-center space-y-4">
            <Feather className="w-10 h-10 mx-auto text-[#A3845F]" />
            <h3 className="font-serif text-2xl text-[#22160D]">
              First Sunday letter arriving soon
            </h3>
            <p className="text-sm font-sans text-[#6A4F35] max-w-md mx-auto">
              Our Sunday letters are prepared weekly. Subscribe on Substack to receive the very next issue in your inbox.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                publishedAt={article.publishedAt}
                readingTime={article.readingTime}
                isSundayLove={true}
                categories={article.categories.map((c) => ({
                  name: c.category.name,
                  slug: c.category.slug,
                }))}
              />
            ))}
          </div>
        )}

        {/* Substack Call to Action */}
        <SubstackCta
          title="Never Miss a Sunday Morning Letter"
          description="Delivered at 8:00 AM every Sunday. Join thousands of quiet readers making Sunday letters part of their weekly reflection ritual."
        />
      </section>
    </div>
  );
}
