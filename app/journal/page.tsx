import React from "react";
import Link from "next/link";
import { Search, Filter, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { FOUR_PILLARS } from "@/lib/constants";
import ArticleCard from "@/components/ArticleCard";

export const metadata = {
  title: "The Journal — Archive & Reflections",
  description:
    "Explore essays, letters, and reflections on healing, personal growth, relationships, and grief support.",
};

interface JournalPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    q?: string;
  };
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const selectedCategory = searchParams.category;
  const searchQuery = searchParams.q;

  // Build Prisma where query
  const where: any = {
    isPublished: true,
  };

  if (selectedCategory) {
    where.categories = {
      some: {
        category: {
          slug: selectedCategory,
        },
      },
    };
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery } },
      { excerpt: { contains: searchQuery } },
      { body: { contains: searchQuery } },
    ];
  }

  const [articles, categories] = await Promise.all([
    db.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: {
        categories: {
          include: { category: true },
        },
      },
    }),
    db.category.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
      {/* Editorial Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-[#EAE0D1] pb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
          The Library
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#22160D] tracking-tight">
          The Journal
        </h1>
        <p className="text-base sm:text-lg font-editorial text-[#4F3925] leading-relaxed">
          Reflections, letters, and quiet essays written from lived experience. Search by theme or explore our four foundational pillars.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#F4ECE0]/80 p-6 rounded-sm border border-[#E6DCCE]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/journal"
            className={`px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-semibold rounded-sm transition-colors ${
              !selectedCategory
                ? "bg-[#283E2C] text-[#FAF7F2]"
                : "bg-[#FAF7F2] text-[#4F3925] hover:bg-[#EAE0D1] border border-[#E6DCCE]"
            }`}
          >
            All Pieces
          </Link>
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/journal?category=${cat.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider font-semibold rounded-sm transition-colors ${
                  isCatActive
                    ? "bg-[#283E2C] text-[#FAF7F2]"
                    : "bg-[#FAF7F2] text-[#4F3925] hover:bg-[#EAE0D1] border border-[#E6DCCE]"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Search Form */}
        <form
          action="/journal"
          method="GET"
          className="w-full md:w-auto flex items-center gap-2"
        >
          {selectedCategory && (
            <input type="hidden" name="category" value={selectedCategory} />
          )}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#866746]" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery || ""}
              placeholder="Search reflections..."
              className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-[#22160D] placeholder-[#A3845F] focus:outline-none focus:border-[#283E2C]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs uppercase tracking-wider font-semibold bg-[#4F3925] text-[#FAF7F2] rounded-sm hover:bg-[#283E2C] transition-colors shrink-0"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Active Filter Indicators */}
      {(selectedCategory || searchQuery) && (
        <div className="flex items-center gap-3 text-xs text-[#866746]">
          <span>Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EAE0D1] text-[#22160D] rounded-sm font-medium">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <Link href={`/journal${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`} className="ml-1 hover:text-[#283E2C]">
                ×
              </Link>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EAE0D1] text-[#22160D] rounded-sm font-medium">
              Search: &ldquo;{searchQuery}&rdquo;
              <Link href={`/journal${selectedCategory ? `?category=${selectedCategory}` : ""}`} className="ml-1 hover:text-[#283E2C]">
                ×
              </Link>
            </span>
          )}
          <Link href="/journal" className="underline hover:text-[#283E2C] ml-2">
            Clear all
          </Link>
        </div>
      )}

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="paper-card p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-[#A3845F]" />
          <h3 className="font-serif text-2xl text-[#22160D]">No reflections found</h3>
          <p className="text-sm font-sans text-[#6A4F35] max-w-md mx-auto">
            We couldn&apos;t find any articles matching your search criteria. Try selecting another category or resetting your filters.
          </p>
          <div className="pt-2">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2]"
            >
              View All Pieces
            </Link>
          </div>
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
              isSundayLove={article.isSundayLove}
              categories={article.categories.map((c) => ({
                name: c.category.name,
                slug: c.category.slug,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
