import { z } from "zod";

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

  ALLOW_DEMO_OTP: z.coerce.boolean().default(false),
  DEMO_OTP: z.string().default("123456"),

  OWNER_NAME: z.string(),
  OWNER_USERNAME: z.string(),
  OWNER_EMAIL: z.string().email(),
  OWNER_PASSWORD: z.string().min(8),
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
