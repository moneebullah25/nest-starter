FROM node:22-alpine AS build

# System deps for Prisma engines on Alpine
RUN apk add --no-cache libc6-compat openssl

# Use corepack to manage pnpm reliably
RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Install dependencies with good caching
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm build

# Prune production dependencies in a separate stage
FROM build AS builder
RUN pnpm prune --prod

# Runtime image
FROM node:22-alpine

# System deps for Prisma engines on Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app
ENV NODE_ENV=production

# Drop root privileges
USER node

# Copy only what runtime needs
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/', r => process.exit(r.statusCode===200?0:1)).on('error', () => process.exit(1))"

CMD ["node", "dist/src/main.js"]
