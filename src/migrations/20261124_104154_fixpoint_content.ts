import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { addOwnContent, openRepairCafe, replacePhotos, rewriteStarterTexts } from '../seed/ownContent'

// A content migration: no table changes, only records. It brings Fixpoint to a site that was seeded
// with the starter's example before: the live site (and its previews, which copy it). There the seed
// never runs again, so without this the pages would still talk about the old example.
//
// It runs only where the example was seeded: the seed's own note (the table starter_example_seeded,
// src/seed/exampleFlag.ts). A new database, such as the tests' or a fresh laptop's, has no note yet:
// there the seed adds Fixpoint's content itself, and this migration changes nothing. The note is read
// through `db`, the migration's own connection: a second connection could wait for this one forever.
//
// What it does, once:
// - adds the devices, the repairs, the volunteers and the common questions (only what is missing);
// - replaces the texts of the four pages (home, about, contact, privacy) and the Site facts;
// - turns the clinic the warm-ups made into the Saturday repair café (its time slots and bookings
//   stay linked to it) and opens time slots on every Saturday until the end of March 2027;
// - uploads the two new photos and deletes the two old bicycle photos.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const table = await db.execute(sql`select to_regclass('public.starter_example_seeded') as t`)
  if (!table.rows[0]?.t) return
  const note = await db.execute(sql`select 1 from public.starter_example_seeded where id = 1`)
  if (note.rows.length === 0) return

  await addOwnContent(payload, { req })
  await rewriteStarterTexts(payload, { req })
  await openRepairCafe(payload, { req })
  await replacePhotos(payload, { req })
}

// Nothing to undo automatically: the old example's texts are gone, and deleting the new records here
// could delete an editor's changes too. Restore a backup instead (docs/handover.md).
export async function down(_args: MigrateDownArgs): Promise<void> {}
