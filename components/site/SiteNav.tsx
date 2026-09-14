import Link from "next/link";
import { Button } from "@/components/ui/Button";

const links = [
  { label: "Courses", href: "/courses" },
  { label: "Tracks", href: "/tracks" },
  { label: "Library", href: "/library" },
  { label: "Tools", href: "/tools" },
  { label: "Teach", href: "/teach" },
  { label: "Company", href: "/company" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-navy-900"
          >
            LetsVibeAI
          </Link>

          {/* Desktop links */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" href="/login">
              Sign in
            </Button>
            <Button size="sm" href="/signup">
              Start free
            </Button>
          </div>
        </div>

        {/* Mobile: stacked row (no JS needed) */}
        <nav
          aria-label="Primary mobile"
          className="flex flex-wrap items-center gap-1 pb-3 md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-navy-50 hover:text-navy-900"
            >
              {l.label}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-navy-900 hover:bg-navy-50"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-navy-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Start free
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
}
