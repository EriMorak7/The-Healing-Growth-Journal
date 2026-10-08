import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Share2, BookOpen, Clock, Calendar, Check, Copy } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import SubstackCta from "@/components/SubstackCta";
import ArticleCard from "@/components/ArticleCard";

interface ArticleSlugProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleSlugProps) {
  const article = await db.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) return { title: "Article Not Found" };

  const ogUrl = `/api/og?title=${encodeURIComponent(article.title)}&author=${encodeURIComponent(article.authorName)}&isSundayLove=${article.isSundayLove}`;

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.authorName],
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticleSlugProps) {
  const article = await db.article.findUnique({
    where: { slug: params.slug },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  // Related articles in the same category
  const categoryIds = article.categories.map((c) => c.categoryId);
  const relatedArticles = await db.article.findMany({
    where: {
      isPublished: true,
      id: { not: article.id },
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    },
    take: 2,
    orderBy: { publishedAt: "desc" },
    include: {
      categories: { include: { category: true } },
    },
  });

  // JSON-LD structured data for Google SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "Glory",
    },
    publisher: {
      "@type": "Organization",
      name: "The Healing and Growth Journal",
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back to Journal Link */}
      <div>
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#866746] hover:text-[#283E2C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Archive</span>
        </Link>
      </div>

      {/* Cover Image */}
      {article.featuredImage && (
        <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden rounded-sm border border-[#EAE0D1] shadow-md">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <header className="space-y-6 border-b border-[#EAE0D1] pb-10">
        <div className="flex flex-wrap items-center gap-3">
          {article.isSundayLove && (
            <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-[#E5EDE6] text-[#283E2C] rounded-sm">
              The Sunday Love Series
            </span>
          )}
          {article.categories.map((c) => (
            <Link
              key={c.category.slug}
              href={`/journal?category=${c.category.slug}`}
              className="text-xs uppercase tracking-widest font-semibold text-[#866746] hover:underline"
            >
              {c.category.name}
            </Link>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#22160D] tracking-tight leading-[1.15]">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#866746] font-sans">
          <div className="flex items-center gap-4">
            <span className="font-medium text-[#22160D]">By {article.authorName}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishedAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3845F]">Share</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=http://localhost:3000/journal/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-[#F4ECE0] hover:bg-[#EAE0D1] text-[#22160D] transition-colors"
              title="Share on X"
            >
              <Share2 className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <div className="prose prose-stone max-w-none text-[#22160D] font-editorial text-xl sm:text-2xl leading-[1.8] space-y-8">
        {article.body.split("\n\n").map((block, index) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Render figure/img blocks as raw HTML
          if (trimmed.startsWith("<figure") || trimmed.startsWith("<img")) {
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: trimmed }}
              />
            );
          }

          // First text paragraph gets editorial drop cap
          if (index === 0) {
            return (
              <p
                key={index}
                className="first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#283E2C] first-letter:leading-none text-[#362618]"
              >
                {trimmed}
              </p>
            );
          }

          return <p key={index}>{trimmed}</p>;
        })}
      </div>

      {/* Tags List */}
      {article.tags.length > 0 && (
        <div className="pt-8 border-t border-[#EAE0D1] flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold mr-2">
            Tagged:
          </span>
          {article.tags.map((t) => (
            <span
              key={t.tag.slug}
              className="px-2.5 py-1 text-xs bg-[#F4ECE0] text-[#4F3925] border border-[#E6DCCE] rounded-sm"
            >
              #{t.tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Contextual Substack Invitation */}
      <SubstackCta
        title="Did this piece bring you comfort?"
        description="Subscribe to receive Glory's unedited reflections, quiet letters, and guided journal prompts straight to your inbox each week."
      />

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <div className="pt-12 border-t border-[#EAE0D1] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-[#22160D]">
              Related Reflections
            </h3>
            <Link
              href="/journal"
              className="text-xs uppercase tracking-widest font-semibold text-[#283E2C] hover:underline"
            >
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard
                key={rel.id}
                title={rel.title}
                slug={rel.slug}
                excerpt={rel.excerpt}
                publishedAt={rel.publishedAt}
                readingTime={rel.readingTime}
                isSundayLove={rel.isSundayLove}
                featuredImage={rel.featuredImage}
                categories={rel.categories.map((c) => ({
                  name: c.category.name,
                  slug: c.category.slug,
                }))}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
