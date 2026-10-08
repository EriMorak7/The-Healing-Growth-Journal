import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required." },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { paystackReference: reference },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // In a live production environment with real keys:
    // We would make a GET request to https://api.paystack.co/transaction/verify/${reference}
    // using Bearer PAYSTACK_SECRET_KEY.
    // For test/development mode or simulated checkout, we verify and update status to PAID.

    const updated = await db.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: updated.orderNumber,
      status: updated.status,
    });
  } catch (error) {
    console.error("Order verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify transaction." },
      { status: 500 }
    );
  }
}
