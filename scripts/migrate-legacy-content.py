#!/usr/bin/env python3
"""
Migrate legacy LetsVibeAI content (vibe-coding-course repo) into the
letsvibe-academy app as typed TypeScript data modules.

Usage:
  python3 scripts/migrate-legacy-content.py <legacy-repo-path>

Generates:
  lib/curriculum-data.ts     6 modules + 3 labs + 10-day bootcamp
  lib/course-directory-data.ts  412 external course recommendations
  lib/tutorial-data.ts       10 article-based tutorial lessons
  lib/blog-data.ts           3 blog posts + 8 LiveBuildAI articles
  lib/resources-data.ts      courses / YT channels / RSS feeds / platforms
"""
import json
import re
import sys
from pathlib import Path

LEGACY = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "repos" / "vibe-coding-course"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "lib"

# ---------------------------------------------------------------------------
# Markdown helpers
# ---------------------------------------------------------------------------

def parse_doc(md: str):
    """Parse markdown into sections: [{heading, items[]}]."""
    sections = []
    current = None
    for raw in md.splitlines():
        line = raw.rstrip()
        if not line.strip():
            continue
        h2 = re.match(r"^##\s+(.+)$", line)
        if h2:
            if current:
                sections.append(current)
            current = {"heading": h2.group(1).strip(), "items": []}
            continue
        if current is None:
            current = {"heading": "Overview", "items": []}
        h3 = re.match(r"^###\s+(.+)$", line)
        h4 = re.match(r"^####\s+(.+)$", line)
        if h3 or h4:
            current["items"].append(f"**{line.lstrip('# ').strip()}**")
        elif re.match(r"^\s*[-*]\s+", line):
            current["items"].append(re.sub(r"^\s*[-*]\s+", "• ", line))
        elif re.match(r"^\s*\d+[.)]\s+", line):
            current["items"].append("• " + re.sub(r"^\s*\d+[.)]\s+", "", line))
        elif re.match(r"^\|", line):
            continue  # table rows
        else:
            current["items"].append(line.strip())
    if current:
        sections.append(current)
    return sections

def ts_str(s: str) -> str:
    return json.dumps(str(s).replace("\u00ad", ""), ensure_ascii=False)

def emit(name: str, type_def: str, data_expr: str, note: str) -> Path:
    path = OUT / name
    header = (
        "// AUTO-GENERATED from the legacy vibe-coding-course repo\n"
        f"// {note}\n"
        "// Regenerate with: python3 scripts/migrate-legacy-content.py\n"
    )
    path.write_text(header + type_def + "\nexport const " + data_expr + "\n", encoding="utf-8")
    print(f"  wrote {path.name} ({path.stat().st_size // 1024} KB)")
    return path

def section_ts(sections) -> str:
    """TS array literal of {heading, items} sections."""
    parts = []
    for s in sections:
        items = "[" + ", ".join(ts_str(i) for i in s["items"]) + "]"
        parts.append(f"  {{ heading: {ts_str(s['heading'])}, items: {items} }}")
    return "[\n" + ",\n".join(parts) + "\n]"

# ---------------------------------------------------------------------------
# 1. Curriculum: modules, labs, bootcamp
# ---------------------------------------------------------------------------

def parse_modules(path: Path):
    text = path.read_text(encoding="utf-8")
    modules = []
    blocks = re.split(r"^##\s+Module\s+(\d+)\s*[—–-]\s*(.+)$", text, flags=re.M)
    # blocks: [pre, n1, title1, body1, n2, title2, body2, ...]
    for i in range(1, len(blocks), 3):
        num = int(blocks[i])
        title = blocks[i + 1].strip()
        body = blocks[i + 2]
        # meta line: difficulty/duration — grab from master table instead; parse "Duration" & "Prerequisites"
        dur = re.search(r"\*\*Duration[:\s]*(.+?)\*\*", body)
        pre = re.search(r"\*\*Prerequisites[:\s]*(.+?)\*\*", body)
        sections = parse_doc(body)
        modules.append({
            "num": num,
            "title": title,
            "duration": dur.group(1) if dur else "",
            "prerequisites": pre.group(1) if pre else "",
            "sections": sections,
        })
    return modules

def parse_labs(path: Path):
    text = path.read_text(encoding="utf-8")
    labs = []
    blocks = re.split(r"^##\s+Lab\s+(\d+)\s*[—–-]\s*(.+)$", text, flags=re.M)
    for i in range(1, len(blocks), 3):
        num = int(blocks[i])
        title = blocks[i + 1].strip()
        body = blocks[i + 2]
        labs.append({
            "num": num,
            "title": title,
            "sections": parse_doc(body),
        })
    return labs

def parse_bootcamp(path: Path):
    text = path.read_text(encoding="utf-8")
    days = []
    blocks = re.split(r"^###\s+Day\s+(\d+)\s*[—–-]\s*(.+)$", text, flags=re.M)
    for i in range(1, len(blocks), 3):
        day = int(blocks[i])
        focus = blocks[i + 1].strip()
        body = blocks[i + 2]
        # first line is usually the content pointer
        content = body.strip().splitlines()[0].strip() if body.strip() else ""
        days.append({"day": day, "focus": focus, "content": content})
    return days

print("Parsing curriculum...")
modules = parse_modules(LEGACY / "curriculum" / "01_FOUNDATIONS_MODULES.md")
labs = parse_labs(LEGACY / "curriculum" / "02_PROJECT_LABS.md")
bootcamp = parse_bootcamp(LEGACY / "curriculum" / "03_10_DAY_AI_BOOTCAMP.md")
print(f"  modules={len(modules)} labs={len(labs)} bootcamp_days={len(bootcamp)}")

overview_text = (LEGACY / "curriculum" / "00_MASTER_CURRICULUM.md").read_text(encoding="utf-8")[:2500]

curriculum_ts = f"""export interface CurriculumSection {{
  heading: string
  items: string[]
}}

export interface Module {{
  num: number
  title: string
  duration: string
  prerequisites: string
  sections: CurriculumSection[]
}}

export interface Lab {{
  num: number
  title: string
  sections: CurriculumSection[]
}}

export interface BootcampDay {{
  day: number
  focus: string
  content: string
}}

export const curriculumModules: Module[] = {json.dumps(modules, indent=2, ensure_ascii=False)}

export const projectLabs: Lab[] = {json.dumps(labs, indent=2, ensure_ascii=False)}

export const bootcampDays: BootcampDay[] = {json.dumps(bootcamp, indent=2, ensure_ascii=False)}

export const curriculumOverview = {ts_str(overview_text)}"""

# ---------------------------------------------------------------------------
# 2. Course directory (412 external courses)
# ---------------------------------------------------------------------------

print("Parsing course directory...")
courses_raw = json.loads((LEGACY / "data" / "courses.json").read_text(encoding="utf-8"))
courses = []
for i, c in enumerate(courses_raw, 1):
    courses.append({
        "id": c.get("id") or f"c{i:04d}",
        "name": c.get("name") or c.get("title", ""),
        "provider": c.get("provider", ""),
        "url": c.get("url", ""),
        "level": c.get("level", ""),
        "price": c.get("price", ""),
        "description": (c.get("desc") or c.get("description") or "").strip(),
        "icon": c.get("icon", "🎓"),
    })

courses_ts = f"""export interface Course {{
  id: string
  name: string
  provider: string
  url: string
  level: string
  price: string
  description: string
  icon: string
}}

export const courses: Course[] = {json.dumps(courses, indent=2, ensure_ascii=False)}

export const getCourseLevels = (): string[] =>
  Array.from(new Set(courses.map((c) => c.level))).sort()

export const searchCourses = (query: string): Course[] => {{
  const q = query.trim().toLowerCase()
  if (!q) return courses
  return courses.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  )
}}"""

# ---------------------------------------------------------------------------
# 3. Tutorials (article-lessons)
# ---------------------------------------------------------------------------

print("Parsing tutorials...")
tutorials = []
lesson_dir = LEGACY / "curriculum" / "article-lessons"
for md_path in sorted(lesson_dir.glob("*.md")):
    text = md_path.read_text(encoding="utf-8")
    title_m = re.search(r"^#\s+(.+)$", text, flags=re.M)
    type_m = re.search(r"\*\*Type[:\s]*(.+?)\*\*", text)
    dur_m = re.search(r"\*\*Duration[:\s]*(.+?)\*\*", text)
    pre_m = re.search(r"\*\*Prerequisites[:\s]*(.+?)\*\*", text)
    sections = parse_doc(text)
    # drop the H1 line from the first section if present
    if sections and sections[0]["items"]:
        sections[0]["items"] = [i for i in sections[0]["items"] if not i.startswith("# ")]
    tutorials.append({
        "id": md_path.stem,
        "title": title_m.group(1).strip() if title_m else md_path.stem,
        "type": type_m.group(1).strip() if type_m else "Lesson",
        "duration": dur_m.group(1).strip() if dur_m else "",
        "prerequisites": pre_m.group(1).strip() if pre_m else "",
        "sections": sections,
    })

tutorials_ts = f"""import type {{ CurriculumSection }} from "./curriculum-data"

export interface Tutorial {{
  id: string
  title: string
  type: string
  duration: string
  prerequisites: string
  sections: CurriculumSection[]
}}

export const tutorials: Tutorial[] = {json.dumps(tutorials, indent=2, ensure_ascii=False)}

export const getTutorialById = (id: string): Tutorial | undefined =>
  tutorials.find((t) => t.id === id)"""

# ---------------------------------------------------------------------------
# 4. Blog posts (blog.json + data/articles)
# ---------------------------------------------------------------------------

print("Parsing blog posts...")
posts = []
blog_raw = json.loads((LEGACY / "data" / "blog.json").read_text(encoding="utf-8"))
for p in blog_raw.get("blog_posts", []):
    content = p.get("content", "")
    posts.append({
        "id": p.get("id", p.get("slug", "")),
        "title": p.get("title", ""),
        "excerpt": p.get("excerpt", ""),
        "author": p.get("author", "LetsVibeAI"),
        "date": p.get("date", ""),
        "category": p.get("category", "Article"),
        "tags": p.get("tags", []),
        "featured": bool(p.get("featured", False)),
        "content": content,
        "sections": parse_doc(f"## {content}") if content else [],
    })

articles_dir = LEGACY / "data" / "articles"
for md_path in sorted(articles_dir.glob("*.md")):
    text = md_path.read_text(encoding="utf-8")
    title_m = re.search(r"^#\s+(.+)$", text, flags=re.M)
    cat_m = re.search(r"\*\*(?:Source|Type)[:\s]*(.+?)\*\*", text)
    sections = parse_doc(text)
    if sections and sections[0]["items"]:
        sections[0]["items"] = [i for i in sections[0]["items"] if not i.startswith("# ")]
    excerpt = sections[0]["items"][0] if sections and sections[0]["items"] else ""
    posts.append({
        "id": md_path.stem,
        "title": title_m.group(1).strip() if title_m else md_path.stem,
        "excerpt": excerpt[:160],
        "author": "LetsVibeAI",
        "date": "2025-09-30",
        "category": cat_m.group(1).strip() if cat_m else "Article",
        "tags": ["LiveBuildAI"],
        "featured": False,
        "content": "",
        "sections": sections,
    })

posts.sort(key=lambda p: p["date"], reverse=True)
blog_ts = f"""import type {{ CurriculumSection }} from "./curriculum-data"

export interface BlogPost {{
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  tags: string[]
  featured: boolean
  content: string
  sections: CurriculumSection[]
}}

export const blogPosts: BlogPost[] = {json.dumps(posts, indent=2, ensure_ascii=False)}

export const getBlogPostById = (id: string): BlogPost | undefined =>
  blogPosts.find((p) => p.id === id)

export const getBlogCategories = (): string[] =>
  Array.from(new Set(blogPosts.map((p) => p.category)))

export const formatBlogDate = (date: string): string => {{
  if (!date) return ""
  return new Intl.DateTimeFormat("en-US", {{ year: "numeric", month: "long", day: "numeric" }}).format(new Date(date))
}}"""

# ---------------------------------------------------------------------------
# 5. Resources
# ---------------------------------------------------------------------------

print("Parsing resources...")
res_raw = json.loads((LEGACY / "data" / "resources.json").read_text(encoding="utf-8"))

resources_ts = f"""export interface ResourceCourse {{
  id: string
  title: string
  provider: string
  url: string
  instructor: string
  duration: string
  level: string
  price: string
  description: string
  tags: string[]
}}

export interface ResourceLink {{
  name: string
  url: string
  description?: string
}}

export const resourceCourses: ResourceCourse[] = {json.dumps(res_raw.get("courses", []), indent=2, ensure_ascii=False)}

export const youtubeChannels: ResourceLink[] = {json.dumps(res_raw.get("youtube_channels", []), indent=2, ensure_ascii=False)}

export const rssFeeds: ResourceLink[] = {json.dumps(res_raw.get("rss_feeds", []), indent=2, ensure_ascii=False)}

export const platforms: ResourceLink[] = {json.dumps(res_raw.get("platforms", []), indent=2, ensure_ascii=False)}"""

# ---------------------------------------------------------------------------
# Write everything
# ---------------------------------------------------------------------------

OUT.mkdir(parents=True, exist_ok=True)
emit("curriculum-data.ts", curriculum_ts.split("\nexport const")[0].split("\n\n")[0] + "\n", "", "")
# curriculum file includes types + all three datasets
(curriculum_ts.split("\n\n")[0] + "")

# curriculum-data.ts — full custom assembly
curriculum_path = OUT / "curriculum-data.ts"
curriculum_path.write_text(
    "// AUTO-GENERATED from the legacy vibe-coding-course repo\n"
    "// Curriculum: 6 modules, 3 labs, 10-day bootcamp\n"
    "// Regenerate with: python3 scripts/migrate-legacy-content.py\n"
    + curriculum_ts,
    encoding="utf-8",
)
print(f"  wrote curriculum-data.ts ({curriculum_path.stat().st_size // 1024} KB)")

emit("course-directory-data.ts", courses_ts.split("\nexport const")[0], courses_ts.split("\nexport const", 1)[1], "412 external course recommendations")
emit("tutorial-data.ts", tutorials_ts.split("\nexport const")[0], tutorials_ts.split("\nexport const", 1)[1], "10 article-based lessons")
emit("blog-data.ts", blog_ts.split("\nexport const")[0], blog_ts.split("\nexport const", 1)[1], "blog posts + LiveBuildAI articles")
emit("resources-data.ts", resources_ts.split("\nexport const")[0], resources_ts.split("\nexport const", 1)[1], "courses / YT channels / RSS feeds / platforms")

print("Done.")
