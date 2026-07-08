FROM oven/bun:1.3.6-alpine AS base
WORKDIR /repo

# Copy monorepo manifests first for better layer caching
COPY package.json bun.lock turbo.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/

# Install all workspace dependencies from monorepo root
RUN bun install --frozen-lockfile

# Copy source files
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Build args for NEXT_PUBLIC_* vars — must be present at build time
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# Build Next.js app (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && bun run build

# ---- Runner ----
# Standalone output is fully self-contained — no node_modules copy needed
FROM oven/bun:1.3.6-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

COPY --from=base /repo/apps/web/.next/standalone ./
COPY --from=base /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=base /repo/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["bun", "apps/web/server.js"]
