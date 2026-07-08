import type { SwaggerOptions } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

export const swaggerConfig: SwaggerOptions = {
  openapi: {
    info: {
      title: "WareFlow API",
      description: "WareFlow warehouse management API",
      version: "0.0.1",
    },
  },
};

export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
};
