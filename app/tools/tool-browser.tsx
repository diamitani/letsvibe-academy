"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface ToolSummary {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string | null;
  pricing: string | null;
}

export function ToolBrowser({
  tools,
  categories,
}: {
  tools: ToolSummary[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (category && t.category !== category) return false;
      if (
        q &&
        !`${t.name} ${t.description ?? ""} ${t.category}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [tools, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Search tools…"
            aria-label="Search tools"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              category === null
                ? "bg-navy-900 text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-900"
            }`}
          >
            All categories
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(category === c ? null : c)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-navy-900 text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:border-navy-400 hover:text-navy-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-lg font-semibold text-navy-900">
            No tools match your search
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
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id} className="flex flex-col p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-navy-900">{t.name}</h3>
                {t.pricing ? (
                  <span className="shrink-0 text-xs font-semibold text-emerald-700">
                    {t.pricing}
                  </span>
                ) : null}
              </div>
              <div className="mt-2">
                <Badge tone="slate">{t.category}</Badge>
              </div>
              {t.description ? (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {t.description}
                </p>
              ) : null}
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-semibold text-navy-700 hover:text-navy-900"
              >
                Visit site ↗
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
