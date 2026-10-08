import React from "react";
import { db } from "@/lib/db";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default async function NewArticlePage() {
  const categories = await db.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return <ArticleEditor categories={categories} isEditing={false} />;
}
