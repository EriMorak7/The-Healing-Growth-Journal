import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Heart,
  ShoppingBag,
  Mail,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

async function getDashboardMetrics() {
  const [
    totalArticles,
    sundayLoveCount,
    totalProducts,
    totalInquiries,
    unreadInquiries,
    recentArticles,
    recentInquiries,
  ] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { isSundayLove: true } }),
    db.product.count(),
    db.contactSubmission.count(),
    db.contactSubmission.count({ where: { isRead: false } }),
    db.article.findMany({
      take: 6,
      orderBy: { publishedAt: "desc" },
      include: {
        categories: { include: { category: true } },
      },
    }),
    db.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    totalArticles,
    sundayLoveCount,
    totalProducts,
    totalInquiries,
    unreadInquiries,
    recentArticles,
    recentInquiries,
  };
}

export default async function AdminOverviewPage() {
  const metrics = await getDashboardMetrics();

  const statCards = [
    {
      label: "Total Articles & Essays",
      value: metrics.totalArticles,
      sublabel: "Published in Journal",
      icon: FileText,
      color: "text-[#283E2C]",
      bg: "bg-[#E5EDE6]",
      href: "/admin/articles",
    },
    {
      label: "Sunday Love Letters",
      value: metrics.sundayLoveCount,
      sublabel: "Weekly love letters & poems",
      icon: Heart,
      color: "text-[#BD7350]",
      bg: "bg-[#F7EBE4]",
      href: "/admin/articles?sundayLove=true",
    },
    {
      label: "Digital Products",
      value: metrics.totalProducts,
      sublabel: "Guides, workbooks & bundles",
      icon: ShoppingBag,
      color: "text-[#4F3925]",
      bg: "bg-[#F4ECE0]",
      href: "/admin/products",
    },
    {
      label: "Contact Inquiries",
      value: metrics.totalInquiries,
      sublabel: `${metrics.unreadInquiries} unread message${metrics.unreadInquiries === 1 ? "" : "s"}`,
      icon: Mail,
      color: metrics.unreadInquiries > 0 ? "text-[#C2410C]" : "text-[#283E2C]",
      bg: metrics.unreadInquiries > 0 ? "bg-[#FFEDD5]" : "bg-[#E5EDE6]",
      href: "/admin/contacts",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EAE0D1]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#22160D] tracking-tight">
            Editorial Overview
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#866746] font-sans mt-1">
            Welcome back, Glory. Here is your publication pulse today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Piece</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm bg-[#FAF7F2] text-[#4F3925] border border-[#D3BEA1] hover:bg-[#EAE0D1] text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="paper-card p-6 flex flex-col justify-between group hover:border-[#283E2C] transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-sm ${card.bg} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-[#C4B19B] group-hover:text-[#283E2C] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-5 space-y-1">
                <div className="text-3xl font-serif text-[#22160D]">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-[#4F3925]">
                  {card.label}
                </div>
                <div className="text-[11px] text-[#866746]">
                  {card.sublabel}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Articles & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-[#22160D]">
              Recent Articles in the Journal
            </h2>
            <Link
              href="/admin/articles"
              className="text-xs uppercase tracking-wider font-semibold text-[#283E2C] hover:underline"
            >
              View All ({metrics.totalArticles})
            </Link>
          </div>

          <div className="paper-card overflow-hidden divide-y divide-[#EAE0D1]/80">
            {metrics.recentArticles.map((article) => (
              <div
                key={article.id}
                className="p-5 flex items-start justify-between gap-4 hover:bg-[#F4ECE0]/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {article.isSundayLove && (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#E5EDE6] text-[#283E2C] rounded-sm">
                        Sunday Love
                      </span>
                    )}
                    {article.categories.map((c) => (
                      <span
                        key={c.category.slug}
                        className="text-[10px] uppercase tracking-wider font-semibold text-[#866746]"
                      >
                        {c.category.name}
                      </span>
                    ))}
                    <span className="text-[10px] text-[#A3845F]">•</span>
                    <span className="text-[10px] text-[#866746]">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  <h3 className="font-serif text-base text-[#22160D] truncate">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="hover:text-[#283E2C] transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#6A4F35] line-clamp-1">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <Link
                    href={`/journal/${article.slug}`}
                    target="_blank"
                    className="p-2 rounded text-[#866746] hover:text-[#283E2C] hover:bg-[#EAE0D1] transition-colors"
                    title="View live piece"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-[#283E2C] bg-[#E5EDE6] hover:bg-[#D4E2D6] rounded-sm transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-[#22160D]">
              Recent Inquiries
            </h2>
            <Link
              href="/admin/contacts"
              className="text-xs uppercase tracking-wider font-semibold text-[#283E2C] hover:underline"
            >
              View Inbox
            </Link>
          </div>

          <div className="paper-card p-5 space-y-4">
            {metrics.recentInquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#866746]">
                No contact inquiries received yet.
              </div>
            ) : (
              metrics.recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="pb-4 border-b border-[#EAE0D1]/60 last:border-b-0 last:pb-0 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#22160D] truncate">
                      {inquiry.name}
                    </span>
                    {!inquiry.isRead && (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm bg-[#FFEDD5] text-[#C2410C]">
                        Unread
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#BD7350] font-medium truncate">
                    {inquiry.subject || "General Inquiry"}
                  </div>
                  <p className="text-xs text-[#6A4F35] line-clamp-2 leading-relaxed">
                    {inquiry.message}
                  </p>
                  <div className="text-[10px] text-[#A3845F] pt-0.5">
                    {formatDate(inquiry.createdAt)} • {inquiry.email}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
