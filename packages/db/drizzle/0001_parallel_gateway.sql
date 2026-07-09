CREATE TABLE IF NOT EXISTS "application_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"object_key" text NOT NULL,
	"bucket" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_assets_key_unique" UNIQUE("key")
);
