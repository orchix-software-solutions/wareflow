import type { FastifyInstance } from "fastify";
import { asyncHandler } from "@/core";
import { authenticate } from "@/infra";
import { getBrandingController, updateBrandingController } from "./branding.controller";

export async function brandingRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/api/settings/branding",
    {
      schema: {
        tags: ["Settings"],
        summary: "Get current logo and favicon branding assets (public)",
      },
    },
    asyncHandler(getBrandingController),
  );

  fastify.put(
    "/api/settings/branding",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Settings"],
        summary: "Upload or replace one or more branding assets (logoLight, logoDark, favicon)",
      },
    },
    asyncHandler(updateBrandingController),
  );
}
