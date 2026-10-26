import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "clinics_what_to_bring" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  ALTER TABLE "clinics_what_to_bring" ADD CONSTRAINT "clinics_what_to_bring_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clinics_what_to_bring_order_idx" ON "clinics_what_to_bring" USING btree ("_order");
  CREATE INDEX "clinics_what_to_bring_parent_id_idx" ON "clinics_what_to_bring" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "clinics_what_to_bring" CASCADE;`)
}
