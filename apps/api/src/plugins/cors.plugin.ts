import fp from "fastify-plugin";
import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { corsOptions } from "@/config/cors";

export default fp(
  async function corsPlugin(fastify: FastifyInstance) {
    await fastify.register(cors, corsOptions);
  },
  { name: "cors" },
);
