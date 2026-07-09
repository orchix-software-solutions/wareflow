import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { uploadFile } from "@/infra";
import { upsertAsset } from "@/modules/branding/branding.repository";

interface SeedLogger {
  info: (obj: unknown, msg?: string) => void;
  warn: (obj: unknown, msg?: string) => void;
}

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const BRANDING_DIR = path.resolve(CURRENT_DIR, "../../../../apps/web/public/branding");

const BRANDING_ASSETS = [
  { key: "logo-light", file: "logo-light.png" },
  { key: "logo-dark", file: "logo-dark.png" },
  { key: "favicon", file: "favicon.png" },
] as const;

const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
};

function resolveMimeType(file: string): string {
  const extension = path.extname(file).toLowerCase();
  return MIME_TYPES_BY_EXTENSION[extension] ?? "application/octet-stream";
}

/**
 * Uploads the default branding assets (logos + favicon) to storage and
 * records them in application_assets. Skips gracefully — logging a warning
 * instead of throwing — for any asset that is missing on disk or fails to
 * upload, so a missing branding directory or unreachable storage never
 * crashes startup.
 *
 * Returns true only if every asset was seeded successfully — the caller
 * must not mark this seed step as complete on a partial/total failure,
 * or a transient storage outage (e.g. MinIO not running yet) would
 * permanently skip branding seeding on every future startup.
 */
export async function seedBranding(log: SeedLogger): Promise<boolean> {
  if (!existsSync(BRANDING_DIR)) {
    log.warn({ dir: BRANDING_DIR }, "Branding assets directory not found — skipping branding seed");
    return false;
  }

  let allSucceeded = true;

  for (const asset of BRANDING_ASSETS) {
    const filePath = path.join(BRANDING_DIR, asset.file);

    try {
      const buffer = await readFile(filePath);
      const mimeType = resolveMimeType(asset.file);
      const objectKey = `branding/${asset.key}-${Date.now()}${path.extname(asset.file)}`;

      const uploaded = await uploadFile({ buffer, objectKey, mimeType });

      await upsertAsset({
        key: asset.key,
        objectKey: uploaded.objectKey,
        bucket: uploaded.bucket,
        mimeType,
        fileSize: buffer.length,
        url: uploaded.url,
      });

      log.info({ key: asset.key }, "Seeded branding asset");
    } catch (err) {
      allSucceeded = false;
      log.warn({ err, key: asset.key, filePath }, "Failed to seed branding asset — skipping");
    }
  }

  return allSucceeded;
}
