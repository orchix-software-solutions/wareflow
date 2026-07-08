FROM oven/bun:1.3.6-debian AS base
WORKDIR /repo

# Copy monorepo manifests first for better layer caching
COPY package.json bun.lock turbo.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY apps/api/package.json ./apps/api/

# Install all workspace dependencies from monorepo root
RUN bun install --frozen-lockfile

# Copy source files
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build
RUN cd apps/api && bun run build

# ---- Runner ----
FROM oven/bun:1.3.6-debian AS runner
WORKDIR /app

ENV NODE_ENV=production

# Preserve the monorepo layout so bun's workspace symlinks resolve at runtime.
COPY --from=base /repo/package.json ./package.json
COPY --from=base /repo/node_modules ./node_modules
COPY --from=base /repo/packages ./packages
COPY --from=base /repo/apps/api/package.json ./apps/api/package.json
COPY --from=base /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=base /repo/apps/api/dist ./apps/api/dist

EXPOSE 3001

CMD ["bun", "apps/api/dist/server.js"]
