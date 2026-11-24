// The seed: puts the Campus Cycle example content into a new site's database, so the site has real
// pages and images to show from its very first day.
//
// It adds the example content ONCE PER DATABASE. After a run that finished without an error, it notes
// that in the database (one row in a small table of its own: src/seed/exampleFlag.ts). Every later run
// reads that note first and adds nothing (src/seed/run.ts):
// - each production build (scripts/build.mjs) then prints "SEED: skipped (the example content was
//   added before; your editors' changes are kept)";
// - `npm run seed` on your own computer does the same.
// So whatever editors change or delete in /admin stays that way: nothing comes back after a deploy.
// A preview database is a copy of production, note included, so it is never seeded again either.
//
// `npm run seed -- --again` adds back only the example records that are missing (it looks for each
// one: pages by slug, images by file name). It never overwrites
// a record that exists, because an editor may have changed it, and the note stays.
//
// The first editor account (from FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD) is a separate step that
// runs first, on every run: it is created only when no editor exists yet (src/seed/run.ts).
//
// It creates no clinic, no time slots and no bookings: a later exercise in the course asks you to add
// the clinic yourself in /admin.
//
// To replace the example with your own content:
// - before your first deploy: change the facts in src/content/campus-cycle.ts and the page texts
//   below; after it, edit the records in /admin instead (the seed does not run again);
// - each photo is listed in IMAGES (the photo itself goes in src/seed/images, with its source in
//   SOURCES.md there);
// - to start from an empty site, set ADD_EXAMPLE_CONTENT to false before your first deploy: the first
//   editor is still created. After it, delete the example records in /admin (they do not come back).
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionSlug, Payload, Where } from 'payload'
import { CAMPUS_CYCLE, MADE_UP_DATA_NOTICE } from '../content/campus-cycle'
import { PlainError } from '../lib/plainError'
import { richText } from './richText'

// true: a new site starts with the Campus Cycle example. Set it to false before your first deploy to
// start from an empty site (only the first editor is created) and add your own content in /admin. After
// your first deploy, changing it changes nothing: delete the example records in /admin instead (they
// do not come back).
export const ADD_EXAMPLE_CONTENT = true

// The photos live next to this file, in src/seed/images (their sources and licences: SOURCES.md there).
const IMAGES_FOLDER = fileURLToPath(new URL('./images/', import.meta.url))

// The alt text describes each photo for people who cannot see it (a screen reader reads it out), so it
// says what is in the picture, not just "a photo".
const IMAGES = [
  // The home page's picture.
  {
    filename: 'workshop-tools.jpg',
    alt: 'A workshop wall full of bicycle tools: spanners, pliers and other tools hanging above a workbench',
  },
  // The clinic page's picture: the clinic itself is not in the seed, but its photo is ready for it.
  {
    filename: 'clinic-tools.jpg',
    alt: 'Bicycle repair tools laid out on a table: an adjustable spanner, two tyre levers, Allen keys, sockets, a screwdriver and a patch kit',
  },
] as const

// Most of these licences ask that wherever the photo is used, it names the photo, the photographer and
// the licence, with links where that is possible. The about page ends with these lines (the same facts
// as src/seed/images/SOURCES.md).
const CC_BY_SA_3 = {
  licence: 'CC BY-SA 3.0',
  licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
}
const CC_BY_SA_4 = {
  licence: 'CC BY-SA 4.0',
  licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
}
const PHOTO_CREDITS = [
  {
    title: 'Bicycle repair tools, Bicycle Kitchen, Los Angeles.jpg',
    page: 'https://commons.wikimedia.org/wiki/File:Bicycle_repair_tools,_Bicycle_Kitchen,_Los_Angeles.jpg',
    photographer: 'Downtowngal',
    ...CC_BY_SA_4,
  },
  {
    title: 'BicycleRepairTools.JPG',
    page: 'https://commons.wikimedia.org/wiki/File:BicycleRepairTools.JPG',
    photographer: 'Gengiskanhg',
    ...CC_BY_SA_3,
  },
]

export const PAGES = [
  {
    title: 'Campus Cycle',
    slug: 'home',
    // No word about the clinic's times here: it is not in the seed, and until you add it the home page
    // says "The repair clinic opens soon".
    intro:
      'Campus Cycle is the bicycle repair service at the college. Bring your bicycle for a check or a repair.',
    // No body: everything else on the home page comes from its own record: the clinic, and the pricing
    // rule from the Site facts global.
  },
  {
    title: 'About Campus Cycle',
    slug: 'about',
    intro: 'Who we are, what we do and where to find us.',
    body: richText([
      {
        paragraph:
          'Campus Cycle is a fictional bicycle repair service at a college. Two staff members run it.',
      },
      { heading: 'Checks and repairs' },
      // No times here: the clinic's own page shows them from its record, once it is open.
      {
        paragraph: 'Bring your bicycle for a check or a repair. When the repair clinic is open, you first book a time slot on its page.',
      },
      { heading: 'Where to find us' },
      // A link, not the address: the Contact page shows the place from the Site facts global.
      { paragraph: ['See the ', { text: 'Contact page', url: '/contact' }, '.'] },
      { heading: 'Photo credits' },
      { paragraph: 'The photos on this site come from Wikimedia Commons:' },
      {
        list: PHOTO_CREDITS.map((credit) => [
          { text: credit.title, url: credit.page },
          ` by ${credit.photographer}, licence `,
          { text: credit.licence, url: credit.licenceUrl },
        ]),
      },
      { paragraph: 'Each photo was resized from the original and is shared under its own licence, as listed.' },
    ]),
  },
  {
    title: 'Contact',
    slug: 'contact',
    intro: 'Questions about the repair clinic? Send us an e-mail.',
    // Prose only: the Contact page shows the e-mail address and the place from the Site facts global.
    body: richText([
      { paragraph: 'There is no contact form on this site: send an e-mail instead.' },
      {
        paragraph:
          'This site is a practice project, so the e-mail address above is not a real one: it ends in .example, a name set aside for examples, and nothing sent to it arrives anywhere.',
      },
    ]),
  },
  // When you add a field to the booking form or switch on analytics, change this page in /admin too:
  // the seed never changes a page that exists.
  {
    title: 'Privacy',
    slug: 'privacy',
    intro: 'What this site keeps about you, why, who can see it and for how long.',
    body: richText([
      { heading: 'What the booking form saves' },
      {
        paragraph:
          'When you book a time slot, the site saves your name, your e-mail address, the time slot you chose and your note, if you wrote one. It saves them to hold your place.',
      },
      { heading: 'Who can see it' },
      {
        paragraph:
          "Only the site's editors, who log in to /admin. If you have an account on this site, you can also see your own bookings after you log in.",
      },
      { heading: 'How long it is kept' },
      { paragraph: 'Until an editor deletes it.' },
      { heading: 'Stopping spam' },
      {
        paragraph:
          'When you send a form, the site keeps a scrambled code made from your internet (IP) address, for one hour, to stop anyone who sends forms too often. The address itself is not stored.',
      },
      { heading: 'Cookies' },
      {
        paragraph:
          'This site sets cookies only for people who log in, such as an editor in /admin: one to keep them logged in, and one that remembers the look they chose for /admin.',
      },
      { heading: 'A practice project' },
      { paragraph: MADE_UP_DATA_NOTICE },
    ]),
  },
]

// On Vercel, uploaded images must go to a Vercel Blob store: the build machine's own disk is thrown away
// after the build. Without the store's token there is nowhere to keep them.
export const NO_BLOB_STORE_MESSAGE =
  'Images cannot be stored: this Vercel project has no Blob store connected. In Vercel: Storage → Create Storage → Blob (Public), connect it to Production only, with its read-write token (Settings → Environment Variables then lists BLOB_READ_WRITE_TOKEN), then Redeploy.'

export type SeedResult = { created: number; skipped: number }

// Is `stored` the file `wanted`, perhaps under a number Payload added? When a file with the same name
// is already in the upload folder, Payload saves the new one as clinic-tools-1.jpg (then -2, …),
// and that is still the clinic photo.
function sameImage(stored: string | null | undefined, wanted: string): boolean {
  if (!stored) return false
  const { name, ext } = path.parse(wanted)
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^${escape(name)}(-\\d+)?${escape(ext)}$`, 'i').test(stored)
}

/**
 * Adds the Campus Cycle example content that is missing, and leaves everything that exists alone.
 * Returns how many records it created and how many it found already there.
 *
 * `env` is where it looks for VERCEL and BLOB_READ_WRITE_TOKEN (normally process.env; a test can pass
 * its own).
 */
export async function seed(
  payload: Payload,
  { env = process.env }: { env?: Record<string, string | undefined> } = {},
): Promise<SeedResult> {
  const result: SeedResult = { created: 0, skipped: 0 }

  // overrideAccess: true - the seed is the site's own code, run by the build or by you, not a request
  // from a user. The access rules (only editors may create content) are for requests; here there is no
  // logged-in editor to check, so the seed is allowed to create content directly.
  async function findOne(collection: CollectionSlug, where: Where) {
    const found = await payload.find({
      collection,
      where,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    return found.docs[0] as { id: number | string } | undefined
  }

  // Creates a record only when `existing` is missing. Returns its id either way, so a later record
  // could link to it.
  async function keepOrCreate(
    existing: { id: number | string } | undefined,
    create: () => Promise<{ id: number }>,
  ) {
    if (existing) {
      result.skipped += 1
      return Number(existing.id)
    }
    const record = await create()
    result.created += 1
    return record.id
  }

  // 1. Which images are there already? Found by their base name (see sameImage).
  const existingImages = new Map<string, { id: number | string }>()
  for (const image of IMAGES) {
    const { name } = path.parse(image.filename)
    const candidates = await payload.find({
      collection: 'media',
      where: { filename: { contains: name } },
      limit: 100,
      depth: 0,
      overrideAccess: true,
    })
    const found = candidates.docs.find((media) => sameImage(media.filename, image.filename))
    if (found) existingImages.set(image.filename, found)
  }

  // Before creating anything: on Vercel, an image can only be stored in a Blob store. Stop now, with
  // nothing created, so the next deploy (with the store connected) starts cleanly.
  const uploadsImages = existingImages.size < IMAGES.length
  if (uploadsImages && env.VERCEL && !env.BLOB_READ_WRITE_TOKEN)
    throw new PlainError(NO_BLOB_STORE_MESSAGE)

  // 2. The images.
  const imageIds = new Map<string, number>()
  for (const image of IMAGES) {
    const id = await keepOrCreate(existingImages.get(image.filename), () =>
      payload.create({
        collection: 'media',
        data: { alt: image.alt },
        filePath: path.join(IMAGES_FOLDER, image.filename),
        overrideAccess: true,
      }),
    )
    imageIds.set(image.filename, id)
  }

  // 3. The pages.
  for (const page of PAGES) {
    await keepOrCreate(await findOne('pages', { slug: { equals: page.slug } }), () =>
      payload.create({ collection: 'pages', data: page, overrideAccess: true }),
    )
  }

  // 4. The Site facts: the facts several pages show, kept in one place. A global always "exists" (it
  // reads as empty until it is first saved), so an empty pricing rule means it was never filled in.
  const facts = await payload.findGlobal({ slug: 'site-facts', depth: 0, overrideAccess: true })
  if (facts.pricingRule) {
    result.skipped += 1
  } else {
    await payload.updateGlobal({
      slug: 'site-facts',
      data: { pricingRule: CAMPUS_CYCLE.pricingRule, place: CAMPUS_CYCLE.place, email: CAMPUS_CYCLE.email },
      overrideAccess: true,
    })
    result.created += 1
  }

  return result
}
