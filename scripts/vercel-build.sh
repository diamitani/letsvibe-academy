#!/bin/bash
# Vercel build pipeline: heal any failed migration marker, then
# generate client, apply migrations, seed content, and build.
set -e
set -x
npx prisma migrate resolve --rolled-back 0002_enums || true
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run build
