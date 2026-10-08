import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const order = await db.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.status !== "PAID") {
      return NextResponse.json(
        { error: "This order has not been completed or verified yet." },
        { status: 403 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "downloads",
      "The-Healing-and-Growth-Workbook.pdf"
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Download file currently unavailable. Please contact support." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const productName = order.items[0]?.product?.name || "The-Healing-and-Growth-Workbook";
    const safeFilename = `${productName.replace(/[^a-zA-Z0-9_-]/g, "-")}.pdf`;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to process download request." },
      { status: 500 }
    );
  }
}
