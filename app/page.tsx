import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, BookOpen, Heart, Sparkles, Feather } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_CONFIG, FOUR_PILLARS, SIX_PATHWAYS } from "@/lib/constants";
import PillarCard from "@/components/PillarCard";
import ArticleCard from "@/components/ArticleCard";
import ProductCard from "@/components/ProductCard";
import SubstackCta from "@/components/SubstackCta";

export const revalidate = 60; // Revalidate every 60 seconds

async function getHomeData() {
  const [articles, products] = await Promise.all([
    db.article.findMany({
      where: { isPublished: true },
      take: 4,
      orderBy: { publishedAt: "desc" },
      include: {
        categories: {
          include: { category: true },
        },
      },
    }),
    db.product.findMany({
      where: { isPublished: true, isFeatured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { articles, products };
}

export default async function HomePage() {
  const { articles, products } = await getHomeData();

  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* 5.1 Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 border-b border-[#EAE0D1] bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE0]/50 to-[#FAF7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EDE6] text-[#283E2C] text-xs uppercase tracking-[0.2em] font-medium font-sans">
            <Feather className="w-3.5 h-3.5" />
            <span>Welcome to the Sanctuary</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#22160D] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            A place to heal, <br className="hidden sm:inline" />
            <span className="italic font-editorial text-[#283E2C]">love</span>, and grow.
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-editorial text-[#4F3925] max-w-2xl mx-auto leading-relaxed">
            Honest reflections, tender letters, and guided resources for anyone moving through grief, heartbreak, quiet transitions, and the slow courage of becoming.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/start-here"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-all shadow-md hover:shadow-lg"
            >
              <Compass className="w-4 h-4" />
              <span>Start Here</span>
            </Link>
            <Link
              href="/journal"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#FAF7F2] text-[#4F3925] border border-[#D3BEA1] hover:bg-[#EAE0D1] transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read the Journal</span>
            </Link>
          </div>

          {/* Quick Substack Banner */}
          <div className="pt-6">
            <p className="text-xs text-[#866746] font-sans">
              Looking for weekly Sunday letters?{" "}
              <a
                href={SITE_CONFIG.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#283E2C] font-semibold inline-flex items-center gap-0.5"
              >
                Join our community on Substack <ArrowUpRight className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 5.2 What We Write About (The 4 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
            Core Foundations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
            What We Write About
          </h2>
          <p className="text-sm font-sans text-[#6A4F35] max-w-xl mx-auto leading-relaxed">
            Four intentional pillars shaping our essays, guided questions, and gentle reminders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_PILLARS.map((pillar) => (
            <PillarCard
              key={pillar.slug}
              title={pillar.title}
              slug={pillar.slug}
              tagline={pillar.tagline}
              description={pillar.description}
            />
          ))}
        </div>
      </section>

      {/* 5.3 Featured / Latest Writing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE0D1]">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
              From the Desk
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
              Recent Reflections
            </h2>
          </div>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#283E2C] hover:text-[#1D2D20] transition-colors mt-4 sm:mt-0"
          >
            <span>View Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              publishedAt={article.publishedAt}
              readingTime={article.readingTime}
              isSundayLove={article.isSundayLove}
              featured={idx === 0}
              categories={article.categories.map((c) => ({
                name: c.category.name,
                slug: c.category.slug,
              }))}
            />
          ))}
        </div>
      </section>

      {/* 5.4 Start Here (The 6 Pathways) */}
      <section className="bg-[#F4ECE0]/70 border-y border-[#E6DCCE] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
              Orientation
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
              Start Here
            </h2>
            <p className="text-sm font-editorial text-[#6A4F35] leading-relaxed">
              If this is your first time visiting, select the pathway that matches what your heart is carrying today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIX_PATHWAYS.map((pathway) => (
              <div
                key={pathway.slug}
                className="paper-card p-6 sm:p-8 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-serif text-[#22160D] group-hover:text-[#283E2C] transition-colors">
                    {pathway.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#A3845F]">
                    {pathway.headline}
                  </p>
                  <p className="text-sm text-[#4F3925] leading-relaxed">
                    {pathway.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#EAE0D1]">
                  <Link
                    href={`/start-here#${pathway.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#283E2C] group-hover:text-[#1D2D20] transition-colors"
                  >
                    <span>Follow Pathway</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/start-here"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#4F3925] text-[#FAF7F2] hover:bg-[#283E2C] transition-colors"
            >
              <span>Explore All Curated Pathways</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5.5 Substack Invitation Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SubstackCta
          title="The Sunday Sanctuary: Letters for the Tender Heart"
          description="Every Sunday, Glory sends out reflective essays, poems, and guided journal prompts to thousands of thoughtful readers around the world. No algorithm, just words that feel like a warm cup of tea."
        />
      </section>

      {/* 5.6 Shop Preview (Digital Resources) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE0D1]">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
              Digital Companions
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
              Journals & Workbooks
            </h2>
            <p className="text-xs text-[#866746] mt-1">
              Thoughtfully formatted printable PDFs & digital tablet companions.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#283E2C] hover:text-[#1D2D20] transition-colors mt-4 sm:mt-0"
          >
            <span>Browse Full Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </section>

      {/* 5.7 Closing Brand Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-8">
        <div className="w-12 h-[1px] bg-[#C4B19B] mx-auto" />
        <h3 className="text-2xl sm:text-3xl font-serif text-[#22160D] italic">
          &ldquo;I don&apos;t write because I have everything figured out. I write because I am learning too.&rdquo;
        </h3>
        <p className="text-sm font-sans text-[#6A4F35] max-w-xl mx-auto leading-relaxed">
          Wherever you are in your story today—grieving, rebuilding, or quietly celebrating small steps of courage—you are welcomed here just as you are.
        </p>
        <div className="pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#283E2C] hover:underline"
          >
            <span>Read Glory&apos;s Full Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
