import type { FastifyReply, FastifyRequest } from "fastify";
import { ApiResponse, HTTP_STATUS, validateRequest } from "@/core";
import * as authService from "./auth.service";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type ResetPasswordInput,
  type VerifyOtpInput,
} from "./auth.validator";

export async function loginController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  validateRequest(request, { body: loginSchema });
  const body = request.body as LoginInput;

  const result = await authService.login(body);

  reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(result, "Login successful"));
}

export async function forgotPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  validateRequest(request, { body: forgotPasswordSchema });
  const body = request.body as ForgotPasswordInput;

  await authService.forgotPassword(body);

  reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(null, "OTP sent to your registered email"));
}

export async function verifyOtpController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  validateRequest(request, { body: verifyOtpSchema });
  const body = request.body as VerifyOtpInput;

  await authService.verifyOtp(body);

  reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(null, "OTP verified successfully"));
}

export async function resetPasswordController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  validateRequest(request, { body: resetPasswordSchema });
  const body = request.body as ResetPasswordInput;

  await authService.resetPassword(body);

  reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(null, "Password reset successful"));
}

export async function logoutController(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await authService.logout();

  reply.status(HTTP_STATUS.OK).send(ApiResponse.ok(null, "Logged out successfully"));
}
