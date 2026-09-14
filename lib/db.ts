import { PrismaClient } from "@prisma/client";

// PrismaClient singleton: reuse one client across hot reloads in dev so we
// don't exhaust the Supabase transaction pooler connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const db: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
