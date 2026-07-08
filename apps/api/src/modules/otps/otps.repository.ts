import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { db, otps } from "@wareflow/db";

interface CreateOtpInput {
  user: string;
  codeHash: string;
  expiresAt: Date;
}

export async function createOtp(data: CreateOtpInput) {
  const [otp] = await db.insert(otps).values(data).returning();
  return otp;
}

export async function findActiveOtpForUser(user: string) {
  return db.query.otps.findFirst({
    where: and(eq(otps.user, user), isNull(otps.consumedAt), gt(otps.expiresAt, new Date())),
    orderBy: desc(otps.createdAt),
  });
}

export async function consumeOtp(id: string): Promise<void> {
  await db.update(otps).set({ consumedAt: new Date() }).where(eq(otps.id, id));
}
