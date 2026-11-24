import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "devices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"details" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"minutes" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"devices_id" integer
  );
  
  CREATE TABLE "bookings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "fixers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "fixers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "questions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"order" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "devices_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fixers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "questions_id" integer;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_devices_fk" FOREIGN KEY ("devices_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bookings_rels" ADD CONSTRAINT "bookings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bookings_rels" ADD CONSTRAINT "bookings_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixers_rels" ADD CONSTRAINT "fixers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fixers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fixers_rels" ADD CONSTRAINT "fixers_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "devices_slug_idx" ON "devices" USING btree ("slug");
  CREATE INDEX "devices_updated_at_idx" ON "devices" USING btree ("updated_at");
  CREATE INDEX "devices_created_at_idx" ON "devices" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_devices_id_idx" ON "services_rels" USING btree ("devices_id");
  CREATE INDEX "bookings_rels_order_idx" ON "bookings_rels" USING btree ("order");
  CREATE INDEX "bookings_rels_parent_idx" ON "bookings_rels" USING btree ("parent_id");
  CREATE INDEX "bookings_rels_path_idx" ON "bookings_rels" USING btree ("path");
  CREATE INDEX "bookings_rels_services_id_idx" ON "bookings_rels" USING btree ("services_id");
  CREATE INDEX "fixers_updated_at_idx" ON "fixers" USING btree ("updated_at");
  CREATE INDEX "fixers_created_at_idx" ON "fixers" USING btree ("created_at");
  CREATE INDEX "fixers_rels_order_idx" ON "fixers_rels" USING btree ("order");
  CREATE INDEX "fixers_rels_parent_idx" ON "fixers_rels" USING btree ("parent_id");
  CREATE INDEX "fixers_rels_path_idx" ON "fixers_rels" USING btree ("path");
  CREATE INDEX "fixers_rels_services_id_idx" ON "fixers_rels" USING btree ("services_id");
  CREATE INDEX "questions_updated_at_idx" ON "questions" USING btree ("updated_at");
  CREATE INDEX "questions_created_at_idx" ON "questions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_devices_fk" FOREIGN KEY ("devices_id") REFERENCES "public"."devices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fixers_fk" FOREIGN KEY ("fixers_id") REFERENCES "public"."fixers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_questions_fk" FOREIGN KEY ("questions_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_devices_id_idx" ON "payload_locked_documents_rels" USING btree ("devices_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_fixers_id_idx" ON "payload_locked_documents_rels" USING btree ("fixers_id");
  CREATE INDEX "payload_locked_documents_rels_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("questions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "devices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "bookings_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "fixers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "questions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "devices" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "bookings_rels" CASCADE;
  DROP TABLE "fixers" CASCADE;
  DROP TABLE "fixers_rels" CASCADE;
  DROP TABLE "questions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_devices_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fixers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_questions_fk";
  
  DROP INDEX "payload_locked_documents_rels_devices_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_fixers_id_idx";
  DROP INDEX "payload_locked_documents_rels_questions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "devices_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "fixers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "questions_id";`)
}
