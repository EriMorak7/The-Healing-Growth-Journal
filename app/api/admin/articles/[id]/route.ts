import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const article = await db.article.findUnique({
    where: { id: params.id },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      title,
      slug,
      excerpt,
      body,
      featuredImage,
      authorName,
      readingTime,
      isPublished,
      publishedAt,
      isSundayLove,
      isFeatured,
      seoTitle,
      seoDescription,
      categoryIds,
      tags,
    } = data;

    // Remove existing category connections
    if (categoryIds !== undefined) {
      await db.articleCategory.deleteMany({
        where: { articleId: params.id },
      });
    }

    // Remove existing tag connections
    if (tags !== undefined) {
      await db.articleTag.deleteMany({
        where: { articleId: params.id },
      });
    }

    const updated = await db.article.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        excerpt,
        body,
        featuredImage: featuredImage || null,
        authorName,
        readingTime,
        isPublished: Boolean(isPublished),
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        isSundayLove: Boolean(isSundayLove),
        isFeatured: Boolean(isFeatured),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categories: categoryIds
          ? {
              create: categoryIds.map((cId: string) => ({
                category: { connect: { id: cId } },
              })),
            }
          : undefined,
      },
    });

    // Reconnect tags if provided
    if (Array.isArray(tags)) {
      for (const tagName of tags) {
        const cleanName = tagName.trim();
        if (!cleanName) continue;
        const tagSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const tag = await db.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: cleanName, slug: tagSlug },
        });

        await db.articleTag.create({
          data: {
            articleId: params.id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Failed to update article." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.article.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Failed to delete article." },
      { status: 500 }
    );
  }
}
