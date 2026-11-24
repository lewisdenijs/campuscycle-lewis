// The facts of the example site. When you turn the starter into your own project, this file and the
// seed are where the example content lives.
//
// Campus Cycle is a made-up bicycle repair service at a college. Every fact here comes from the
// course's Campus Cycle fact sheet, so the site, the lessons and the exercises all tell the same story.
//
// The seed (src/seed/seed.ts) copies these facts into the database ONCE per database: after its first
// complete run it notes in the database that the example was added, and every later run, on each
// deploy too, adds nothing. From then on the records live in the database, editors change them in
// /admin, and this file is no longer read for them. Nothing you delete or change in /admin comes back
// after a deploy.
//
// To replace the example with your own content:
// - before your first deploy: change the facts here and the page texts in src/seed/seed.ts;
// - after it: edit the records in /admin (changing this file then changes nothing on the site);
// - to start from an empty site instead, set ADD_EXAMPLE_CONTENT to false in src/seed/seed.ts before
//   your first deploy; after it, delete the example records in /admin (they do not come back).
//
// `as const` makes every value here fixed: TypeScript then knows, for example, that the clinic's day is
// exactly 'Saturday', not just "some text", and warns about a typo anywhere it is used.

// The site's name: in the header, the footer and every browser tab ("<Page> · Campus Cycle", from
// SITE_TITLE below). Change it here, once.
export const SITE_NAME = 'Campus Cycle'

// The browser tab's title. The home page shows the name alone; every other page gives only its own part
// (such as "Repair clinic") and Next.js adds " · " and the name after it, so a tab or a bookmark says both
// what the page is and which site it belongs to. Used by src/app/(site)/layout.tsx.
export const SITE_TITLE = { default: SITE_NAME, template: `%s · ${SITE_NAME}` }

export const CAMPUS_CYCLE = {
  // The place, the e-mail address and the pricing rule (below) go into the Site facts global
  // (src/globals/SiteFacts.ts): every page that shows them reads them from there.
  place: 'Workshop B, Student Centre',
  email: 'hello@campuscycle.example',
  pricingRule: 'Tools, a tutor and standard parts are included. Bring your own parts and pay EUR 5 less per bicycle.',
  // The clinic is NOT in the seed: you add it yourself in /admin (a later exercise in the course asks
  // you to add it), with its time slots. These are the agreed facts for it: Saturday 15:00 to 17:00,
  // four 30-minute slots, two bicycles per slot.
  // Nothing reads these; they are here so you type the same values in /admin.
  clinicDefaults: {
    day: 'Saturday',
    startTime: '15:00',
    endTime: '17:00',
    slotMinutes: 30,
    placesPerSlot: 2,
    slotTimes: ['15:00', '15:30', '16:00', '16:30'],
  },
} as const

// Shown on the booking form, in the booking confirmation and on the privacy page. One copy here, so
// the three places can never say it differently. (The browser checks keep their own copy on purpose,
// in tests/e2e/helpers.ts, so a change here shows up there.)
export const MADE_UP_DATA_NOTICE = 'This is a practice project: use made-up details; no one will contact you.'

// What the booking confirmation page shows after a booking was saved.
export const BOOKING_CONFIRMATION = `Your booking is saved. ${MADE_UP_DATA_NOTICE}`

