/**
 * LetsVibeAI — marketplace ingestion from the skill library.
 *
 * Reads ~/workspace/skill-library/<skill>/SKILL.md frontmatter
 * (name, description) and upserts MarketplaceListing rows.
 * Safe to re-run: keyed on slug.
 *
 * Run: npx tsx scripts/seed-marketplace.ts
 * Requires: DATABASE_URL / DIRECT_URL set and `prisma generate` run.
 */
import { PrismaClient } from "@prisma/client";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const LIB = join(process.env.HOME ?? "~", "workspace", "skill-library");

// Directories that are not skills.
const SKIP = new Set([
  "AUDIT.md",
  "DUPLICATES.md",
  "_overwritten-rostr-originals",
  "_tools",
  "node_modules",
  ".git",
]);

function parseFrontmatter(md: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!md.startsWith("---")) return out;
  const end = md.indexOf("---", 3);
  if (end === -1) return out;
  const block = md.slice(3, end);
  for (const line of block.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (m) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      out[m[1]] = v;
    }
  }
  return out;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main() {
  const entries = readdirSync(LIB, { withFileTypes: true }).filter(
    (e) => e.isDirectory() && !SKIP.has(e.name) && !e.name.startsWith(".")
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of entries) {
    const skillMd = join(LIB, entry.name, "SKILL.md");
    if (!existsSync(skillMd)) {
      skipped++;
      continue;
    }
    const raw = readFileSync(skillMd, "utf8");
    const fm = parseFrontmatter(raw);
    const name = fm.name || entry.name;
    const description = (fm.description || "").slice(0, 2000);
    if (!description) {
      skipped++;
      continue;
    }

    const slug = slugify(name);
    // Category: first meaningful path segment heuristic — use the skill dir's
    // prefix before the first hyphen, fallback to "general".
    const category = entry.name.includes("-")
      ? entry.name.split("-")[0]
      : "general";

    const installMd = [
      `## Install this skill`,
      ``,
      `1. Copy the skill folder into your agent's skills directory.`,
      `2. Reference it by name: \`${name}\``,
      ``,
      `### Claude Code`,
      `\`\`\`bash`,
      `# project-local`,
      `cp -r ${entry.name} /path/to/your/project/.claude/skills/`,
      `\`\`\``,
      ``,
      `### Hermes`,
      `\`\`\`bash`,
      `# user-local`,
      `cp -r ${entry.name} ~/.hermes/skills/${entry.name}/`,
      `\`\`\``,
    ].join("\n");

    const existing = await prisma.marketplaceListing.findUnique({ where: { slug } });
    if (existing) {
      await prisma.marketplaceListing.update({
        where: { slug },
        data: { name, description, category, installMd },
      });
      updated++;
    } else {
      await prisma.marketplaceListing.create({
        data: { slug, name, description, category, installMd, featured: false },
      });
      created++;
    }
  }

  console.log(`Marketplace seed complete: ${created} created, ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
