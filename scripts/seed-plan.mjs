/**
 * LetsVibeAI Academy v2 — pure content-mapping layer.
 *
 * Reads the legacy content-library.js blob (a `window.ACADEMY_DATA` assignment)
 * and maps it onto the v2 data model per BUILD-PLAN.md.
 *
 * Pure JS, zero dependencies — importable from both the Prisma seed script
 * (scripts/seed-letsvibeai.ts) and the DB-free mapping check
 * (scripts/check-seed-mapping.mjs).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// content-library.js: prefer app/ root (deploy), fall back to repo root (local dev)
const LIBRARY_CANDIDATES = [
  path.resolve(__dirname, "..", "content-library.js"),
  path.resolve(__dirname, "..", "..", "content-library.js"),
];
const LIBRARY_PATH = LIBRARY_CANDIDATES.find((p) => fs.existsSync(p)) ?? LIBRARY_CANDIDATES[0];

/** Load the legacy blob by evaluating it with a `window` stub (as the old site did). */
export function loadLibrary(libraryPath = LIBRARY_PATH) {
  const code = fs.readFileSync(libraryPath, "utf8");
  const windowStub = {};
  new Function("window", code)(windowStub);
  if (!windowStub.ACADEMY_DATA) throw new Error(`ACADEMY_DATA not found in ${libraryPath}`);
  return windowStub.ACADEMY_DATA;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "~4h" -> 240. Returns null when unparseable. */
function parseMinutes(s) {
  const m = /~?\s*(\d+(?:\.\d+)?)\s*h/i.exec(s || "");
  return m ? Math.round(parseFloat(m[1]) * 60) : null;
}

/**
 * Build the full seed plan (plain objects, no DB).
 *
 * Shape:
 * {
 *   courses: [{ slug, title, description, imageUrl?, category, level, isPublished, isFree,
 *               chapters: [{ position, title, isPublished, isFreePreview,
 *                            lessons: [{ position, title, kind, contentUrl?, bodyMd?, durationMin? }] }] }],
 *   tracks:  [{ slug, title, description,
 *               videos: [{ position, youtubeId, title, creator?, duration? }] }],
 *   resources: [{ kind, title, url, source?, description? }],
 *   tools:     [{ name, url, category, description?, pricing? }]
 * }
 */
export function buildSeedPlan(d) {
  // ---- 1. Vibe Coding Masterclass: 6 modules -> Course -> Chapter -> outcome Lessons
  const masterclass = {
    slug: "vibe-coding-masterclass",
    title: "Vibe Coding Masterclass",
    description:
      "The complete vibe coding curriculum in six modules — from how LLMs actually work, through the builder toolkit and prompt chaining, to context engineering and repeatable, team-ready build processes.",
    category: "curriculum",
    level: "All levels",
    isPublished: true,
    isFree: true,
    chapters: d.modules.map((m) => ({
      position: m.num,
      title: `Module ${m.num}: ${m.title}`,
      isPublished: true,
      isFreePreview: true,
      lessons: m.outcomes.map((outcome, i) => ({
        position: i + 1,
        title: outcome,
        kind: "article",
        bodyMd: [
          `# ${outcome}`,
          "",
          m.desc,
          "",
          `*Module ${m.num}: ${m.title} — ${m.duration}, ${m.level}*`,
          "",
          "In this module:",
          ...m.outcomes.map((o) => `- ${o}`),
        ].join("\n"),
        durationMin: 10,
      })),
    })),
  };

  // ---- 2. Hands-On Labs: 3 labs -> Course, one Chapter + one Lesson each
  const labs = {
    slug: "hands-on-labs",
    title: "Hands-On Labs",
    description:
      "Guided, project-based labs that turn the Masterclass into shipped work: plan, generate, and deploy real projects with AI — a marketing site, an e-commerce store, and a full-stack app.",
    category: "labs",
    level: "All levels",
    isPublished: true,
    isFree: true,
    chapters: d.labs.map((lab) => ({
      position: lab.num,
      title: `Lab ${lab.num}: ${lab.title}`,
      isPublished: true,
      isFreePreview: true,
      lessons: [
        {
          position: 1,
          title: lab.title,
          kind: "lab",
          bodyMd: [
            `# Lab ${lab.num}: ${lab.title}`,
            "",
            lab.desc,
            "",
            `**Estimated time:** ${lab.duration} · **Level:** ${lab.level}`,
            "",
            "## Skills you'll practice",
            ...lab.skills.map((s) => `- ${s}`),
          ].join("\n"),
          durationMin: parseMinutes(lab.duration),
        },
      ],
    })),
  };

  // ---- 3. 10-Day Bootcamp: one Course, one Chapter, one Lesson per day
  const bootcamp = {
    slug: "10-day-bootcamp",
    title: "10-Day Vibe Coding Bootcamp",
    description:
      "A 10-day guided sprint through the vibe coding curriculum. One focused day at a time — foundations first, shipping by the end.",
    category: "bootcamp",
    level: "All levels",
    isPublished: true,
    isFree: true,
    chapters: [
      {
        position: 1,
        title: "The 10 Days",
        isPublished: true,
        isFreePreview: true,
        lessons: d.bootcamp.map((day) => ({
          position: day.day,
          title: `Day ${day.day}: ${day.focus}`,
          kind: "article",
          bodyMd: [`# Day ${day.day}: ${day.focus}`, "", day.content].join("\n"),
          durationMin: null,
        })),
      },
    ],
  };

  // ---- 4. Videos -> VideoTracks grouped by `track`
  const trackNames = [...new Set(d.videos.map((v) => v.track))];
  const tracks = trackNames.map((trackName) => {
    const vids = d.videos.filter((v) => v.track === trackName);
    return {
      slug: slugify(trackName),
      title: trackName,
      description: `Curated YouTube videos for the "${trackName}" track — hand-picked lessons from top AI builders.`,
      videos: vids.map((v, i) => ({
        position: i + 1,
        youtubeId: v.id,
        title: v.title,
        creator: v.creator || null,
        duration: v.duration || null,
      })),
    };
  });

  // ---- 5. Resources: courses, articles, podcasts, blogs
  const resources = [
    ...d.courses.map((c) => ({
      kind: "course",
      title: c.title,
      url: c.url,
      source: c.provider || null,
      description: c.desc || null,
    })),
    ...d.articles.map((a) => ({
      kind: "article",
      title: a.title,
      url: a.url,
      source: a.type || null,
      description: a.desc || null,
    })),
    ...d.podcasts.map((p) => ({
      kind: "podcast",
      title: p.name,
      url: p.url,
      source: p.by || null,
      description: p.desc || null,
    })),
    ...d.blogs.map((b) => ({
      kind: "blog",
      title: b.name,
      url: b.url,
      source: null,
      description: b.desc || null,
    })),
  ];

  // ---- 6. Tools
  const tools = d.tools.map((t) => ({
    name: t.name,
    url: t.url,
    category: t.tag || "Uncategorized",
    description: t.desc || null,
    pricing: t.pricing || null,
  }));

  return { courses: [masterclass, labs, bootcamp], tracks, resources, tools };
}

/** Count rows the plan would create — used by the DB-free check script. */
export function countPlan(plan) {
  const chapters = plan.courses.flatMap((c) => c.chapters);
  const lessons = chapters.flatMap((c) => c.lessons);
  const trackVideos = plan.tracks.flatMap((t) => t.videos);
  return {
    courses: plan.courses.length,
    chapters: chapters.length,
    lessons: lessons.length,
    videoTracks: plan.tracks.length,
    trackVideos: trackVideos.length,
    resources: plan.resources.length,
    tools: plan.tools.length,
  };
}
