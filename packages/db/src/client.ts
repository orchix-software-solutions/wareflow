import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return url;
}

export const queryClient = postgres(process.env.DATABASE_URL ?? "", {
  max: 10,
  onnotice: () => {},
});

export const db = drizzle(queryClient, { schema });

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

export async function connectDatabase(): Promise<void> {
  getDatabaseUrl();
  const connected = await checkDatabaseConnection();
  if (!connected) {
    throw new Error("Failed to establish database connection");
  }
  console.log("Database connection established");
}

export async function disconnectDatabase(): Promise<void> {
  await queryClient.end();
  console.log("Database connection closed");
}
