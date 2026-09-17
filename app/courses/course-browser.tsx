"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lessonCount: number;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-navy-900 text-white"
          : "border border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-900"
      }`}
    >
      {children}
    </button>
  );
}

export function CourseBrowser({
  courses,
  categories,
  levels,
  searchPlaceholder = "Search courses…",
}: {
  courses: CourseSummary[];
  categories: string[];
  levels: string[];
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (category && c.category !== category) return false;
      if (level && c.level !== level) return false;
      if (q && !`${c.title} ${c.description}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [courses, query, category, level]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="max-w-md">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder.replace(/…$/, "")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={category === null} onClick={() => setCategory(null)}>
            All categories
          </Chip>
          {categories.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={level === null} onClick={() => setLevel(null)}>
            All levels
          </Chip>
          {levels.map((l) => (
            <Chip
              key={l}
              active={level === l}
              onClick={() => setLevel(level === l ? null : l)}
            >
              {l}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-lg font-semibold text-navy-900">
            No courses match your search
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Try a different keyword or clear the filters.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setCategory(null);
                setLevel(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/courses/${c.slug}`}>
              <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Badge tone="navy">{c.level}</Badge>
                  <span className="text-xs font-medium text-slate-500">
                    {c.category}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-navy-900">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {c.description}
                </p>
                <p className="mt-4 text-xs font-medium text-slate-500">
                  {c.lessonCount} lesson{c.lessonCount === 1 ? "" : "s"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
