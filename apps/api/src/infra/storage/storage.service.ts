import { env } from "@/config/env";
import { logger } from "@/core";
import { minioClient } from "./minio-client";

type UploadFileParams = {
  buffer: Buffer;
  objectKey: string;
  mimeType: string;
};

type UploadFileResult = {
  objectKey: string;
  bucket: string;
  url: string;
};

function buildPublicReadPolicy(bucket: string): string {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });
}

/**
 * Ensures the configured bucket exists and is readable via direct public URL.
 * Safe to call on every startup — it is a no-op if the bucket already exists.
 */
export async function ensureBucket(): Promise<void> {
  const bucket = env.MINIO_BUCKET;
  const exists = await minioClient.bucketExists(bucket).catch(() => false);

  if (!exists) {
    await minioClient.makeBucket(bucket);
  }

  await minioClient.setBucketPolicy(bucket, buildPublicReadPolicy(bucket));
}

/** Uploads a file buffer to the configured bucket and returns its public URL. */
export async function uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
  const { buffer, objectKey, mimeType } = params;
  const bucket = env.MINIO_BUCKET;

  await minioClient.putObject(bucket, objectKey, buffer, buffer.length, {
    "Content-Type": mimeType,
  });

  return {
    objectKey,
    bucket,
    url: getPublicUrl(objectKey),
  };
}

/**
 * Deletes an object from the configured bucket. Best-effort — deletion
 * failures (including "object not found") are logged, never thrown.
 */
export async function deleteFile(objectKey: string): Promise<void> {
  try {
    await minioClient.removeObject(env.MINIO_BUCKET, objectKey);
  } catch (err) {
    logger.warn({ err, objectKey }, "Failed to delete object from storage — ignoring");
  }
}

/** Builds the public URL for an object key without making any network call. */
export function getPublicUrl(objectKey: string): string {
  return `${env.MINIO_PUBLIC_URL}/${env.MINIO_BUCKET}/${objectKey}`;
}
