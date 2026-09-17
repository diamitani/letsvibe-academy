import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getUser } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";

const publicLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Guides", href: "/guides" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Labs", href: "/labs" },
  { label: "Tracks", href: "/tracks" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Pricing", href: "/pricing" },
];

const authedLinks = [
  { label: "Academy", href: "/academy" },
  { label: "Teach", href: "/teach" },
];

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-navy-50 hover:text-navy-900";

const mobileLinkClass =
  "rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-navy-50 hover:text-navy-900";

export async function SiteNav() {
  const user = await getUser();
  const links = user ? [...publicLinks, ...authedLinks] : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="LVAI home"
          >
            <Image src="/lvai-mark.svg" alt="" width={26} height={30} priority />
            <span className="text-lg font-extrabold tracking-tight text-navy-900">
              LVAI
            </span>
          </Link>

          {/* Desktop links — full sitemap renders one line at xl and up */}
          <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            {user ? (
              <SignOutButton />
            ) : (
              <>
                <Button variant="ghost" size="sm" href="/login">
                  Sign in
                </Button>
                <Button size="sm" href="/signup">
                  Start free
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Condensed nav below xl: wrapped link row, no JS needed */}
        <nav
          aria-label="Primary condensed"
          className="flex flex-wrap items-center gap-1 pb-3 xl:hidden"
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={mobileLinkClass}>
              {l.label}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-2">
            {user ? (
              <SignOutButton />
            ) : (
              <>
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
              </>
            )}
          </span>
        </nav>
      </div>
    </header>
  );
}
