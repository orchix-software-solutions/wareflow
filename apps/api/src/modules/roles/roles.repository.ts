import { eq } from "drizzle-orm";
import { db, roles, type NewRole } from "@wareflow/db";

export async function findRoleByName(name: string) {
  return db.query.roles.findFirst({ where: eq(roles.name, name) });
}

export async function findRoleById(id: string) {
  return db.query.roles.findFirst({ where: eq(roles.id, id) });
}

export async function createRole(data: NewRole) {
  const [role] = await db.insert(roles).values(data).returning();
  return role;
}
