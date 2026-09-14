#!/bin/bash
# Vercel build pipeline: generate client, apply migrations,
# seed content, and build.
set -e
set -x
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run build
