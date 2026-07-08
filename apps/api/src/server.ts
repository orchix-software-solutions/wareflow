import { connectDatabase } from "@wareflow/db";
import { env } from "@/config/env";
import { buildApp } from "./app";
import { runSeedManager } from "./seeders/seed-manager";
import type { FastifyInstance } from "fastify";

/**
 * Connects to PostgreSQL via @wareflow/db. Invoked after the server is already
 * listening so a slow or unavailable database never prevents the platform
 * healthcheck from passing; failures are logged, not fatal.
 */
async function bootstrapDataLayer(app: FastifyInstance): Promise<void> {
  try {
    await connectDatabase();
    app.log.info("Data layer ready — database connected");

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
