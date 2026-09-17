"use client";

import { useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard unavailable (permissions, non-secure context) — still
      // show feedback; the URL is in the address bar.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-400 hover:bg-navy-50"
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
