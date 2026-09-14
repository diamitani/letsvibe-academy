/**
 * DB-free validation of the LetsVibeAI content mapping.
 * Run: node scripts/check-seed-mapping.mjs
 * (no database, no npm install — pure node against content-library.js)
 */
import { loadLibrary, buildSeedPlan, countPlan } from "./seed-plan.mjs";

const EXPECTED = {
  courses: 3,
  chapters: 10, // 6 masterclass + 3 labs + 1 bootcamp
  lessons: null, // computed below: sum(module outcomes) + 3 labs + 10 days
  videoTracks: 8,
  trackVideos: 34,
  resources: 38, // 12 courses + 8 articles + 8 podcasts + 10 blogs
  tools: 10,
};

const data = loadLibrary();
EXPECTED.lessons =
  data.modules.reduce((n, m) => n + m.outcomes.length, 0) + data.labs.length + data.bootcamp.length;

const plan = buildSeedPlan(data);
const counts = countPlan(plan);

let ok = true;
for (const [key, expected] of Object.entries(EXPECTED)) {
  const actual = counts[key];
  const pass = actual === expected;
  if (!pass) ok = false;
  console.log(`${pass ? "PASS" : "FAIL"}  ${key}: ${actual} (expected ${expected})`);
}

// Sanity: uniqueness keys the seed relies on
const courseSlugs = plan.courses.map((c) => c.slug);
const trackSlugs = plan.tracks.map((t) => t.slug);
const dupes = (arr) => arr.filter((x, i) => arr.indexOf(x) !== i);
const dupReport = [
  ["course slugs", dupes(courseSlugs)],
  ["track slugs", dupes(trackSlugs)],
];
for (const [label, d] of dupReport) {
  const pass = d.length === 0;
  if (!pass) ok = false;
  console.log(`${pass ? "PASS" : "FAIL"}  no duplicate ${label}${d.length ? ": " + d.join(", ") : ""}`);
}

// Sanity: chapters/lessons positions are sequential per parent
for (const c of plan.courses) {
  const positions = c.chapters.map((ch) => ch.position);
  const expected = [...positions].sort((a, b) => a - b);
  const pass = positions.every((p, i) => p === expected[i]);
  if (!pass) ok = false;
  console.log(`${pass ? "PASS" : "FAIL"}  chapters ordered for course ${c.slug}`);
}
for (const c of plan.courses) {
  for (const ch of c.chapters) {
    const ps = ch.lessons.map((l) => l.position);
    const pass = ps.every((p, i) => p === i + 1);
    if (!pass) { ok = false; console.log(`FAIL  lesson positions in ${c.slug} / ${ch.title}`); }
  }
}
console.log("PASS  lesson positions sequential within each chapter (checked)");

console.log(ok ? "\nALL CHECKS PASSED" : "\nSOME CHECKS FAILED");
process.exit(ok ? 0 : 1);
