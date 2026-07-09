import { Client } from "minio";
import { env } from "@/config/env";

/**
 * Singleton MinIO client. This is the only file allowed to import the
 * `minio` package directly — everything else must go through
 * `storage.service.ts`.
 */
export const minioClient: Client = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});
