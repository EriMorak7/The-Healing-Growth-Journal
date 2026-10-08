import json
import os
import re
import urllib.request
import sqlite3
from urllib.parse import urlparse
import html as html_lib

def download_file(url, filepath):
    if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
        return True
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            with open(filepath, "wb") as f:
                f.write(resp.read())
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def clean_and_embed_images(body_html, slug, image_mapping):
    if not body_html:
        return ""

    # Remove Substack subscription widgets
    html = re.sub(r'<div class="subscription-widget-wrap"[^>]*>.*?</div>', '', body_html, flags=re.DOTALL)
    html = re.sub(r'<div class="captioned-image-container"[^>]*>(.*?)</div>', r'\1', html, flags=re.DOTALL)
    
    # Replace inline img tags with local markdown/html images
    def img_replacer(match):
        img_tag = match.group(0)
        src_match = re.search(r'src=["\']([^"\']+)["\']', img_tag)
        if not src_match:
            return ""
        src = src_match.group(1)
        # Skip small avatars
        if "w_56" in src or "w_40" in src:
            return ""
        local_path = image_mapping.get(src)
        if local_path:
            return f'\n\n<figure class="my-8 text-center"><img src="{local_path}" alt="Article Illustration" class="rounded-sm mx-auto shadow-md max-h-[500px] object-cover border border-[#EAE0D1]" /></figure>\n\n'
        return ""

    html = re.sub(r'<img[^>]+>', img_replacer, html)

    # Convert block elements to paragraphs
    html = re.sub(r'</p>\s*<p[^>]*>', '\n\n', html)
    html = re.sub(r'<br\s*/?>', '\n', html)
    html = re.sub(r'</h[1-6]>\s*', '\n\n', html)
    html = re.sub(r'</blockquote>\s*', '\n\n', html)

    # Strip remaining HTML tags except figure/img/strong/em/blockquote
    # Let's keep our figure and img tags intact!
    # Split by figure tags
    parts = re.split(r'(<figure.*?</figure>)', html, flags=re.DOTALL)
    cleaned_parts = []
    for part in parts:
        if part.startswith('<figure'):
            cleaned_parts.append(part.strip())
        else:
            text = re.sub(r'<[^>]+>', '', part)
            text = html_lib.unescape(text)
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            cleaned_parts.extend(paragraphs)

    return '\n\n'.join(cleaned_parts)

def main():
    print("1. Loading Substack posts...")
    with open("substack_posts.json", "r", encoding="utf-8") as f:
        posts = json.load(f)

    db_path = "prisma/dev.db" if os.path.exists("prisma/dev.db") else "dev.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    total_downloaded = 0
    updated_articles = 0

    for idx, p in enumerate(posts):
        title = p.get("title", "").strip()
        slug = p.get("slug", "").strip()
        cover_image = p.get("cover_image")
        body_html = p.get("body_html", "")

        slug_dir = os.path.join("public", "images", "articles", slug)
        os.makedirs(slug_dir, exist_ok=True)

        image_mapping = {}

        # 1. Download cover image
        local_cover = None
        if cover_image:
            ext = ".png" if ".png" in cover_image else (".webp" if ".webp" in cover_image else ".jpg")
            filename = f"cover{ext}"
            filepath = os.path.join(slug_dir, filename)
            if download_file(cover_image, filepath):
                local_cover = f"/images/articles/{slug}/{filename}"
                image_mapping[cover_image] = local_cover
                total_downloaded += 1

        # 2. Find and download inline images
        inline_imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body_html)
        inline_counter = 1
        for img_url in inline_imgs:
            if "w_56" in img_url or "w_40" in img_url:
                continue # Skip small author avatars
            if img_url in image_mapping:
                continue
            ext = ".png" if ".png" in img_url else (".webp" if ".webp" in img_url else ".jpg")
            filename = f"inline_{inline_counter}{ext}"
            filepath = os.path.join(slug_dir, filename)
            if download_file(img_url, filepath):
                local_img = f"/images/articles/{slug}/{filename}"
                image_mapping[img_url] = local_img
                total_downloaded += 1
                inline_counter += 1

        # 3. Clean and embed images into body
        body_content = clean_and_embed_images(body_html, slug, image_mapping)

        # 4. Update Article in database
        cursor.execute("""
            UPDATE Article
            SET featuredImage = ?, body = ?
            WHERE slug = ?
        """, (local_cover, body_content, slug))

        if cursor.rowcount > 0:
            updated_articles += 1
            print(f"[{idx+1}] Synced: {title[:40]}... -> Cover: {local_cover} | Images: {len(image_mapping)}")

    conn.commit()
    conn.close()
    print(f"\nDone! Downloaded {total_downloaded} images and updated {updated_articles} articles in database.")

if __name__ == "__main__":
    main()
