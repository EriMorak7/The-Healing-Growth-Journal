import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sundayLove = searchParams.get("sundayLove");

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { body: { contains: search } },
    ];
  }
  if (sundayLove === "true") {
    where.isSundayLove = true;
  }
  if (category) {
    where.categories = {
      some: { category: { slug: category } },
    };
  }

  const articles = await db.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
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
      authorName = "Glory",
      readingTime = "4 min read",
      isPublished = true,
      publishedAt,
      isSundayLove = false,
      isFeatured = false,
      seoTitle,
      seoDescription,
      categoryIds = [],
      tags = [],
    } = data;

    if (!title || !slug || !excerpt || !body) {
      return NextResponse.json(
        { error: "Title, slug, excerpt, and body are required." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An article with this slug already exists." },
        { status: 400 }
      );
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        excerpt,
        body,
        featuredImage: featuredImage || null,
        authorName,
        readingTime,
        isPublished: Boolean(isPublished),
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        isSundayLove: Boolean(isSundayLove),
        isFeatured: Boolean(isFeatured),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        categories: {
          create: categoryIds.map((cId: string) => ({
            category: { connect: { id: cId } },
          })),
        },
      },
    });

    // Handle tags if provided
    if (Array.isArray(tags) && tags.length > 0) {
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
            articleId: article.id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Failed to create article." },
      { status: 500 }
    );
  }
}
