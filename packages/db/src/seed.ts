import { db, queryClient } from "./client";
import { examples } from "./schema";

async function seed(): Promise<void> {
  const existing = await db.select().from(examples).limit(1);

  if (existing.length > 0) {
    console.log("Seed skipped: examples already present");
    return;
  }

  const [inserted] = await db
    .insert(examples)
    .values({
      name: "Example",
      description: "Seeded example row",
    })
    .returning();

  console.log("Seeded example row", inserted?.id);
}

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await queryClient.end();
  });
