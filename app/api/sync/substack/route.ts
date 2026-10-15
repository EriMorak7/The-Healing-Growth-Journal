import { NextResponse } from "next/server";
import { syncSubstackPosts } from "@/lib/substack-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await syncSubstackPosts();
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

export async function POST() {
  const result = await syncSubstackPosts();
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
