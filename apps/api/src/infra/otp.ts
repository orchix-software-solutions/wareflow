import { randomInt } from "node:crypto";
import { env } from "@/config/env";

export const OTP_EXPIRY_MINUTES = 10;

/** Generates a 6-digit OTP. Returns the configured demo OTP when demo mode is enabled. */
export function generateOtp(): string {
  if (env.ALLOW_DEMO_OTP) {
    return env.DEMO_OTP;
  }
  return randomInt(100000, 999999).toString();
}

/** Returns the expiry timestamp for a freshly generated OTP. */
export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);
}
