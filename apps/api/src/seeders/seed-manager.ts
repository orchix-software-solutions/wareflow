import type { Role } from "@wareflow/db";
import { findRoleByName } from "@/modules/roles/roles.repository";
import { isModuleSeeded, markModuleSeeded } from "@/modules/seed-tracker/seed-tracker.repository";
import { seedOwnerRole, seedOwnerUser } from "./owner.seeder";

interface SeedLogger {
  info: (obj: unknown, msg?: string) => void;
}

/**
 * Runs all startup seed steps in order, skipping any step already recorded
 * as seeded in the seed_trackers table.
 */
export async function runSeedManager(log: SeedLogger): Promise<void> {
  let ownerRole: Role | undefined;

  if (!(await isModuleSeeded("owner_role"))) {
    ownerRole = await seedOwnerRole();
    await markModuleSeeded("owner_role");
    log.info({ role: ownerRole.name }, "Seeded owner_role");
  } else {
    log.info("Skipped owner_role seed — already seeded");
    ownerRole = await findRoleByName("Owner");
  }

  if (!ownerRole) {
    throw new Error("Owner role is missing after seed step — cannot seed owner user");
  }

  if (!(await isModuleSeeded("owner_user"))) {
    await seedOwnerUser(ownerRole);
    await markModuleSeeded("owner_user");
    log.info("Seeded owner_user");
  } else {
    log.info("Skipped owner_user seed — already seeded");
  }
}
