import { connectDatabase } from "@wareflow/db";
import { env } from "@/config/env";
import { ensureBucket } from "@/infra";
import { buildApp } from "./app";
import { runSeedManager } from "./seeders/seed-manager";
import type { FastifyInstance } from "fastify";

const BUCKET_SETUP_RETRIES = 3;
const BUCKET_SETUP_RETRY_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries ensureBucket a few times before giving up. A freshly started
 * process's very first outbound connection to a sibling local service
 * (MinIO) can transiently fail even when that service is already up and
 * reachable — a short retry absorbs that without requiring a server restart.
 */
async function ensureBucketWithRetry(app: FastifyInstance): Promise<void> {
  for (let attempt = 1; attempt <= BUCKET_SETUP_RETRIES; attempt++) {
    try {
      await ensureBucket();
      app.log.info("Storage bucket ready");
      return;
    } catch (err) {
      if (attempt === BUCKET_SETUP_RETRIES) {
        app.log.error({ err, attempt }, "Storage bucket setup failed — server continues running");
        return;
      }
      app.log.warn({ err, attempt }, "Storage bucket setup failed — retrying");
      await delay(BUCKET_SETUP_RETRY_DELAY_MS);
    }
  }
}

/**
 * Connects to PostgreSQL via @wareflow/db. Invoked after the server is already
 * listening so a slow or unavailable database never prevents the platform
 * healthcheck from passing; failures are logged, not fatal.
 */
async function bootstrapDataLayer(app: FastifyInstance): Promise<void> {
  try {
    await connectDatabase();
    app.log.info("Data layer ready — database connected");

    await ensureBucketWithRetry(app);

    try {
      await runSeedManager(app.log);
    } catch (err) {
      app.log.error({ err }, "Startup seeding failed — server continues running");
    }
  } catch (err) {
    app.log.error(
      { err },
      "Data layer bootstrap failed — server is up but the database is unavailable",
    );
  }
}

async function start() {
  const app = await buildApp();

  await app.listen({ host: env.HOST, port: env.PORT });
  app.log.info(`Server running on http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`);

  void bootstrapDataLayer(app);

  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received — shutting down`);
    await app.close();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", (err) => {
    app.log.fatal({ err }, "Unhandled rejection — exiting");
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    app.log.fatal({ err }, "Uncaught exception — exiting");
    process.exit(1);
  });
}

start();
