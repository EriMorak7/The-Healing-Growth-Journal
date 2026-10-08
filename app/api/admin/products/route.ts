import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      name,
      slug,
      tagline,
      description,
      whoItsFor,
      whatsIncluded,
      price,
      currency = "NGN",
      mockupImage,
      fileUrl,
      isPublished = true,
      isFeatured = false,
    } = data;

    if (!name || !slug || !description || price === undefined) {
      return NextResponse.json(
        { error: "Name, slug, description, and price are required." },
        { status: 400 }
      );
    }

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        tagline: tagline || null,
        description,
        whoItsFor: whoItsFor || null,
        whatsIncluded: whatsIncluded || null,
        price: parseFloat(price),
        currency,
        mockupImage: mockupImage || null,
        fileUrl: fileUrl || null,
        isPublished: Boolean(isPublished),
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
