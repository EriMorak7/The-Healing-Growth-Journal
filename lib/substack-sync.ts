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
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 100) {
      return true; // Already downloaded
    }

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!res.ok) {
      console.warn(`[Substack Sync] Failed to download ${url}: ${res.status}`);
      return false;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch (err: any) {
    console.error(`[Substack Sync] Failed to download image ${url}:`, err.message);
    return false;
  }
}

/**
 * Cleans Substack body HTML, downloads all inline images locally,
 * extracts captions, and outputs clean editorial figures
 */
async function processArticleBody(
  bodyHtml: string,
  slug: string,
  coverImageUrl?: string | null,
  localCoverUrl?: string | null
): Promise<{ cleanedBody: string; inlineCount: number; firstInlineImage: string | null }> {
  if (!bodyHtml) return { cleanedBody: "", inlineCount: 0, firstInlineImage: null };

  const slugDir = path.join(process.cwd(), "public", "images", "articles", slug);

  // 1. Strip Substack subscription CTA buttons, embeds, and footers
  let html = bodyHtml;
  html = html.replace(/<div class="subscription-widget-wrap"[^>]*>[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<div class="subscribe-widget"[^>]*>[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<div class="post-footer"[^>]*>[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<div class="share-dialog"[^>]*>[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<p class="button-wrapper"[^>]*>[\s\S]*?<\/p>/gi, "");
  html = html.replace(/<div class="button-wrap"[^>]*>[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<div class="pencraft[\s\S]*?<\/div>/gi, "");

  // 2. Extract and download all images from <figure> / captioned containers
  const containerRegex = /(?:<div class="captioned-image-container"[^>]*>\s*)?<figure[\s\S]*?<\/figure>(?:\s*<\/div>)?/gi;

  let inlineCounter = 1;
  let firstInlineLocalUrl: string | null = null;
  const replacedImages: {
    originalSrc: string;
    localUrl: string;
    caption: string;
    isCover: boolean;
  }[] = [];

  const matches = Array.from(html.matchAll(containerRegex));
  const containerReplacements: { matchText: string; replacement: string; isCover: boolean }[] = [];

  for (const match of matches) {
    const block = match[0];
    const imgMatch = block.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!imgMatch) {
      containerReplacements.push({ matchText: block, replacement: "", isCover: false });
      continue;
    }

    const src = imgMatch[1];
    if (src.includes("w_56") || src.includes("w_40") || src.includes("avatar")) {
      containerReplacements.push({ matchText: block, replacement: "", isCover: false });
      continue;
    }

    // Extract caption if present
    const capMatch = block.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    let caption = "";
    if (capMatch) {
      caption = capMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
    }

    // Determine extension & filename
    const ext = src.includes(".png") ? ".png" : src.includes(".webp") ? ".webp" : ".jpg";
    const filename = `inline_${inlineCounter}${ext}`;
    const localFilepath = path.join(slugDir, filename);

    // Download image
    await downloadFile(src, localFilepath);
    const localUrl = `/images/articles/${slug}/${filename}`;

    if (!firstInlineLocalUrl) {
      firstInlineLocalUrl = localUrl;
    }

    // Check if this image matches the cover image
    const isCover = Boolean(
      coverImageUrl &&
        (src.includes(coverImageUrl) ||
          coverImageUrl.includes(src.split("?")[0].split("/").pop() || ""))
    );

    replacedImages.push({ originalSrc: src, localUrl, caption, isCover });
    inlineCounter++;

    const captionHtml = caption
      ? `\n  <figcaption class="text-xs text-[#866746] italic mt-2.5 font-sans">${caption}</figcaption>`
      : "";

    const replacement = `\n\n<figure class="my-10 text-center">\n  <img src="${localUrl}" alt="${caption || 'Article Illustration'}" class="rounded-sm mx-auto shadow-md max-h-[550px] w-auto object-cover border border-[#EAE0D1]" />${captionHtml}\n</figure>\n\n`;

    containerReplacements.push({ matchText: block, replacement, isCover });
  }

  // Apply replacements
  for (const rep of containerReplacements) {
    html = html.replace(rep.matchText, rep.replacement);
  }

  // 3. Convert block transitions
  html = html.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  html = html.replace(/<br\s*\/?>/gi, "\n");
  html = html.replace(/<\/h[1-6]>\s*/gi, "\n\n");
  html = html.replace(/<\/blockquote>\s*/gi, "\n\n");

  // 4. Split and clean paragraphs while preserving valid <figure> blocks
  const parts = html.split(/(<figure[\s\S]*?<\/figure>)/gi);
  const cleanedParts: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith("<figure")) {
      // If this is the very first content block in the body, AND an article cover image already exists,
      // AND this first image matches the cover art and has no unique caption, omit it from the body
      // so the reader doesn't see the identical image twice right above and below the title.
      if (cleanedParts.length === 0 && localCoverUrl && replacedImages[0]?.isCover && !replacedImages[0]?.caption) {
        continue;
      }
      cleanedParts.push(part.trim());
    } else {
      let text = part
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

      // Strip recurring Substack footer boilerplate
      text = text.replace(/Thanks for reading! Subscribe so you don’t miss[\s\S]*$/gi, "");
      text = text.replace(/Share The healing and Growth Journal[\s\S]*$/gi, "");
      text = text.replace(/Subscribe so you don’t miss important lessons[\s\S]*$/gi, "");
      text = text.replace(/Subscribe now\s*/gi, "");

      const paragraphs = text
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0 && !p.startsWith("Subscribe") && !p.startsWith("Share"));

      cleanedParts.push(...paragraphs);
    }
  }

  return {
    cleanedBody: cleanedParts.join("\n\n"),
    inlineCount: inlineCounter - 1,
    firstInlineImage: firstInlineLocalUrl,
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

      // Process body content, download inline images locally, extract captions
      const { cleanedBody, firstInlineImage } = await processArticleBody(
        bodyHtml,
        slug,
        coverImageUrl,
        localCover
      );

      // Fallback to first inline image as featured cover if no post cover was specified
      const finalCover = localCover || firstInlineImage || null;

      // Excerpt / subtitle
      let excerpt = (post.subtitle || post.description || "").trim();
      if (!excerpt && cleanedBody) {
        const firstP = cleanedBody.split("\n\n").find((p) => !p.startsWith("<figure")) || "";
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
            featuredImage: finalCover,
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
        // Update existing article with latest clean content/cover
        await db.article.update({
          where: { slug },
          data: {
            title,
            excerpt,
            body: cleanedBody || existing.body,
            featuredImage: finalCover || existing.featuredImage,
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
    } catch (e) {
      // Revalidation during non-request context is ignored
    }

    console.log(
      `[Substack Sync Complete] Fetched ${posts.length}, ${newCount} new, ${updatedCount} updated.`
    );

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
