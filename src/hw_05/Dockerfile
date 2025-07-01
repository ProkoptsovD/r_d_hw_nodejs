# ---------- Builder stage ----------
FROM node:18-alpine AS builder

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm store prune && pnpm prune --prod

# this removes extra 20 MB from image size
RUN find node_modules -type d \( -name "test" -o -name "tests" \) -exec rm -rf {} + && \
    find node_modules -type f \( -name "*.md" -o -name "*.ts" -o -name "*.map" \) -delete

# ---------- Runtime stage ----------
FROM alpine:3.19
RUN apk add --no-cache nodejs tini
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000
ENTRYPOINT ["/sbin/tini","--"]
CMD ["node", "dist/main.js"]
