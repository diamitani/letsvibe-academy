import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const certificate = await db.certificate.findUnique({
    where: { code },
    include: { course: { select: { title: true, slug: true, category: true } } },
  });
  if (!certificate) notFound();

  const shortId = certificate.userId.slice(0, 8).toUpperCase();
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        {/* Verification badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-8 w-8 text-emerald-600"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-emerald-700">
          Verified
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Certificate of Completion
        </h1>
        <p className="mt-2 text-slate-600">
          This certificate was issued to learner{" "}
          <span className="font-mono font-semibold text-slate-900">{shortId}</span>{" "}
          for completing
        </p>
        <p className="mt-2 text-lg font-bold text-[#0B2545]">
          {certificate.course.title}
        </p>

        <dl className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-6 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Certificate code</dt>
            <dd className="font-mono font-semibold text-slate-900">
              {certificate.code}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Issued</dt>
            <dd className="font-semibold text-slate-900">{issuedDate}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Issued by</dt>
            <dd className="font-semibold text-slate-900">LetsVibeAI Academy</dd>
          </div>
        </dl>

        <Link
          href={`/courses/${certificate.course.slug}`}
          className="mt-8 inline-block rounded-xl bg-[#0B2545] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12325E]"
        >
          View course
        </Link>
      </div>
    </div>
  );
}
