// Fixpoint's own content: the devices, the repairs, the volunteers and the common questions, from
// src/content/campus-cycle.ts. Two places use it:
// - the seed (src/seed/seed.ts), for a new database (your laptop, the tests);
// - the migration that brought the topic to the live site (src/migrations/*_fixpoint_content.ts),
//   because the live site was seeded long before, with the old example, and the seed does not run
//   there again.
//
// Each function adds only what is missing (found by slug, or by name or question), so running it twice
// changes nothing, and it never overwrites a record an editor may have changed. Only
// rewriteStarterTexts, which the migration runs once, replaces the old example's texts.
import path from 'node:path'
import type { Payload, PayloadRequest } from 'payload'
import { CAMPUS_CYCLE } from '../content/campus-cycle'
import { IMAGES, IMAGES_FOLDER, PAGES } from './seed'

type Options = { req?: Partial<PayloadRequest> }
export type OwnContentResult = { created: number; skipped: number }

// The Saturdays the migration opens time slots for: from 28 November 2026 to 27 March 2027. Until
// 28 March Belgium keeps winter time (UTC+1), so 13:00 in Brussels is 12:00 UTC on every one of them.
// After that, an editor adds new slots in /admin (the handover note says so).
const FIRST_SATURDAY = Date.UTC(2026, 10, 28)
const SATURDAYS = 18
const BRUSSELS_OFFSET_HOURS = 1

/** The devices, the repairs (with the devices they are for), the volunteers and the questions. */
export async function addOwnContent(payload: Payload, { req }: Options = {}): Promise<OwnContentResult> {
  const result: OwnContentResult = { created: 0, skipped: 0 }
  const common = { depth: 0, overrideAccess: true, req } as const

  // The devices first: each repair links to them.
  const deviceIds = new Map<string, number>()
  for (const device of CAMPUS_CYCLE.devices) {
    const found = (await payload.find({ collection: 'devices', where: { slug: { equals: device.slug } }, limit: 1, ...common })).docs[0]
    if (found) {
      result.skipped += 1
      deviceIds.set(device.slug, found.id)
    } else {
      const made = await payload.create({ collection: 'devices', data: { ...device }, ...common })
      result.created += 1
      deviceIds.set(device.slug, made.id)
    }
  }

  // The repairs, each with its devices: the many-to-many.
  const repairIds = new Map<string, number>()
  for (const repair of CAMPUS_CYCLE.repairs) {
    const found = (await payload.find({ collection: 'services', where: { slug: { equals: repair.slug } }, limit: 1, ...common })).docs[0]
    if (found) {
      result.skipped += 1
      repairIds.set(repair.slug, found.id)
      continue
    }
    const made = await payload.create({
      collection: 'services',
      data: { ...repair, devices: repair.devices.map((slug) => idOf(deviceIds, slug)) },
      ...common,
    })
    result.created += 1
    repairIds.set(repair.slug, made.id)
  }

  for (const fixer of CAMPUS_CYCLE.fixers) {
    const found = (await payload.find({ collection: 'fixers', where: { name: { equals: fixer.name } }, limit: 1, ...common })).docs[0]
    if (found) {
      result.skipped += 1
      continue
    }
    await payload.create({
      collection: 'fixers',
      data: { name: fixer.name, bio: fixer.bio, repairs: fixer.repairs.map((slug) => idOf(repairIds, slug)) },
      ...common,
    })
    result.created += 1
  }

  for (const [index, item] of CAMPUS_CYCLE.questions.entries()) {
    const found = (await payload.find({ collection: 'questions', where: { question: { equals: item.question } }, limit: 1, ...common })).docs[0]
    if (found) {
      result.skipped += 1
      continue
    }
    await payload.create({ collection: 'questions', data: { ...item, order: (index + 1) * 10 }, ...common })
    result.created += 1
  }

  return result
}

/**
 * Once, on the live site: replaces the old example's texts with Fixpoint's. The four pages get their
 * new title, intro and body, and the Site facts their new place, e-mail address and pricing rule.
 */
export async function rewriteStarterTexts(payload: Payload, { req }: Options = {}) {
  const common = { depth: 0, overrideAccess: true, req } as const
  for (const page of PAGES) {
    const found = (await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1, ...common })).docs[0]
    const data = { title: page.title, slug: page.slug, intro: page.intro, body: 'body' in page ? page.body : null }
    if (found) await payload.update({ collection: 'pages', id: found.id, data, ...common })
    else await payload.create({ collection: 'pages', data, ...common })
  }
  await payload.updateGlobal({
    slug: 'site-facts',
    data: { pricingRule: CAMPUS_CYCLE.pricingRule, place: CAMPUS_CYCLE.place, email: CAMPUS_CYCLE.email },
    ...common,
  })
}

/**
 * Once, on the live site: the repair café. The clinic the course's warm-ups made becomes the Saturday
 * repair café (its time slots and bookings stay linked to it); without one, it is created. Then it
 * gets time slots on every Saturday from 28 November 2026 to 27 March 2027, except the ones it has.
 */
export async function openRepairCafe(payload: Payload, { req }: Options = {}) {
  const common = { depth: 0, overrideAccess: true, req } as const
  const cafe = CAMPUS_CYCLE.clinic
  const data = {
    name: cafe.name,
    slug: cafe.slug,
    day: cafe.day,
    startTime: cafe.startTime,
    endTime: cafe.endTime,
    summary: cafe.summary,
    whatToBring: cafe.whatToBring.map((item) => ({ item })),
  }
  const existing = (await payload.find({ collection: 'clinics', sort: 'createdAt', limit: 1, ...common })).docs[0]
  const clinic = existing
    ? await payload.update({ collection: 'clinics', id: existing.id, data, ...common })
    : await payload.create({ collection: 'clinics', data, ...common })

  const have = new Set(
    (await payload.find({ collection: 'timeSlots', where: { clinic: { equals: clinic.id } }, pagination: false, ...common })).docs.map(
      (slot) => new Date(slot.startsAt).toISOString(),
    ),
  )
  for (let week = 0; week < SATURDAYS; week += 1) {
    for (const time of cafe.slotTimes) {
      const [hours, minutes] = time.split(':').map(Number)
      const startsAt = new Date(FIRST_SATURDAY + week * 7 * 86_400_000 + ((hours - BRUSSELS_OFFSET_HOURS) * 60 + minutes) * 60_000).toISOString()
      if (have.has(startsAt)) continue
      await payload.create({ collection: 'timeSlots', data: { clinic: clinic.id, startsAt, places: cafe.placesPerSlot }, ...common })
    }
  }
}

function idOf(ids: Map<string, number>, slug: string): number {
  const id = ids.get(slug)
  if (id === undefined) throw new Error(`No record called "${slug}": check src/content/campus-cycle.ts.`)
  return id
}

/**
 * Once, on the live site: the photos. Uploads Fixpoint's two photos (src/seed/images) when they are
 * missing, and deletes the old example's two bicycle photos, which no page uses any more.
 */
export async function replacePhotos(payload: Payload, { req }: Options = {}) {
  const common = { depth: 0, overrideAccess: true, req } as const
  for (const image of IMAGES) {
    const name = image.filename.replace(/\.jpg$/, '')
    const found = (await payload.find({ collection: 'media', where: { filename: { contains: name } }, limit: 1, ...common })).docs[0]
    if (!found) {
      await payload.create({ collection: 'media', data: { alt: image.alt }, filePath: path.join(IMAGES_FOLDER, image.filename), ...common })
    }
  }
  for (const old of ['workshop-tools', 'clinic-tools']) {
    await payload.delete({ collection: 'media', where: { filename: { contains: old } }, ...common })
  }
}
