import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const seedTrackers = pgTable("seed_trackers", {
  id: uuid("id").primaryKey().defaultRandom(),
  module: text("module").notNull().unique(),
  isSeeded: boolean("is_seeded").notNull().default(false),
  seededAt: timestamp("seeded_at", { withTimezone: true }),
});

export type SeedTracker = typeof seedTrackers.$inferSelect;
export type NewSeedTracker = typeof seedTrackers.$inferInsert;
