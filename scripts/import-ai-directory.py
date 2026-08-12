#!/usr/bin/env python3
"""
Import the aitooldirectory CSV into LetsVibeAI as a clean TypeScript data module.

Canonical source: github.com/diamitani/aitooldirectory
Usage: python3 scripts/import-ai-directory.py [path/to/csv] [output.ts]
Default csv:  data/ai-tools-directory.csv
Default out:  lib/ai-directory-data.ts
"""
import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data" / "ai-tools-directory.csv"
OUT_PATH = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "lib" / "ai-directory-data.ts"

# ---------------------------------------------------------------------------
# Category normalization
# ---------------------------------------------------------------------------
CATEGORY_MAP = {
    "LLM / Chatbot": "LLM & Chatbots",
    "Video / Image": "Video & Image",
    "Marketing / SEO": "Marketing & SEO",
    "Creative Tools": "Creative",
    "Education": "Education",
    "General / Other": "General",
    "Productivity / Automation": "Productivity",
    "Document / Data": "Documents & Data",
    "Finance": "Finance",
    "Developer Tools": "Developer Tools",
    "Healthcare": "Healthcare",
}

# Well-known tools to feature on the directory landing view
FEATURED = [
    "chatgpt", "claude", "gemini", "midjourney", "perplexity", "copilot",
    "canva", "notion", "elevenlabs", "runway", "stable diffusion", "dall-e",
    "jasper", "copy.ai", "zapier", "leonardo", "synthesia", "descript",
]

# Well-known tools missing URLs in the source CSV — backfilled here
KNOWN_URLS = {
    "grammarly": "https://www.grammarly.com/",
    "wordtune": "https://www.wordtune.com/",
    "getmunch": "https://www.getmunch.com/",
    "vyond": "https://www.vyond.com/",
    "wisecut": "https://wisecut.ai/",
    "alison": "https://alison.com/",
    "dropbox": "https://www.dropbox.com/",
    "designs.ai": "https://designs.ai/",
}

def clean_url(raw: str, name: str = "") -> str:
    """Normalize a URL for dedupe + display. Backfills missing URLs for known tools."""
    url = (raw or "").strip().strip('"').strip()
    if not url and name:
        url = KNOWN_URLS.get(name.lower(), "")
    if not url:
        return ""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url

def dedupe_key(url: str) -> str:
    """URL key for duplicate detection (ignore protocol, trailing slash, tracking)."""
    key = re.sub(r"^(https?://)?(www\.)?", "", url.lower().rstrip("/"))
    key = re.sub(r"(\?|&)(utm_|ref=).*$", "", key)
    return key

def clean_description(raw: str) -> str:
    """Strip prefixes/whitespace, keep a tight 2-sentence summary."""
    text = raw or ""
    text = re.sub(r"^DESCRIPTION\s*:\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip()
    # Cut at the second sentence boundary, cap length
    sentences = re.split(r"(?<=[.!?])\s+", text)
    summary = " ".join(sentences[:2])
    if len(summary) > 320:
        summary = summary[:317].rsplit(" ", 1)[0] + "..."
    return summary

def clean_name(raw: str) -> str:
    name = re.sub(r"\s+", " ", (raw or "").strip())
    # Title case cleanup for ALL-CAPS names
    if name.isupper() and len(name) > 3:
        name = name.title()
    return name

def main() -> None:
    if not CSV_PATH.exists():
        sys.exit(f"CSV not found: {CSV_PATH}")

    with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    seen: dict[str, str] = {}
    tools = []
    skipped = 0
    for i, row in enumerate(rows, 1):
        name = clean_name(row.get("Name", ""))
        url = clean_url(row.get("URL", ""), name)
        if not name or not url:
            skipped += 1
            continue
        key = dedupe_key(url)
        if key in seen:
            skipped += 1
            continue
        seen[key] = name
        category = CATEGORY_MAP.get(row.get("Category", "").strip(), "General")
        desc = clean_description(row.get("Description", ""))
        tools.append({
            "id": f"d{i:04d}",
            "name": name,
            "description": desc,
            "link": url,
            "category": category,
            "source": "directory",
            "featured": any(f in name.lower() for f in FEATURED),
        })

    # Stats
    cats = Counter(t["category"] for t in tools)
    featured = [t["name"] for t in tools if t["featured"]]
    print(f"Imported: {len(tools)} tools from {len(rows)} rows ({skipped} skipped)")
    print("Categories:")
    for cat, n in cats.most_common():
        print(f"  {n:4d}  {cat}")
    print(f"Featured ({len(featured)}): {', '.join(featured[:12])}")

    # Emit TypeScript module
    header = f"""// AUTO-GENERATED from aitooldirectory (github.com/diamitani/aitooldirectory)
// Regenerate with: python3 scripts/import-ai-directory.py
// Source CSV: data/ai-tools-directory.csv ({len(tools)} tools, {len(cats)} categories)
import type {{ Tool }} from "./tools-data"

export const directoryTools: Tool[] = {json.dumps(tools, indent=2, ensure_ascii=False)}

export const getDirectoryCategories = (): string[] =>
  Array.from(new Set(directoryTools.map((t) => t.category))).sort()

export const getDirectoryToolsByCategory = (category: string): Tool[] =>
  category === "all" ? directoryTools : directoryTools.filter((t) => t.category === category)

export const searchDirectoryTools = (query: string): Tool[] => {{
  const q = query.trim().toLowerCase()
  if (!q) return directoryTools
  return directoryTools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  )
}}
"""
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(header, encoding="utf-8")
    print(f"Wrote: {OUT_PATH} ({OUT_PATH.stat().st_size // 1024} KB)")

if __name__ == "__main__":
    main()
