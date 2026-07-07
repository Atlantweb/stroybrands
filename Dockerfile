FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build -w apps/api && npm run build -w apps/web

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl && npm install -g pm2 tsx

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/next.config.ts ./apps/web/
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/deploy/PM2-ecosystem.config.js ./deploy/
COPY deploy/docker/entrypoint.sh ./deploy/docker/entrypoint.sh

RUN chmod +x deploy/docker/entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000 4000

ENTRYPOINT ["./deploy/docker/entrypoint.sh"]
