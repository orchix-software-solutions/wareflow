import fp from "fastify-plugin";
import compress from "@fastify/compress";
import type { FastifyInstance } from "fastify";

export default fp(
  async function compressionPlugin(fastify: FastifyInstance) {
    await fastify.register(compress, { global: true });
  },
  { name: "compression" },
);
