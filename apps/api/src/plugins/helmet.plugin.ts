import fp from "fastify-plugin";
import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";

export default fp(
  async function helmetPlugin(fastify: FastifyInstance) {
    await fastify.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
    });
  },
  { name: "helmet" },
);
