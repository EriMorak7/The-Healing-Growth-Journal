import json
import re

with open("substack_posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

print(f"Total posts: {len(posts)}")
if posts:
    sample = posts[0]
    print("Keys in post:", list(sample.keys()))
    print("Publication details:", sample.get("publication", {}))
    print("Cover image:", sample.get("cover_image"))

# Let's inspect the about html
with open("substack_about.html", "r", encoding="utf-8") as f:
    html = f.read()

# Match og:description, description, author, etc
desc_match = re.findall(r'<meta[^>]+(?:name|property)=["\'](?:og:)?description["\'][^>]+content=["\']([^"\']+)["\']', html)
print("Descriptions:", desc_match)

# Match publication name and tagline
title_match = re.findall(r'<title[^>]*>(.*?)</title>', html)
print("Title:", title_match)
