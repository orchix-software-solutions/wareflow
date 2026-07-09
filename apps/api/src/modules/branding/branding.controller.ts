import type { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponse, HTTP_STATUS } from "@/core";
import * as brandingService from "./branding.service";
import type { BrandingFileUpload } from "./branding.types";

export async function getBrandingController(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const result = await brandingService.getBranding();

  reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(result));
}

export async function updateBrandingController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const uploads: BrandingFileUpload[] = [];

  for await (const part of request.parts()) {
    if (part.type !== "file") {
      continue;
    }
    uploads.push({
      fieldname: part.fieldname,
      buffer: await part.toBuffer(),
      mimetype: part.mimetype,
    });
  }

  const result = await brandingService.updateBranding(uploads);

  reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(result, "Branding updated successfully"));
}
