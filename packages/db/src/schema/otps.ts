import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const otps = pgTable("otps", {
  id: uuid("id").primaryKey().defaultRandom(),
  user: uuid("user_id")
    .notNull()
    .references(() => users.id),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const otpsRelations = relations(otps, ({ one }) => ({
  user: one(users, { fields: [otps.user], references: [users.id] }),
}));

export type Otp = typeof otps.$inferSelect;
export type NewOtp = typeof otps.$inferInsert;
