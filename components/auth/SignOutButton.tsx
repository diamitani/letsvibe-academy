"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * SignOutButton — hard contract for SiteNav integration.
 * Default export `SignOutButton`. POSTs to /api/auth/signout,
 * then router.push("/") + router.refresh().
 */
export default function SignOutButton({
  className = "",
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {
      // Network failure: still navigate home; the middleware will treat
      // the session as unauthenticated on the next refresh anyway.
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleSignOut}
      disabled={pending}
    >
      {pending ? "Signing out…" : label}
    </Button>
  );
}
