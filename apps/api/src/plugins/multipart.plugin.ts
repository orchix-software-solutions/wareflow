import fp from "fastify-plugin";
import multipart from "@fastify/multipart";
import type { FastifyInstance } from "fastify";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5;

export default fp(
  async function multipartPlugin(fastify: FastifyInstance) {
    await fastify.register(multipart, {
      limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
    });
  },
  { name: "multipart" },
);
