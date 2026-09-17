import Link from "next/link";

/**
 * CtaBand — one consistent "Start free" CTA band, reused on the guide
 * and course index pages (and anywhere else a funnel CTA belongs).
 */
export function CtaBand({
  title = "Start learning free",
  description = "Create an account in seconds and enroll in any course with one click — no credit card required.",
  ctaLabel = "Start free",
  ctaHref = "/signup",
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="mt-16 overflow-hidden rounded-2xl bg-navy-900 px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-100">{description}</p>
        </div>
        <Link
          href={ctaHref}
          className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-navy-50"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
