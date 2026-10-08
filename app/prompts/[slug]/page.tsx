import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Feather, BookOpen, Compass } from "lucide-react";
import { db } from "@/lib/db";
import SubstackCta from "@/components/SubstackCta";

interface PromptPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PromptPageProps) {
  const page = await db.seoPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page) return { title: "Prompt Guide Not Found" };

  const ogUrl = `/api/og?title=${encodeURIComponent(page.title)}&category=Journal%20Prompts`;

  return {
    title: page.title,
    description: page.intro,
    openGraph: {
      title: page.title,
      description: page.intro,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.intro,
      images: [ogUrl],
    },
  };
}

export default async function SinglePromptPage({ params }: PromptPageProps) {
  const page = await db.seoPage.findUnique({
    where: { slug: params.slug },
  });

  if (!page) {
    notFound();
  }

  const prompts: string[] = page.prompts ? JSON.parse(page.prompts) : [];

  // Fetch relevant product recommendation
  const recommendedProduct = await db.product.findFirst({
    where: { isPublished: true },
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      {/* Back to Hub Link */}
      <div>
        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#866746] hover:text-[#283E2C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prompts Library</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4 border-b border-[#EAE0D1] pb-10 text-center sm:text-left">
        <span className="text-xs uppercase tracking-[0.25em] text-[#BD7350] font-semibold">
          Evergreen Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#22160D] tracking-tight leading-tight">
          {page.title}
        </h1>
        <p className="text-lg font-editorial italic text-[#4F3925] max-w-2xl">
          &ldquo;{page.question}&rdquo;
        </p>
      </header>

      {/* Intro Prose */}
      <div className="prose prose-stone max-w-none text-[#22160D] font-editorial text-xl sm:text-2xl leading-[1.8] space-y-6">
        <p className="first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#283E2C]">
          {page.intro}
        </p>
        <p>{page.body}</p>
      </div>

      {/* Prompts Callout Cards Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#EAE0D1] pb-3">
          <Feather className="w-4 h-4 text-[#283E2C]" />
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-[#283E2C]">
            Prompts for Your Journal
          </h2>
        </div>

        <div className="space-y-4">
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className="paper-card p-6 sm:p-8 bg-[#FAF7F2] border-l-4 border-l-[#283E2C] space-y-2"
            >
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#866746]">
                Prompt 0{index + 1}
              </span>
              <p className="text-lg sm:text-xl font-editorial text-[#22160D] leading-relaxed">
                {prompt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Product Box */}
      {recommendedProduct && (
        <div className="p-8 bg-[#F4ECE0] border border-[#E6DCCE] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#866746]">
              Deepen Your Journey
            </span>
            <h3 className="font-serif text-2xl text-[#22160D]">
              {recommendedProduct.name}
            </h3>
            <p className="text-xs text-[#6A4F35] max-w-md">
              {recommendedProduct.tagline || recommendedProduct.description.slice(0, 120)}...
            </p>
          </div>
          <Link
            href={`/shop/${recommendedProduct.slug}`}
            className="px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-colors shrink-0 shadow-sm"
          >
            View Journal Guide
          </Link>
        </div>
      )}

      {/* Substack Call to Action */}
      <SubstackCta
        title="More Reflective Prompts Each Week"
        description="Subscribe to receive fresh guided questions and Sunday essays written for quiet contemplation."
      />
    </article>
  );
}
