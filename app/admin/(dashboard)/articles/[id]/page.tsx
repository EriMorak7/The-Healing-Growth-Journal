import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const [article, categories] = await Promise.all([
    db.article.findUnique({
      where: { id: params.id },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    }),
    db.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  if (!article) {
    notFound();
  }

  const initialData = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    featuredImage: article.featuredImage,
    authorName: article.authorName,
    readingTime: article.readingTime,
    isPublished: article.isPublished,
    publishedAt: article.publishedAt,
    isSundayLove: article.isSundayLove,
    isFeatured: article.isFeatured,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    categoryIds: article.categories.map((c) => c.category.id),
    tags: article.tags.map((t) => t.tag.name),
  };

  return (
    <ArticleEditor
      initialData={initialData}
      categories={categories}
      isEditing={true}
    />
  );
}
