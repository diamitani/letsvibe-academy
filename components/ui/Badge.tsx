import * as React from "react";

type BadgeTone = "navy" | "sky" | "slate" | "green" | "amber" | "purple";

const toneStyles: Record<BadgeTone, string> = {
  navy: "bg-navy-50 text-navy-800 ring-navy-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
};

export function Badge({
  tone = "slate",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
