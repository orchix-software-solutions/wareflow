import { env } from "./env";

export const corsOptions = {
  origin: env.ALLOWED_ORIGINS.split(","),
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Correlation-Id", "Idempotency-Key"],
  credentials: true,
  maxAge: 86400,
};
