/**
 * /api/company/members
 *  POST — add a member to a company (caller must be a company admin).
 *         Body: { companyId, userId? } or { companyId, email? }.
 *
 * v1 EMAIL LOOKUP: resolving an email to a Supabase user id server-side
 * requires SUPABASE_SERVICE_ROLE_KEY (no public API for it). If the key is
 * missing we return 501 with an honest message instead of guessing.
 * New members are always added with role="member" (v1: no admin promotion).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, getCompanyAdminMembership } from "@/lib/access";
import { memberAddSchema } from "@/lib/teach-schemas";
import {
  findUserIdByEmail,
  hasServiceRoleKey,
} from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const body = await req.json().catch(() => null);
    const parsed = memberAddSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid member data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const { companyId } = parsed.data;

    const admin = await getCompanyAdminMembership(me, companyId);
    if (!admin) {
      return NextResponse.json(
        { error: "Not authorized — company admin required." },
        { status: 403 },
      );
    }

    // Resolve the target user id.
    let userId = parsed.data.userId?.trim() || null;
    let email: string | null = null;
    if (!userId && parsed.data.email) {
      if (!hasServiceRoleKey()) {
        return NextResponse.json(
          {
            error:
              "Email lookup is not configured: SUPABASE_SERVICE_ROLE_KEY is missing. " +
              "Add the member by their Supabase user ID instead, or set the key (see ENV-CHECKLIST.md).",
            code: "SERVICE_KEY_MISSING",
          },
          { status: 501 },
        );
      }
      const found = await findUserIdByEmail(parsed.data.email);
      if (!found) {
        return NextResponse.json(
          {
            error: `No user found with email "${parsed.data.email}". They must sign up for an account first.`,
            code: "USER_NOT_FOUND",
          },
          { status: 404 },
        );
      }
      userId = found.userId;
      email = found.email;
    }
    if (!userId) {
      return NextResponse.json({ error: "Provide an email or a user ID." }, { status: 400 });
    }

    const existing = await db.companyMember.findUnique({
      // Assumes Prisma @@unique([companyId, userId]) per BUILD-PLAN contract.
      where: { companyId_userId: { companyId, userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "That user is already a member of this company." },
        { status: 409 },
      );
    }

    const member = await db.companyMember.create({
      data: { companyId, userId, role: "member" },
    });
    return NextResponse.json({ member: { ...member, email } }, { status: 201 });
  } catch (e) {
    console.error("POST /api/company/members", e);
    return NextResponse.json({ error: "Failed to add member." }, { status: 500 });
  }
}
