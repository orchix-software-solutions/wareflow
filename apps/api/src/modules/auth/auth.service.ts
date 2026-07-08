import type { Otp, User } from "@wareflow/db";
import { AuthenticationError, BadRequestError, ForbiddenError, NotFoundError } from "@/core";
import { comparePassword, generateOtp, getOtpExpiry, hashPassword, signAccessToken } from "@/infra";
import {
  findUserByIdentifier,
  updateUserLastLogin,
  updateUserPassword,
} from "../users/users.repository";
import { consumeOtp, createOtp, findActiveOtpForUser } from "../otps/otps.repository";
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "./auth.validator";

type SafeUser = Omit<User, "password">;

interface LoginResult {
  accessToken: string;
  user: SafeUser;
}

function toSafeUser(user: User): SafeUser {
  const { password, ...safeUser } = user;
  void password;
  return safeUser;
}

/** Finds the user for an identifier and their currently active OTP, validating both exist and match. */
async function findUserWithValidOtp(
  identifier: string,
  otp: string,
): Promise<{ user: User; activeOtp: Otp }> {
  const user = await findUserByIdentifier(identifier);
  if (!user) {
    throw new NotFoundError("User");
  }

  const activeOtp = await findActiveOtpForUser(user.id);
  if (!activeOtp) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  const isOtpValid = await comparePassword(otp, activeOtp.codeHash);
  if (!isOtpValid) {
    throw new BadRequestError("Invalid or expired OTP");
  }

  return { user, activeOtp };
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const user = await findUserByIdentifier(input.identifier);

  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new AuthenticationError("Invalid credentials");
  }

  if (!user.isActive) {
    throw new ForbiddenError("Account is inactive");
  }

  await updateUserLastLogin(user.id);

  const accessToken = signAccessToken({
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role.name,
  });

  return { accessToken, user: toSafeUser(user) };
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await findUserByIdentifier(input.identifier);
  if (!user) {
    throw new NotFoundError("User");
  }

  const otp = generateOtp();
  const codeHash = await hashPassword(otp);

  await createOtp({ user: user.id, codeHash, expiresAt: getOtpExpiry() });
}

export async function verifyOtp(input: VerifyOtpInput): Promise<void> {
  await findUserWithValidOtp(input.identifier, input.otp);
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const { user, activeOtp } = await findUserWithValidOtp(input.identifier, input.otp);

  const passwordHash = await hashPassword(input.newPassword);
  await updateUserPassword(user.id, passwordHash);
  await consumeOtp(activeOtp.id);
}

export async function logout(): Promise<void> {
  return;
}
