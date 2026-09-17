import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Destroys the Supabase session via the app's existing auth mechanism
// (@supabase/ssr cookie session, same client as lib/supabase/server.ts).
// The server client's signOut() clears the session cookies through setAll().
export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Sign-out failed. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
