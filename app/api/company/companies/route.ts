/**
 * /api/company/companies
 *  GET  — companies where I am an admin (CompanyMember role="admin")
 *  POST — create a company and make the caller its admin
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // sibling-owned Prisma client
import { requireApiUser } from "@/lib/access";
import { companyCreateSchema } from "@/lib/teach-schemas";

export async function GET() {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const memberships = await db.companyMember.findMany({
      where: { userId: me.id, role: "admin" },
      include: {
        company: {
          include: { _count: { select: { members: true } } },
        },
      },
      orderBy: { company: { name: "asc" } },
    });

    return NextResponse.json({
      companies: memberships.map((m) => ({
        id: m.company.id,
        name: m.company.name,
        slug: m.company.slug,
        createdAt: m.company.createdAt,
        memberCount: m.company._count.members,
      })),
    });
  } catch (e) {
    console.error("GET /api/company/companies", e);
    return NextResponse.json({ error: "Failed to list companies." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const meOr = await requireApiUser();
    if (meOr instanceof NextResponse) return meOr;
    const me = meOr;

    const body = await req.json().catch(() => null);
    const parsed = companyCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid company data.", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const taken = await db.company.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (taken) {
      return NextResponse.json(
        { error: `Slug "${parsed.data.slug}" is already taken.` },
        { status: 409 },
      );
    }

    const company = await db.$transaction(async (tx) => {
      const created = await tx.company.create({ data: parsed.data });
      await tx.companyMember.create({
        data: { companyId: created.id, userId: me.id, role: "admin" },
      });
      return created;
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (e) {
    console.error("POST /api/company/companies", e);
    return NextResponse.json({ error: "Failed to create company." }, { status: 500 });
  }
}
