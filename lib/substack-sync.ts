import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

const SUBSTACK_API_URL = "https://thehealingandgrowthjournal.substack.com/api/v1/posts?limit=30";

export interface SyncResult {
  success: boolean;
  totalFetched: number;
  newCount: number;
  updatedCount: number;
  latestPostTitle?: string;
  error?: string;
}

/**
 * Downloads a remote image file to local public storage
 */
async function downloadFile(url: string, filepath: string): Promise<boolean> {
  try {
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
      return true;
    }

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!res.ok) return false;

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch (err) {
    console.error(`[Substack Sync] Failed to download image ${url}:`, err);
    return false;
  }
}

/**
 * Cleans Substack body HTML, downloads inline images locally,
 * and formats paragraphs and figures
 */
async function processArticleBody(
  bodyHtml: string,
  slug: string
): Promise<{ cleanedBody: string; inlineCount: number }> {
  if (!bodyHtml) return { cleanedBody: "", inlineCount: 0 };

  const slugDir = path.join(process.cwd(), "public", "images", "articles", slug);

  // Remove Substack subscription CTA buttons and embeds
  let html = bodyHtml.replace(/<div class="subscription-widget-wrap"[^>]*>[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<div class="captioned-image-container"[^>]*>([\s\S]*?)<\/div>/gi, "$1");

  // Find all inline images
  const imgMatches = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi));
  const imageMapping: Record<string, string> = {};
  let inlineCounter = 1;

  for (const match of imgMatches) {
    const src = match[1];
    if (src.includes("w_56") || src.includes("w_40") || imageMapping[src]) {
      continue; // Skip avatars or duplicates
    }

    const ext = src.includes(".png") ? ".png" : src.includes(".webp") ? ".webp" : ".jpg";
    const filename = `inline_${inlineCounter}${ext}`;
    const localFilepath = path.join(slugDir, filename);

    const ok = await downloadFile(src, localFilepath);
    if (ok) {
      const localUrl = `/images/articles/${slug}/${filename}`;
      imageMapping[src] = localUrl;
      inlineCounter++;
    }
  }

  // Replace inline img tags with styled figure elements
  html = html.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
    const localUrl = imageMapping[src];
    if (localUrl) {
      return `\n\n<figure class="my-8 text-center"><img src="${localUrl}" alt="Story Illustration" class="rounded-sm mx-auto shadow-md max-h-[500px] object-cover border border-[#EAE0D1]" /></figure>\n\n`;
    }
    return "";
  });

  // Convert block transitions
  html = html.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  html = html.replace(/<br\s*\/?>/gi, "\n");
  html = html.replace(/<\/h[1-6]>\s*/gi, "\n\n");
  html = html.replace(/<\/blockquote>\s*/gi, "\n\n");

  // Keep figure tags intact while stripping raw html tags from text paragraphs
  const parts = html.split(/(<figure[\s\S]*?<\/figure>)/gi);
  const cleanedParts: string[] = [];

  for (const part of parts) {
    if (part.startsWith("<figure")) {
      cleanedParts.push(part.trim());
    } else {
      // Strip remaining tags
      const text = part
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

      const paragraphs = text
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      cleanedParts.push(...paragraphs);
    }
  }

  return {
    cleanedBody: cleanedParts.join("\n\n"),
    inlineCount: inlineCounter - 1,
  };
}

/**
 * Categorizes an article into one of the 4 Pillars
 */
function determineCategorySlug(title: string, bodyText: string, isSundayLove: boolean): string {
  if (isSundayLove) {
    return "healthy-relationships";
  }

  const combined = `${title} ${bodyText}`.toLowerCase();

  if (
    combined.includes("grief") ||
    combined.includes("heartbreak") ||
    combined.includes("wound") ||
    combined.includes("drown") ||
    combined.includes("stolen") ||
    combined.includes("weight") ||
    combined.includes("hurt") ||
    combined.includes("pain") ||
    combined.includes("heal")
  ) {
    return "emotional-healing";
  }

  if (
    combined.includes("grow") ||
    combined.includes("habit") ||
    combined.includes("schedule") ||
    combined.includes("career") ||
    combined.includes("discipline") ||
    combined.includes("race") ||
    combined.includes("burnout")
  ) {
    return "personal-growth";
  }

  if (
    combined.includes("love") ||
    combined.includes("partner") ||
    combined.includes("relationship") ||
    combined.includes("friendship") ||
    combined.includes("chemistry") ||
    combined.includes("compatibility")
  ) {
    return "healthy-relationships";
  }

  return "quiet-reflection";
}

/**
 * Synchronizes recent posts from Substack directly into the SQLite/Postgres database
 */
export async function syncSubstackPosts(): Promise<SyncResult> {
  try {
    console.log("[Substack Sync] Fetching posts from Substack API...");
    const res = await fetch(SUBSTACK_API_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Substack: ${res.status} ${res.statusText}`);
    }

    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      return { success: true, totalFetched: 0, newCount: 0, updatedCount: 0 };
    }

    // Ensure categories exist in DB
    const categoryMap: Record<string, string> = {};
    const categories = await db.category.findMany();
    for (const c of categories) {
      categoryMap[c.slug] = c.id;
    }

    let newCount = 0;
    let updatedCount = 0;

    for (const post of posts) {
      const title = (post.title || "").trim();
      const slug = (post.slug || "").trim();
      if (!title || !slug) continue;

      const coverImageUrl = post.cover_image;
      const bodyHtml = post.body_html || "";
      const postDate = post.post_date ? new Date(post.post_date) : new Date();

      // Check if Sunday Love Series (strictly boolean)
      const isSundayLove = Boolean(
        title.toLowerCase().includes("sunday love") ||
        slug.toLowerCase().includes("sunday-love") ||
        (post.subtitle && post.subtitle.toLowerCase().includes("sunday love"))
      );

      // Download Cover Image locally
      let localCover: string | null = null;
      if (coverImageUrl) {
        const ext = coverImageUrl.includes(".png")
          ? ".png"
          : coverImageUrl.includes(".webp")
          ? ".webp"
          : ".jpg";
        const coverFilename = `cover${ext}`;
        const coverFilepath = path.join(
          process.cwd(),
          "public",
          "images",
          "articles",
          slug,
          coverFilename
        );

        const ok = await downloadFile(coverImageUrl, coverFilepath);
        if (ok) {
          localCover = `/images/articles/${slug}/${coverFilename}`;
        }
      }

      // Process body content and inline images
      const { cleanedBody } = await processArticleBody(bodyHtml, slug);

      // Excerpt / subtitle
      let excerpt = (post.subtitle || post.description || "").trim();
      if (!excerpt && cleanedBody) {
        const firstP = cleanedBody.split("\n\n")[0] || "";
        excerpt = firstP.length > 160 ? firstP.slice(0, 160) + "..." : firstP;
      }

      // Reading time calculation
      const wordcount = post.wordcount || cleanedBody.split(/\s+/).length || 500;
      const readingTime = `${Math.max(2, Math.round(wordcount / 200))} min read`;

      // Determine Category
      const catSlug = determineCategorySlug(title, cleanedBody, isSundayLove);
      const catId = categoryMap[catSlug] || Object.values(categoryMap)[0];

      // Check if article already exists
      const existing = await db.article.findUnique({ where: { slug } });

      if (!existing) {
        // Create new article
        await db.article.create({
          data: {
            title,
            slug,
            excerpt,
            body: cleanedBody,
            featuredImage: localCover,
            authorName: "Glory",
            readingTime,
            isPublished: true,
            publishedAt: postDate,
            isSundayLove,
            isFeatured: false,
            categories: catId
              ? {
                  create: [{ category: { connect: { id: catId } } }],
                }
              : undefined,
          },
        });
        newCount++;
        console.log(`[Substack Sync] Created new piece: "${title}"`);
      } else {
        // Update existing article with latest content/cover if needed
        await db.article.update({
          where: { slug },
          data: {
            title,
            excerpt,
            body: cleanedBody || existing.body,
            featuredImage: localCover || existing.featuredImage,
            isSundayLove,
            readingTime,
            publishedAt: postDate,
          },
        });
        updatedCount++;
      }
    }

    // Record last sync timestamp
    const nowIso = new Date().toISOString();
    await db.siteSetting.upsert({
      where: { key: "last_substack_sync" },
      update: { value: nowIso },
      create: { key: "last_substack_sync", value: nowIso },
    });

    const latestTitle = posts[0]?.title || "";
    await db.siteSetting.upsert({
      where: { key: "last_substack_post" },
      update: { value: latestTitle },
      create: { key: "last_substack_post", value: latestTitle },
    });

    // Revalidate Next.js cache so the whole website shows new articles instantly
    try {
      revalidatePath("/");
      revalidatePath("/journal");
      revalidatePath("/sunday-love-series");
      revalidatePath("/sitemap.xml");
      revalidatePath("/feed.xml");
    } catch {
      // Revalidation inside some background contexts is non-fatal
    }

    console.log(`[Substack Sync Complete] Fetched ${posts.length}, ${newCount} new, ${updatedCount} updated.`);

    return {
      success: true,
      totalFetched: posts.length,
      newCount,
      updatedCount,
      latestPostTitle: latestTitle,
    };
  } catch (err: any) {
    console.error("[Substack Sync Error]:", err);
    return {
      success: false,
      totalFetched: 0,
      newCount: 0,
      updatedCount: 0,
      error: err.message || "Unknown error during sync",
    };
  }
}
