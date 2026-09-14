import Link from "next/link";

const columns = [
  {
    heading: "Learn",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Tracks", href: "/tracks" },
      { label: "Library", href: "/library" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Teach", href: "/teach" },
      { label: "Company", href: "/company" },
      { label: "Certificates", href: "/academy" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Tools", href: "/tools" },
      { label: "Newsletter", href: "/#newsletter" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-navy-900">
              LetsVibeAI
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              The academy for building with AI: guided courses, curated video
              tracks, hands-on labs, a deep library, and the best AI tools — all
              in one place.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="text-sm font-semibold text-navy-900">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-600 transition-colors hover:text-navy-900"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            © 2026 LetsVibeAI Academy
          </p>
        </div>
      </div>
    </footer>
  );
}
