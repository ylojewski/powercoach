FROM node:20-slim AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY /deploy/api/dist ./dist
COPY /deploy/api/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/index.js"]
