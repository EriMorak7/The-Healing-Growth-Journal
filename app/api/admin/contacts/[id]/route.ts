import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isRead } = await request.json();
    const updated = await db.contactSubmission.update({
      where: { id: params.id },
      data: { isRead: Boolean(isRead) },
    });
    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update submission." },
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
    await db.contactSubmission.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete submission." },
      { status: 500 }
    );
  }
}
