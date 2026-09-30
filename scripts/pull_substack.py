import urllib.request
import json
import os
import xml.etree.ElementTree as ET

def fetch(url):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode("utf-8")

def main():
    print("1. Fetching Substack API posts...")
    try:
        data_str = fetch("https://thehealingandgrowthjournal.substack.com/api/v1/posts?limit=50")
        posts = json.loads(data_str)
        print(f"Successfully fetched {len(posts)} posts from Substack API!")
        with open("substack_posts.json", "w", encoding="utf-8") as f:
            json.dump(posts, f, indent=2, ensure_ascii=False)
        for i, p in enumerate(posts):
            print(f"[{i+1}] {p.get('title')} ({p.get('post_date')}) - {p.get('slug')}")
            print(f"    Subtitle: {p.get('subtitle')}")
    except Exception as e:
        print("API fetch failed:", e)

    print("\n2. Fetching Substack RSS feed...")
    try:
        rss_str = fetch("https://thehealingandgrowthjournal.substack.com/feed")
        with open("substack_feed.xml", "w", encoding="utf-8") as f:
            f.write(rss_str)
        print("Saved RSS feed to substack_feed.xml")
    except Exception as e:
        print("RSS fetch failed:", e)

    print("\n3. Fetching Substack About page...")
    try:
        about_html = fetch("https://thehealingandgrowthjournal.substack.com/about")
        with open("substack_about.html", "w", encoding="utf-8") as f:
            f.write(about_html)
        print("Saved About page to substack_about.html")
    except Exception as e:
        print("About page fetch failed:", e)

if __name__ == "__main__":
    main()
