import { pino, type Logger } from "pino";
import { env } from "@/config/env";

function createLogger(): Logger {
  const isDev = env.NODE_ENV === "development";

  return pino({
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
  });
}

export const logger: Logger = createLogger();
