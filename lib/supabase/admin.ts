/**
 * Service-role Supabase client (SERVER-ONLY).
 *
 * Used ONLY for the v1 email → Supabase user-id lookup on the company admin
 * "add member" flow. There is no public server-side API to resolve an email to a
 * Supabase auth user without the service-role key, so this is the sanctioned path.
 *
 * SECURITY: never import this module from client components, never send the key
 * to the browser, never log it. All functions here degrade gracefully to null
 * when SUPABASE_SERVICE_ROLE_KEY is missing — callers must show an honest message.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function hasServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cached;
}

/**
 * Resolve a Supabase user id by email via the admin API.
 * Paginates a bounded number of pages (v1: up to 2,000 users) — fine for an
 * admin-only, low-volume lookup. Returns null when the key is missing or no match.
 */
export async function findUserIdByEmail(
  email: string,
): Promise<{ userId: string; email: string } | null> {
  const admin = getAdminClient();
  if (!admin) return null;
  const target = email.trim().toLowerCase();
  const perPage = 100;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data) break;
    const match = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === target,
    );
    if (match) return { userId: match.id, email: match.email ?? email };
    if (data.users.length < perPage) break;
  }
  return null;
}

/**
 * Best-effort batch email resolution for display purposes (member list).
 * Missing key or unknown users → null entries; callers render the raw user id
 * with an explanatory note instead of failing.
 */
export async function resolveUserEmails(
  userIds: string[],
): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>(
    userIds.map((id) => [id, null] as [string, string | null]),
  );
  const admin = getAdminClient();
  if (!admin || userIds.length === 0) return map;
  const remaining = new Set(userIds);
  const perPage = 100;
  for (let page = 1; page <= 20 && remaining.size > 0; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data) break;
    for (const u of data.users) {
      if (remaining.has(u.id)) {
        map.set(u.id, u.email ?? null);
        remaining.delete(u.id);
      }
    }
    if (data.users.length < perPage) break;
  }
  return map;
}
