import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { PlusCircle } from "lucide-react";
import ArticlesManager from "@/components/admin/ArticlesManager";

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    db.article.findMany({
      orderBy: { publishedAt: "desc" },
      include: {
        categories: { include: { category: true } },
      },
    }),
    db.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EAE0D1]">
        <div>
          <h1 className="text-3xl font-serif text-[#22160D] tracking-tight">
            Articles & Reflections
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#866746] font-sans mt-1">
            Manage your essays, letters, and reflections across all 4 pillars
          </p>
        </div>

        <div>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Piece</span>
          </Link>
        </div>
      </div>

      <ArticlesManager initialArticles={articles} categories={categories} />
    </div>
  );
}
