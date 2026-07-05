#!/bin/sh
set -e

echo "=== StroyBrands Docker Entrypoint ==="

# Switch to MySQL schema if it exists
if [ -f prisma/schema.mysql.prisma ] && [ ! -f prisma/schema.mysql.used ]; then
  echo "Switching to MySQL schema..."
  cp prisma/schema.prisma prisma/schema.sqlite.prisma.bak
  cp prisma/schema.mysql.prisma prisma/schema.prisma
  touch prisma/schema.mysql.used
fi

# Generate Prisma client
npx prisma generate

# Push schema to database
echo "Running database migrations..."
npx prisma db push --accept-data-loss

# Seed admin user if not exists
echo "Seeding database..."
npx tsx prisma/seed.ts 2>/dev/null || echo "Seed already applied or failed (non-critical)"

echo "=== Starting application ==="
pm2-runtime deploy/PM2-ecosystem.config.js
