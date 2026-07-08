import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const migrationClient = postgres(url, { max: 1 });
  const database = drizzle(migrationClient);

  try {
    await migrate(database, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully");
  } finally {
    await migrationClient.end();
  }
}

runMigrations().catch((error) => {
  console.error("Migration failed", error);
  process.exit(1);
});
