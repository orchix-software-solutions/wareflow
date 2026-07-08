import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import { rateLimitConfig } from "@/config/rate-limit";

export default fp(
  async function rateLimitPlugin(fastify: FastifyInstance) {
    await fastify.register(rateLimit, rateLimitConfig.global);
  },
  { name: "rate-limit" },
);
