import { z } from "zod";

/**
 * Parses a boolean from an environment string. `z.coerce.boolean()` cannot be
 * used here: it delegates to `Boolean(value)`, so any non-empty string —
 * including the literal `"false"` — coerces to `true`.
 */
const booleanFromEnv = (defaultValue: boolean) =>
  z
    .enum(["true", "false", "1", "0"])
    .default(defaultValue ? "true" : "false")
    .transform((value) => value === "true" || value === "1");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().default(3001),

  DATABASE_URL: z.string().startsWith("postgres"),
  REDIS_URL: z.string().default("redis://localhost:6379"),

  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("1d"),

  ALLOW_DEMO_OTP: booleanFromEnv(false),
  DEMO_OTP: z.string().default("123456"),

  OWNER_NAME: z.string(),
  OWNER_USERNAME: z.string(),
  OWNER_EMAIL: z.string().email(),
  OWNER_PASSWORD: z.string().min(8),

  MINIO_ENDPOINT: z.string().default("localhost"),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().default("wareflow"),
  MINIO_SECRET_KEY: z.string().default("wareflow123"),
  MINIO_USE_SSL: booleanFromEnv(false),
  MINIO_BUCKET: z.string().default("wareflow-assets"),
  MINIO_PUBLIC_URL: z.string().default("http://localhost:9000"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

export const env: Env = validateEnv();
