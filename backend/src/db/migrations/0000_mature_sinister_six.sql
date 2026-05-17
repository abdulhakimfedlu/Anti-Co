DO $$ BEGIN
 CREATE TYPE "public"."message_priority" AS ENUM('Low', 'Medium', 'High', 'Urgent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."message_status" AS ENUM('new', 'resolved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."service_status" AS ENUM('active', 'hidden');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."admin_role" AS ENUM('Super Admin', 'Admin', 'Viewer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_name" text,
	"sender_email" text,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"priority" "message_priority" DEFAULT 'Medium' NOT NULL,
	"status" "message_status" DEFAULT 'new' NOT NULL,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"title_am" text,
	"description" text,
	"description_am" text,
	"category" text NOT NULL,
	"status" "service_status" DEFAULT 'active' NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"role" "admin_role" DEFAULT 'Admin' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
