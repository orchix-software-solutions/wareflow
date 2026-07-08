import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { env } from "@/config/env";
import {
  requestContextPlugin,
  helmetPlugin,
  corsPlugin,
  compressionPlugin,
  rateLimitPlugin,
  swaggerPlugin,
  errorHandlerPlugin,
} from "@/plugins";
import { healthRoute } from "@/routes/health.route";

export async function buildApp() {
  const isDev = env.NODE_ENV === "development";

  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      redact: ["req.headers.authorization", "password", "token", "secret", "*.password", "*.token"],
      ...(isDev
        ? {
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:HH:MM:ss",
                ignore: "pid,hostname",
              },
            },
          }
        : {}),
    },
  });

  await app.register(requestContextPlugin);
  await app.register(helmetPlugin);
  await app.register(corsPlugin);
  await app.register(cookie);
  await app.register(compressionPlugin);
  await app.register(rateLimitPlugin);
  await app.register(swaggerPlugin);
  await app.register(errorHandlerPlugin);

  await app.register(healthRoute);

  return app;
}
