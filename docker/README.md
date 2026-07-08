# Docker

Local infrastructure and container builds for WareFlow.

## Services

| Service    | Image               | Port | Notes            |
| ---------- | ------------------- | ---- | ---------------- |
| `postgres` | postgres:16-alpine  | 5432 | Primary database |
| `redis`    | redis:7-alpine      | 6379 | Cache / queues   |
| `api`      | apps/api/Dockerfile | 3001 | Backend API      |
| `web`      | apps/web/Dockerfile | 3000 | Next.js frontend |

Configuration is driven by environment variables (see root `.env.example`), with
sensible defaults (`wareflow` / `wareflow` / `wareflow`).

## Commands

```bash
# Start everything in the background
docker compose up -d

# Start only infrastructure (Postgres + Redis) for local dev
docker compose up -d postgres redis

# View logs
docker compose logs -f api

# Stop containers
docker compose down

# Stop and remove volumes (destroys data)
docker compose down -v
```

## Database initialization

`docker/postgres/init.sql` runs on first container start (empty volume). It
enables the `uuid-ossp` and `pgcrypto` extensions. Schema changes are managed by
Drizzle migrations in `packages/db` (`bun run db:migrate`), not this file.

## Persistence

Data is stored in named volumes `postgres_data` and `redis_data`. Removing them
(`docker compose down -v`) resets all data.
