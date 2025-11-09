FROM node:20-slim AS builder

ENV CI=true

RUN corepack enable

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @powercoach/api build
RUN pnpm deploy --legacy --filter @powercoach/api --prod --ignore-scripts /api-deploy

FROM node:20-slim AS runner
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /api-deploy/dist ./dist
COPY --from=builder /api-deploy/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/index.js"]
