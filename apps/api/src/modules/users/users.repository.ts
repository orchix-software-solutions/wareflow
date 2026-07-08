import { eq, or } from "drizzle-orm";
import { db, users, type NewUser } from "@wareflow/db";

export async function findUserByIdentifier(identifier: string) {
  return db.query.users.findFirst({
    where: or(eq(users.username, identifier), eq(users.email, identifier.toLowerCase())),
    with: { role: true },
  });
}

export async function findUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    with: { role: true },
  });
}

export async function createUser(data: NewUser) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function updateUserPassword(id: string, passwordHash: string) {
  const [user] = await db
    .update(users)
    .set({ password: passwordHash, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}

export async function updateUserLastLogin(id: string) {
  const [user] = await db
    .update(users)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return user;
}
