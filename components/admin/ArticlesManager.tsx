"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Heart,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  readingTime: string;
  isPublished: boolean;
  publishedAt: string | Date;
  isSundayLove: boolean;
  featuredImage: string | null;
  categories: { category: { id: string; name: string; slug: string } }[];
}

interface ArticlesManagerProps {
  initialArticles: ArticleItem[];
  categories: { id: string; name: string; slug: string }[];
}

export default function ArticlesManager({
  initialArticles,
  categories,
}: ArticlesManagerProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterSundayLove, setFilterSundayLove] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      art.categories.some((c) => c.category.slug === selectedCategory);

    const matchesSundayLove = !filterSundayLove || art.isSundayLove;

    return matchesSearch && matchesCategory && matchesSundayLove;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete article");
      }

      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete article");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="paper-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#866746]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or excerpt..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs font-sans text-[#22160D] focus:outline-none focus:ring-1 focus:ring-[#283E2C] focus:border-[#283E2C]"
          />
        </div>

        {/* Category & Sunday Love Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-xs font-sans text-[#4F3925] focus:outline-none focus:ring-1 focus:ring-[#283E2C]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFilterSundayLove(!filterSundayLove)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold border transition-all ${
              filterSundayLove
                ? "bg-[#283E2C] text-[#FAF7F2] border-[#283E2C]"
                : "bg-[#FAF7F2] text-[#4F3925] border-[#D3BEA1] hover:bg-[#EAE0D1]"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Sunday Love Only</span>
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="paper-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE0D1] bg-[#F4ECE0]/50 text-[11px] uppercase tracking-wider text-[#866746] font-semibold">
                <th className="py-3.5 px-5">Piece Title & Excerpt</th>
                <th className="py-3.5 px-4">Categories / Series</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-4">Read Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE0D1]/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#866746]">
                    No articles found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((art) => (
                  <tr
                    key={art.id}
                    className="hover:bg-[#F4ECE0]/30 transition-colors group"
                  >
                    <td className="py-4 px-5 max-w-md">
                      <div className="font-serif text-sm font-semibold text-[#22160D] group-hover:text-[#283E2C] transition-colors line-clamp-1">
                        <Link href={`/admin/articles/${art.id}`}>
                          {art.title}
                        </Link>
                      </div>
                      <p className="text-[11px] text-[#6A4F35] line-clamp-1 mt-0.5">
                        {art.excerpt}
                      </p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {art.isSundayLove && (
                          <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#E5EDE6] text-[#283E2C] rounded-sm">
                            Sunday Love
                          </span>
                        )}
                        {art.categories.map((c) => (
                          <span
                            key={c.category.slug}
                            className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[#FAF7F2] border border-[#E6DCCE] text-[#866746] rounded-sm"
                          >
                            {c.category.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-[#4F3925]">
                      {formatDate(art.publishedAt)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-[#866746]">
                      {art.readingTime}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/journal/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded text-[#866746] hover:text-[#283E2C] hover:bg-[#EAE0D1] transition-colors"
                          title="View Live"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/articles/${art.id}`}
                          className="p-1.5 rounded text-[#283E2C] hover:bg-[#E5EDE6] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          disabled={deletingId === art.id}
                          className="p-1.5 rounded text-[#A83226] hover:bg-[#FDF2F0] transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#EAE0D1]/80 text-[11px] text-[#866746] flex items-center justify-between">
          <span>Showing {filtered.length} of {articles.length} total articles</span>
          <span>Double-click any piece to review or edit</span>
        </div>
      </div>
    </div>
  );
}
