import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { productId, customerEmail, customerName } = await request.json();

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: "Product ID and customer email are required." },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isPublished) {
      return NextResponse.json(
        { error: "Product not found or unavailable." },
        { status: 404 }
      );
    }

    // Generate unique order number and Paystack reference
    const timestamp = Date.now().toString().slice(-6);
    const randomHex = Math.floor(Math.random() * 1e4).toString(16).toUpperCase();
    const orderNumber = `HJG-${timestamp}-${randomHex}`;
    const paystackRef = `REF-${orderNumber}`;

    // Create pending order in database
    const order = await db.order.create({
      data: {
        orderNumber,
        customerEmail: customerEmail.trim().toLowerCase(),
        customerName: customerName ? customerName.trim() : null,
        totalAmount: product.price,
        currency: product.currency || "NGN",
        paystackReference: paystackRef,
        status: "PENDING",
        items: {
          create: {
            productId: product.id,
            price: product.price,
          },
        },
      },
    });

    const publicKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_sample_public_key";

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      reference: paystackRef,
      publicKey,
      amountKobo: Math.round(product.price * 100),
      currency: product.currency || "NGN",
      email: customerEmail,
      productName: product.name,
    });
  } catch (error) {
    console.error("Checkout init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize checkout." },
      { status: 500 }
    );
  }
}
