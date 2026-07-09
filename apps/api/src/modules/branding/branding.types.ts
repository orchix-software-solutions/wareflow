/** A single branding asset as exposed to API consumers, or null if not yet uploaded. */
export type BrandingAsset = { url: string; updatedAt: string } | null;

/** Shape returned by both GET and PUT /api/settings/branding. */
export type BrandingResponse = {
  logoLight: BrandingAsset;
  logoDark: BrandingAsset;
  favicon: BrandingAsset;
};

/** The three branding asset keys stored in application_assets.key. */
export type BrandingAssetKey = "logo-light" | "logo-dark" | "favicon";

/** Raw multipart file data handed from the controller to the service, keyed by camelCase field name. */
export type BrandingFileUpload = {
  fieldname: string;
  buffer: Buffer;
  mimetype: string;
};
