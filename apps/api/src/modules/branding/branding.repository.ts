import { eq } from "drizzle-orm";
import {
  applicationAssets,
  db,
  type ApplicationAsset,
  type NewApplicationAsset,
} from "@wareflow/db";

/** Returns every application_assets row currently stored (0-3 rows). */
export async function findAllAssets(): Promise<ApplicationAsset[]> {
  return db.select().from(applicationAssets);
}

/** Returns the application_assets row for a given key, or undefined if not yet uploaded. */
export async function findAssetByKey(key: string): Promise<ApplicationAsset | undefined> {
  return db.query.applicationAssets.findFirst({
    where: eq(applicationAssets.key, key),
  });
}

/** Inserts or updates the application_assets row for `data.key`, bumping updatedAt. */
export async function upsertAsset(
  data: NewApplicationAsset,
): Promise<ApplicationAsset | undefined> {
  const [asset] = await db
    .insert(applicationAssets)
    .values(data)
    .onConflictDoUpdate({
      target: applicationAssets.key,
      set: {
        objectKey: data.objectKey,
        bucket: data.bucket,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
        url: data.url,
        updatedAt: new Date(),
      },
    })
    .returning();

  return asset;
}
