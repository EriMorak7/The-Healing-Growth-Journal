import json
import re

with open("substack_posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

print(f"Total posts: {len(posts)}")
for i, p in enumerate(posts):
    cover = p.get("cover_image")
    body = p.get("body_html", "")
    inline_imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', body)
    print(f"[{i+1}] {p.get('title')} ({p.get('slug')})")
    print(f"    Cover image: {cover}")
    print(f"    Inline images count: {len(inline_imgs)}")
    for img in inline_imgs:
        print(f"      - {img}")
