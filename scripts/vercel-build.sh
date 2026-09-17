#!/bin/bash
# Vercel build pipeline: generate client and build.
# Migrations (0001_init, 0002_enums) and production seed data were applied
# 2026-09-15 directly to the LVAI Supabase DB. They are idempotent no-ops
# if re-run, so we attempt them but do not fail the build if the DB is
# unreachable from the build container (runtime connects at request time).
set -e
set -x
npx prisma generate
npx prisma migrate deploy || echo "WARN: migrate deploy failed (DB may be unreachable from build); continuing"
npm run seed || echo "WARN: seed failed (DB may be unreachable from build); continuing"
npm run build
