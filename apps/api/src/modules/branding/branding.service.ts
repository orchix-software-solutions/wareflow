import type { ApplicationAsset } from "@wareflow/db";
import { BadRequestError, InternalError, UnprocessableError } from "@/core";
import { deleteFile, uploadFile } from "@/infra";
import { findAllAssets, findAssetByKey, upsertAsset } from "./branding.repository";
import { allowedBrandingMimeTypeSchema } from "./branding.validator";
import type { BrandingAssetKey, BrandingFileUpload, BrandingResponse } from "./branding.types";

const MIME_TYPE_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

/** Maps the camelCase multipart field name to the DB `key` column value. */
const FIELD_TO_ASSET_KEY: Record<string, BrandingAssetKey> = {
  logoLight: "logo-light",
  logoDark: "logo-dark",
  favicon: "favicon",
};

function assertAllowedMimeType(mimetype: string): void {
  const result = allowedBrandingMimeTypeSchema.safeParse(mimetype);
  if (!result.success) {
    throw new UnprocessableError(`Unsupported file type: ${mimetype}`);
  }
}

function extensionForMimeType(mimetype: string): string {
  return MIME_TYPE_EXTENSIONS[mimetype] ?? "";
}

function toBrandingAsset(asset: ApplicationAsset | undefined): BrandingResponse["logoLight"] {
  if (!asset) {
    return null;
  }
  return { url: asset.url, updatedAt: asset.updatedAt.toISOString() };
}

function toBrandingResponse(assets: ApplicationAsset[]): BrandingResponse {
  const byKey = new Map(assets.map((asset) => [asset.key, asset]));
  return {
    logoLight: toBrandingAsset(byKey.get("logo-light")),
    logoDark: toBrandingAsset(byKey.get("logo-dark")),
    favicon: toBrandingAsset(byKey.get("favicon")),
  };
}

/** Returns the current state of all branding assets (null for keys not yet uploaded). */
export async function getBranding(): Promise<BrandingResponse> {
  const assets = await findAllAssets();
  return toBrandingResponse(assets);
}

/** Uploads and persists one branding asset, cleaning up the previous object if it existed. */
async function replaceAsset(key: BrandingAssetKey, upload: BrandingFileUpload): Promise<void> {
  assertAllowedMimeType(upload.mimetype);

  const existing = await findAssetByKey(key);
  const objectKey = `branding/${key}-${Date.now()}${extensionForMimeType(upload.mimetype)}`;

  const uploaded = await uploadFile({
    buffer: upload.buffer,
    objectKey,
    mimeType: upload.mimetype,
  });

  const saved = await upsertAsset({
    key,
    objectKey: uploaded.objectKey,
    bucket: uploaded.bucket,
    mimeType: upload.mimetype,
    fileSize: upload.buffer.length,
    url: uploaded.url,
  });

  if (!saved) {
    throw new InternalError(`Failed to save branding asset for key "${key}"`);
  }

  if (existing) {
    await deleteFile(existing.objectKey);
  }
}

/** Updates whichever branding assets were provided (0-3 files) and returns the full current state. */
export async function updateBranding(uploads: BrandingFileUpload[]): Promise<BrandingResponse> {
  if (uploads.length === 0) {
    throw new BadRequestError("At least one file must be provided");
  }

  for (const upload of uploads) {
    const key = FIELD_TO_ASSET_KEY[upload.fieldname];
    if (!key) {
      throw new BadRequestError(`Unknown branding field "${upload.fieldname}"`);
    }
    await replaceAsset(key, upload);
  }

  const assets = await findAllAssets();
  return toBrandingResponse(assets);
}
