/**
 * /api/company/seats
 *  POST — assign a seat: { companyId, userId, courseId } (caller must be a
 *         company admin). Creates a SeatAssignment AND auto-creates the
 *         learner's Enrollment (idempotent) so the member can start learning
 *         immediately. v1: seats are manual — no Stripe, no seat limits.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser, getCompanyAdminMembership } from "@/lib/access";
import { seatAssignSchema } from "@/lib/teach-schemas";

export async function POST(req: NextRequest) {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const body = await req.json().catch(() => null);
    const parsed = seatAssignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid seat data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const { companyId, userId, courseId } = parsed.data;

    const admin = await getCompanyAdminMembership(me, companyId);
    if (!admin) {
      return NextResponse.json(
        { error: "Not authorized — company admin required." },
        { status: 403 },
      );
    }

    const member = await db.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } },
    });
    if (!member) {
      return NextResponse.json(
        { error: "That user is not a member of this company — add them first." },
        { status: 404 },
      );
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });
    if (!course)
      return NextResponse.json({ error: "Course not found." }, { status: 404 });

    const existingSeat = await db.seatAssignment.findUnique({
      // Assumes Prisma @@unique([courseId, userId]) per BUILD-PLAN contract.
      where: { courseId_userId: { courseId, userId } },
    });
    if (existingSeat) {
      return NextResponse.json(
        { error: "That member already has a seat in this course." },
        { status: 409 },
      );
    }

    const result = await db.$transaction(async (tx) => {
      const seat = await tx.seatAssignment.create({
        data: { companyId, courseId, userId },
      });
      // Auto-enroll the member (idempotent via the unique(userId, courseId)).
      const enrollment = await tx.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId },
        update: {},
      });
      return { seat, enrollment };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error("POST /api/company/seats", e);
    return NextResponse.json({ error: "Failed to assign seat." }, { status: 500 });
  }
}
