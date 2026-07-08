import { eq } from "drizzle-orm";
import { db, seedTrackers } from "@wareflow/db";

export async function isModuleSeeded(moduleName: string): Promise<boolean> {
  const tracker = await db.query.seedTrackers.findFirst({
    where: eq(seedTrackers.module, moduleName),
  });
  return tracker?.isSeeded ?? false;
}

export async function markModuleSeeded(moduleName: string): Promise<void> {
  const seededAt = new Date();
  await db
    .insert(seedTrackers)
    .values({ module: moduleName, isSeeded: true, seededAt })
    .onConflictDoUpdate({
      target: seedTrackers.module,
      set: { isSeeded: true, seededAt },
    });
}
