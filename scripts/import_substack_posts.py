import json
import os
import re
import urllib.request
import sqlite3
from datetime import datetime

def download_image(url, target_path):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(target_path, "wb") as f:
                f.write(resp.read())
        print(f"Downloaded: {target_path}")
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def clean_html_body(html):
    if not html:
        return ""
    # Remove script, style, subscribe forms
    html = re.sub(r'<div class="subscription-widget-wrap"[^>]*>.*?</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<div class="captioned-image-container"[^>]*>(.*?)</div>', r'\1', html, flags=re.DOTALL)
    
    # Replace paragraphs and breaks with double newlines
    html = re.sub(r'</p>\s*<p[^>]*>', '\n\n', html)
    html = re.sub(r'<br\s*/?>', '\n', html)
    html = re.sub(r'</h[1-6]>\s*', '\n\n', html)
    html = re.sub(r'</blockquote>\s*', '\n\n', html)
    
    # Strip remaining HTML tags
    text = re.sub(r'<[^>]+>', '', html)
    
    # Decode html entities
    import html as html_lib
    text = html_lib.unescape(text)
    
    # Clean up whitespace
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    return '\n\n'.join(paragraphs)

def main():
    print("1. Downloading official brand assets...")
    avatar_url = "https://substack-post-media.s3.amazonaws.com/public/images/59c2b05a-c95d-414c-be8f-f12e1fa96f6c_853x853.jpeg"
    logo_url = "https://substack-post-media.s3.amazonaws.com/public/images/ae5bce4e-81cd-46a9-8fc9-49d7a9f5ae64_853x853.png"

    download_image(avatar_url, "public/images/glory-avatar.jpg")
    download_image(logo_url, "public/images/journal-logo.png")

    print("\n2. Loading Substack posts...")
    with open("substack_posts.json", "r", encoding="utf-8") as f:
        posts = json.load(f)

    db_path = "prisma/dev.db" if os.path.exists("prisma/dev.db") else "dev.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get categories map
    cursor.execute("SELECT id, slug FROM Category")
    cat_rows = cursor.fetchall()
    cat_map = {slug: id for id, slug in cat_rows}
    print("Found categories:", list(cat_map.keys()))

    # Get series id for Sunday Love Series
    cursor.execute("SELECT id FROM Series WHERE slug = 'sunday-love-series'")
    series_row = cursor.fetchone()
    sunday_series_id = series_row[0] if series_row else None

    # Get tags map
    cursor.execute("SELECT id, slug FROM Tag")
    tag_rows = cursor.fetchall()
    tag_map = {slug: id for id, slug in tag_rows}

    imported_count = 0
    now = datetime.utcnow().isoformat()

    for p in posts:
        title = p.get("title", "").strip()
        slug = p.get("slug", "").strip()
        subtitle = p.get("subtitle", "").strip()
        description = p.get("description", "").strip()
        excerpt = subtitle if subtitle else (description if description else title)
        cover_image = p.get("cover_image")
        body_html = p.get("body_html", "")
        body_text = clean_html_body(body_html)
        wordcount = p.get("wordcount", len(body_text.split()))
        reading_time = f"{max(1, round(wordcount / 200))} min read"
        post_date = p.get("post_date") or now

        # Determine if Sunday Love Series
        title_upper = title.upper()
        post_tags = [t.get("slug", "") for t in p.get("postTags", [])]
        is_sunday_love = (
            "SUNDAY LOVE" in title_upper or
            "the-sunday-love-series" in post_tags or
            "poem" in excerpt.lower() or
            slug in ["if-you-came-home", "the-sunday-love-series-i-found-a", "the-sunday-love-series-how-to-love", "little-bird", "beyond-the-ecstasy-love-needs-more"]
        )

        # Categorization logic based on real content
        assigned_categories = []
        if is_sunday_love or "love" in title.lower() or "partner" in title.lower() or "relationship" in title.lower() or "marriage" in title.lower():
            assigned_categories.append("relationships")
        
        if "healing" in title.lower() or "childhood" in title.lower() or "grief" in title.lower() or "nightmare" in title.lower() or "survived" in title.lower() or "hurt" in title.lower():
            assigned_categories.append("healing")

        if "burnout" in title.lower() or "becoming" in title.lower() or "dreams" in title.lower() or "nurse" in title.lower() or "pray more" in title.lower() or "strength" in title.lower():
            assigned_categories.append("growth")

        if "reflection" in title.lower() or "letter" in title.lower() or "devotional" in title.lower() or "words" in title.lower() or "note" in title.lower():
            assigned_categories.append("reflection")

        # Fallback if none assigned
        if not assigned_categories:
            assigned_categories.append("reflection")

        # Generate a cuid-like id
        import uuid
        art_id = "sub_" + uuid.uuid4().hex[:20]

        # Check if article with this slug already exists
        cursor.execute("SELECT id FROM Article WHERE slug = ?", (slug,))
        existing = cursor.fetchone()

        if existing:
            existing_id = existing[0]
            cursor.execute("""
                UPDATE Article SET
                    title = ?, excerpt = ?, body = ?, featuredImage = ?,
                    readingTime = ?, isPublished = 1, isSundayLove = ?,
                    seriesId = ?, publishedAt = ?, updatedAt = ?
                WHERE id = ?
            """, (
                title, excerpt, body_text, cover_image,
                reading_time, 1 if is_sunday_love else 0,
                sunday_series_id if is_sunday_love else None,
                post_date, now, existing_id
            ))
            art_id = existing_id
        else:
            cursor.execute("""
                INSERT INTO Article (
                    id, title, slug, excerpt, body, featuredImage,
                    authorName, readingTime, isPublished, publishedAt,
                    isSundayLove, isFeatured, seriesId, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, 'Glory', ?, 1, ?, ?, 0, ?, ?, ?)
            """, (
                art_id, title, slug, excerpt, body_text, cover_image,
                reading_time, post_date, 1 if is_sunday_love else 0,
                sunday_series_id if is_sunday_love else None,
                now, now
            ))

        # Assign categories
        for cat_slug in assigned_categories:
            cat_id = cat_map.get(cat_slug)
            if cat_id:
                cursor.execute("""
                    INSERT OR IGNORE INTO ArticleCategory (articleId, categoryId)
                    VALUES (?, ?)
                """, (art_id, cat_id))

        imported_count += 1
        print(f"[{imported_count}] Imported: {title} | Sunday Love: {is_sunday_love} | Cats: {assigned_categories}")

    conn.commit()
    conn.close()
    print(f"\nAll {imported_count} articles successfully imported and linked in database!")

if __name__ == "__main__":
    main()
