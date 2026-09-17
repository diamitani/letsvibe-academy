"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface ListingSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  featured: boolean;
}

export function MarketplaceBrowser({
  listings,
  categories,
}: {
  listings: ListingSummary[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((l) => {
      if (category && l.category !== category) return false;
      if (
        q &&
        !`${l.name} ${l.description} ${l.category}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [listings, query, category]);

  const featured = useMemo(
    () => listings.filter((l) => l.featured).slice(0, 3),
    [listings]
  );

  return (
    <div>
      {featured.length > 0 && !query && !category ? (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-navy-900">Staff picks</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
              <Link key={l.id} href={`/marketplace/${l.slug}`}>
                <Card className="flex h-full flex-col border-navy-200 p-6 transition-shadow hover:shadow-md">
                  <Badge tone="navy">Featured</Badge>
                  <h3 className="mt-3 text-lg font-bold text-navy-900">{l.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {l.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Search skills…"
            aria-label="Search skills"
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
            No skills match your search
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
          {filtered.map((l) => (
            <Link key={l.id} href={`/marketplace/${l.slug}`}>
              <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <Badge tone="slate">{l.category}</Badge>
                  {l.featured ? <Badge tone="navy">Featured</Badge> : null}
                </div>
                <h3 className="mt-3 text-lg font-bold text-navy-900">{l.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {l.description}
                </p>
                <span className="mt-4 text-sm font-semibold text-navy-700">
                  View install guide →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
