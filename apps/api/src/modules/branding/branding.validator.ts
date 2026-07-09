import { z } from "zod";

/**
 * PUT /api/settings/branding is multipart/form-data with 0-3 optional file
 * parts (logoLight/logoDark/favicon) and no other fields — there is no JSON
 * body shape for `validateRequest`/Zod to parse here, so this module only
 * exposes the mimetype allowlist used by the service to reject bad uploads.
 */
export const allowedBrandingMimeTypeSchema = z.enum([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

export type AllowedBrandingMimeType = z.infer<typeof allowedBrandingMimeTypeSchema>;
