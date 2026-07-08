import type { FastifyInstance } from "fastify";
import { asyncHandler } from "@/core";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  resetPasswordController,
  verifyOtpController,
} from "./auth.controller";

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    "/api/auth/login",
    { schema: { tags: ["Auth"], summary: "Login with username or email" } },
    asyncHandler(loginController),
  );

  fastify.post(
    "/api/auth/forgot-password",
    { schema: { tags: ["Auth"], summary: "Request a password reset OTP" } },
    asyncHandler(forgotPasswordController),
  );

  fastify.post(
    "/api/auth/verify-otp",
    { schema: { tags: ["Auth"], summary: "Verify a password reset OTP" } },
    asyncHandler(verifyOtpController),
  );

  fastify.post(
    "/api/auth/reset-password",
    { schema: { tags: ["Auth"], summary: "Reset password using a verified OTP" } },
    asyncHandler(resetPasswordController),
  );

  fastify.post(
    "/api/auth/logout",
    { schema: { tags: ["Auth"], summary: "Logout the current session" } },
    asyncHandler(logoutController),
  );
}
