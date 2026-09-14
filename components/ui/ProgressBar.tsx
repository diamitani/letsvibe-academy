"use client";

import * as Progress from "@radix-ui/react-progress";

export function ProgressBar({
  value,
  className = "",
}: {
  /** Progress from 0 to 100. */
  value: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <Progress.Root
      value={clamped}
      aria-label="Progress"
      className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}
    >
      <Progress.Indicator
        className="h-full w-full rounded-full bg-navy-900 transition-transform duration-300"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </Progress.Root>
  );
}
