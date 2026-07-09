import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const applicationAssets = pgTable("application_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), // e.g. "logo-light", "logo-dark", "favicon"
  objectKey: text("object_key").notNull(),
  bucket: text("bucket").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ApplicationAsset = typeof applicationAssets.$inferSelect;
export type NewApplicationAsset = typeof applicationAssets.$inferInsert;
