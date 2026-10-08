import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await db.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  const rssItemsXml = articles
    .map((article) => {
      const link = `${BASE_URL}/journal/${article.slug}`;
      const pubDate = new Date(article.publishedAt).toUTCString();

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(SITE_CONFIG.contactEmail)} (${escapeXml(article.authorName)})</author>
      ${article.isSundayLove ? "<category>The Sunday Love Series</category>" : "<category>Journal</category>"}
    </item>`;
    })
    .join("");

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(SITE_CONFIG.heroText)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeedXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
