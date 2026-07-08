import type { Role } from "@wareflow/db";
import { env } from "@/config/env";
import { hashPassword } from "@/infra/password";
import { createRole, findRoleByName } from "@/modules/roles/roles.repository";
import { createUser, findUserByIdentifier } from "@/modules/users/users.repository";

/**
 * Ensures the system "Owner" role exists. Returns the existing role if
 * already present, otherwise creates it. Never creates a duplicate.
 */
export async function seedOwnerRole(): Promise<Role> {
  const existing = await findRoleByName("Owner");
  if (existing) {
    return existing;
  }

  const created = await createRole({
    name: "Owner",
    description: "Full system access",
    isSystem: true,
  });

  if (!created) {
    throw new Error("Failed to create Owner role");
  }

  return created;
}

/**
 * Ensures the owner user (from env.OWNER_*) exists and is assigned the
 * given Owner role. Never creates a duplicate.
 */
export async function seedOwnerUser(ownerRole: Role): Promise<void> {
  const existing = await findUserByIdentifier(env.OWNER_USERNAME);
  if (existing) {
    return;
  }

  const passwordHash = await hashPassword(env.OWNER_PASSWORD);

  const [firstName, ...rest] = env.OWNER_NAME.split(" ");
  const lastName = rest.join(" ");

  await createUser({
    username: env.OWNER_USERNAME,
    email: env.OWNER_EMAIL,
    password: passwordHash,
    firstName: firstName ?? env.OWNER_NAME,
    lastName,
    role: ownerRole.id,
  });
}
