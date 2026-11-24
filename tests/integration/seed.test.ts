import { readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { afterAll, afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Payload } from 'payload'
import { BOOKING_CONFIRMATION, MADE_UP_DATA_NOTICE } from '../../src/content/campus-cycle'
import { exampleWasAdded } from '../../src/seed/exampleFlag'
import { runSeed } from '../../src/seed/run'
import { NO_BLOB_STORE_MESSAGE, PAGES, seed } from '../../src/seed/seed'
import { forgetExampleAdded, getTestPayload, resetCollections, resetSiteFacts } from '../setup/payload'
import { refuseUnlessThrowAwayTestDatabase } from '../setup/safety'
import { EXAMPLE } from '../setup/example'

// These tests delete every user and every example record: never on a real database.
refuseUnlessThrowAwayTestDatabase()


// Children before parents: the database refuses to delete a parent that still has linked records.
const clean = ['bookings', 'timeSlots', 'clinics', 'pages', 'media', 'users']
// 2 images + 4 pages + the Site facts global.
const ALL_RECORDS = 7

// The test config stores uploads in a temporary folder (tests/setup/config.ts). Empty it together with
// the media records, so every test uploads the images afresh under their own file names.
const uploadFolder = (p: Payload) => String(p.collections.media.config.upload.staticDir)

function emptyUploadFolder(p: Payload) {
  const folder = uploadFolder(p)
  for (const name of readdirSync(folder)) rmSync(path.join(folder, name), { recursive: true, force: true })
}

async function resetAll() {
  await resetCollections(clean)
  await forgetExampleAdded()
  await resetSiteFacts()
  emptyUploadFolder(await getTestPayload())
}

// The facts, copied by hand from the Campus Cycle fact sheet (the course's CAMPUS-CYCLE-FACTS.md), and
// on purpose NOT imported from src/content/campus-cycle.ts: if that file drifts from the fact sheet,
// the seeded site drifts with it, and only an independent copy notices.
const FACT_SHEET = {
  workshops: [
    // latestEnd: the gear workshop has no end time, but ends by 15:00 (the clinic needs the room).
    { title: 'Repair a puncture', level: 'beginner', day: 'Tuesday', startTime: '18:30', endTime: '20:00', latestEnd: null, price: 15 },
    { title: 'Adjust your brakes', level: 'beginner', day: 'Saturday', startTime: '10:00', endTime: null, latestEnd: null, price: 15 },
    { title: 'Service a gear system', level: 'intermediate', day: 'Saturday', startTime: '13:00', endTime: null, latestEnd: '15:00', price: 25 },
    { title: 'True a wheel', level: 'intermediate', day: 'Thursday', startTime: '19:00', endTime: null, latestEnd: null, price: 25 },
  ],
  groupSize: 6,
  topics: [
    { name: 'Tyres and wheels', slug: 'tyres-and-wheels', workshops: ['Repair a puncture', 'True a wheel'] },
    { name: 'Brakes and gears', slug: 'brakes-and-gears', workshops: ['Adjust your brakes', 'Service a gear system'] },
    { name: 'Everyday maintenance', slug: 'everyday-maintenance', workshops: ['Repair a puncture', 'Adjust your brakes'] },
  ],
  repairs: [
    { name: 'Check', price: 10 },
    { name: 'Each small repair', price: 5 },
    { name: 'Full service', price: 45 },
  ],
  pricingRule: 'Tools, a tutor and standard parts are included. Bring your own parts and pay EUR 5 less per bicycle.',
  place: 'Workshop B, Student Centre',
  email: 'hello@campuscycle.example',
}

const count = async (p: Payload, collection: 'pages' | 'media' | 'users') =>
  (await p.count({ collection, overrideAccess: true })).totalDocs

async function countAll(p: Payload) {
  const counts: Record<string, number> = {}
  // One after the other: the in-memory test database serves one query at a time.
  for (const collection of ['pages', 'media', 'users'] as const) {
    counts[collection] = await count(p, collection)
  }
  return counts
}

const html = (value: unknown) => convertLexicalToHTML({ data: value as SerializedEditorState, disableContainer: true })

async function bySlug<T extends 'pages'>(p: Payload, collection: T, slug: string) {
  const found = await p.find({ collection, where: { slug: { equals: slug } }, depth: 1 })
  expect(found.docs, `${collection} ${slug}`).toHaveLength(1)
  return found.docs[0]
}

describe('the Campus Cycle seed', () => {
  beforeEach(resetAll)
  afterAll(resetAll)

  it('creates every example record once; a second run creates nothing and adds no clinic, slot or booking', async () => {
    const p = await getTestPayload()
    expect(await seed(p)).toEqual({ created: ALL_RECORDS, skipped: 0 })
    expect(await seed(p)).toEqual({ created: 0, skipped: ALL_RECORDS })
    const counts: Record<string, number> = {}
    // One after the other: the in-memory test database serves one query at a time.
    for (const collection of ['pages', 'media', 'clinics', 'timeSlots', 'bookings'] as const) {
      counts[collection] = (await p.count({ collection })).totalDocs
    }
    expect(counts).toEqual({ pages: 4, media: 2, clinics: 0, timeSlots: 0, bookings: 0 })
    // The upload folder holds each image once: the second run uploaded nothing.
    expect(readdirSync(uploadFolder(p)).sort()).toEqual(['clinic-tools.jpg', 'workshop-tools.jpg'])
  })

  it('stores the images, each with its alt text', async () => {
    const p = await getTestPayload()
    await seed(p)
    for (const filename of ['workshop-tools.jpg', 'clinic-tools.jpg']) {
      const media = await p.find({ collection: 'media', where: { filename: { equals: filename } } })
      expect(media.docs, filename).toHaveLength(1)
      expect(media.docs[0].alt.length).toBeGreaterThan(20)
    }
  })

  it('writes the four pages: the privacy page has the made-up-data notice, the about page the photo credits', async () => {
    const p = await getTestPayload()
    await seed(p)
    const home = await bySlug(p, 'pages', 'home')
    expect(home.title).toBe(PAGES.find((page) => page.slug === 'home')?.title)
    expect(home.intro).toBeTruthy()
    const privacy = html((await bySlug(p, 'pages', 'privacy')).body)
    expect(privacy).toContain(MADE_UP_DATA_NOTICE)
    expect(privacy).toContain('<h2>A practice project</h2>')
    // The course has self-study learners too, so no page calls the site a "student project".
    expect(MADE_UP_DATA_NOTICE).toBe('This is a practice project: use made-up details; no one will contact you.')
    const pages = (await p.find({ collection: 'pages', depth: 0, limit: 100 })).docs
    expect(pages.length).toBeGreaterThanOrEqual(4)
    expect(JSON.stringify(pages)).not.toMatch(/student project/i)
    const about = html((await bySlug(p, 'pages', 'about')).body)
    expect(about).toContain('<h2>Photo credits</h2>')
    // Three of the licences (CC BY-SA) require that the photographer and the licence are named.
    for (const credit of ['Downtowngal', 'Gengiskanhg']) {
      expect(about).toContain(credit)
    }
    for (const licence of ['CC BY-SA 3.0', 'CC BY-SA 4.0']) expect(about).toContain(licence)
    // "Where to find us" sends the reader to the Contact page, which shows the place.
    expect(about).toContain('<a href="/contact">Contact page</a>')
    // The home page has no text of its own below the intro: everything else on it comes from records.
    expect(home.body ?? null).toBeNull()
    expect(BOOKING_CONFIRMATION).toBe(`Your booking is saved. ${MADE_UP_DATA_NOTICE}`)
  })

  it('never overwrites a record an editor has changed', async () => {
    const p = await getTestPayload()
    await seed(p)
    const home = await bySlug(p, 'pages', 'home')
    const page = await bySlug(p, 'pages', 'about')
    await p.update({ collection: 'pages', id: home.id, data: { title: 'Home (changed by an editor)' } })
    await p.update({ collection: 'pages', id: page.id, data: { intro: 'An intro an editor wrote.' } })
    expect(await seed(p)).toEqual({ created: 0, skipped: ALL_RECORDS })
    expect((await bySlug(p, 'pages', 'home')).title).toBe('Home (changed by an editor)')
    expect((await bySlug(p, 'pages', 'about')).intro).toBe('An intro an editor wrote.')
  })
})

// The fact sheet is Campus Cycle's: a renamed site (the recipes' R1) has facts of its own.
describe.runIf(EXAMPLE.campusCycle)('the seeded content agrees with the fact sheet', () => {
  beforeEach(resetAll)
  afterAll(resetAll)

  it('the Site facts equal the fact sheet, copied here by hand', async () => {
    const p = await getTestPayload()
    await seed(p)
    // The facts several pages share, in the Site facts global.
    expect(await p.findGlobal({ slug: 'site-facts' })).toMatchObject({
      pricingRule: FACT_SHEET.pricingRule,
      place: FACT_SHEET.place,
      email: FACT_SHEET.email,
    })
  })

  it('one source per fact: no page text repeats a price, the place, the e-mail or the pricing rule', async () => {
    const p = await getTestPayload()
    await seed(p)
    // Written out here, not taken from src/content/campus-cycle.ts, so the test does not share a
    // mistake with the seed. Any price at all ("EUR 15", "15 EUR", "€15", "25 euro"), not only today's
    // ones, and any group size ("groups of 6").
    const repeatedFacts = [
      /EUR\s*\d/i,
      /\d+\s*EUR\b/i,
      /€\s*\d/,
      /\d+\s*euros?\b/i,
      /at most 6 people/i,
      /\b6 people\b/i,
      /groups? of \d/i,
      /Workshop B, Student Centre/,
      /campuscycle\.example/i,
      /hello@/i,
      /Bring your own parts and pay/,
      /Tools, a tutor and standard parts are included/,
    ]
    const texts: [string, string][] = []
    // Every page with a text, Contact too: its .example note speaks of "the e-mail address above".
    for (const page of (await p.find({ collection: 'pages', limit: 10 })).docs) {
      if (page.body) texts.push([`page ${page.slug}`, html(page.body)])
    }
    expect(texts.map(([name]) => name).filter((name) => name.startsWith('page')).sort()).toEqual([
      'page about',
      'page contact',
      'page privacy',
    ])
    for (const [name, text] of texts) {
      for (const fact of repeatedFacts) expect(text, `${name} repeats ${fact}`).not.toMatch(fact)
    }
  })

  it('the Site facts are filled once and never overwritten by a later run', async () => {
    const p = await getTestPayload()
    await seed(p)
    await p.updateGlobal({ slug: 'site-facts', data: { place: 'Room 12 (changed by an editor)' }, overrideAccess: true })
    expect(await seed(p)).toEqual({ created: 0, skipped: ALL_RECORDS })
    expect((await p.findGlobal({ slug: 'site-facts' })).place).toBe('Room 12 (changed by an editor)')
  })

  it('the pages say only what is true of this site', async () => {
    const p = await getTestPayload()
    await seed(p)
    const home = await bySlug(p, 'pages', 'home')
    // The clinic is not in the seed (the home page says "The repair clinic opens soon"), so the
    // home page's own text does not promise it.
    expect(home.intro).not.toMatch(/clinic/i)
    const contact = await bySlug(p, 'pages', 'contact')
    expect(contact.intro).not.toContain('come by')
    expect(html(contact.body)).toContain(
      'This site is a practice project, so the e-mail address above is not a real one: it ends in .example, a name set aside for examples, and nothing sent to it arrives anywhere.',
    )
    // The HTML converter writes an apostrophe as &#39;.
    const privacy = html((await bySlug(p, 'pages', 'privacy')).body).replaceAll('&#39;', "'")
    expect(privacy).toContain(
      'This site sets cookies only for people who log in, such as an editor in /admin: one to keep them logged in, and one that remembers the look they chose for /admin.',
    )
    expect(privacy).toContain('a scrambled code made from your internet (IP) address, for one hour')
    expect(privacy).toContain('The address itself is not stored.')
    expect(privacy).toContain('If you have an account on this site, you can also see your own bookings after you log in.')
    // "bicycle repair", never "bicycle-repair", in every page.
    for (const page of (await p.find({ collection: 'pages', limit: 10 })).docs) {
      expect(JSON.stringify(page), page.slug).not.toContain('bicycle-repair')
    }
  })

  it('the photo credits link each photo to its Commons page and each licence to its text', async () => {
    const p = await getTestPayload()
    await seed(p)
    const about = html((await bySlug(p, 'pages', 'about')).body)
    for (const url of [
      'https://creativecommons.org/licenses/by-sa/3.0/',
      'https://creativecommons.org/licenses/by-sa/4.0/',
    ]) {
      expect(about).toContain(`<a href="${url}">`)
    }
    expect(about).toContain('<a href="https://commons.wikimedia.org/wiki/File:BicycleRepairTools.JPG">')
    expect(about.match(/<a href="https:\/\/commons\.wikimedia\.org\/wiki\/File:/g)).toHaveLength(2)
    expect(about).toContain('Each photo was resized from the original and is shared under its own licence, as listed.')
  })
})

describe('Blob storage on Vercel', () => {
  beforeEach(resetAll)
  afterAll(resetAll)

  it('on Vercel without a Blob store, stops with a plain message BEFORE creating any record', async () => {
    const p = await getTestPayload()
    await expect(seed(p, { env: { VERCEL: '1' } })).rejects.toThrow(NO_BLOB_STORE_MESSAGE)
    expect(NO_BLOB_STORE_MESSAGE).toBe(
      'Images cannot be stored: this Vercel project has no Blob store connected. In Vercel: Storage → Create Storage → Blob (Public), connect it to Production only, with its read-write token (Settings → Environment Variables then lists BLOB_READ_WRITE_TOKEN), then Redeploy.',
    )
    expect(await countAll(p)).toEqual({ pages: 0, media: 0, users: 0 })
  })

  it('needs no Blob store when there is no image to upload', async () => {
    const p = await getTestPayload()
    await seed(p)
    await expect(seed(p, { env: { VERCEL: '1' } })).resolves.toEqual({ created: 0, skipped: ALL_RECORDS })
  })
})

describe('the images are found by their base name', () => {
  beforeEach(resetAll)
  afterAll(resetAll)

  it('media records deleted but files kept: re-added once as name-1.jpg, then found again, never doubled', async () => {
    const p = await getTestPayload()
    await seed(p)
    // The records go, the files stay on disk: Payload then saves a new upload as clinic-tools-1.jpg.
    await resetCollections(['media'])
    expect((await seed(p)).created).toBe(2)
    const renamed = (await p.find({ collection: 'media', limit: 10 })).docs.map((media) => media.filename)
    expect(renamed).toContain('clinic-tools-1.jpg')
    // The next run finds clinic-tools-1.jpg as the clinic photo, and adds nothing.
    expect(await seed(p)).toEqual({ created: 0, skipped: ALL_RECORDS })
    expect(await count(p, 'media')).toBe(2)
  })
})

describe('runSeed: the example content is added once per database', () => {
  const originalEmail = process.env.FIRST_ADMIN_EMAIL
  const originalPassword = process.env.FIRST_ADMIN_PASSWORD
  let log: MockInstance<typeof console.log>
  beforeEach(async () => {
    await resetAll()
    process.env.FIRST_ADMIN_EMAIL = 'seed-test@campuscycle.example'
    process.env.FIRST_ADMIN_PASSWORD = 'test-password-0123456789'
    log = vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => {
    log.mockRestore()
    if (originalEmail === undefined) delete process.env.FIRST_ADMIN_EMAIL
    else process.env.FIRST_ADMIN_EMAIL = originalEmail
    if (originalPassword === undefined) delete process.env.FIRST_ADMIN_PASSWORD
    else process.env.FIRST_ADMIN_PASSWORD = originalPassword
  })
  afterAll(resetAll)

  const logged = () => log.mock.calls.map((call) => String(call[0]))

  it('after the first run, a later run creates nothing, even when an example record was deleted or renamed', async () => {
    const p = await getTestPayload()
    expect(await runSeed(p, { env: {} })).toMatchObject({ example: 'added', created: ALL_RECORDS })
    expect(await exampleWasAdded(p)).toBe(true)
    const privacy = await bySlug(p, 'pages', 'privacy')
    await p.delete({ collection: 'pages', id: privacy.id, overrideAccess: true })
    const about = await bySlug(p, 'pages', 'about')
    await p.update({ collection: 'pages', id: about.id, data: { slug: 'about-us' }, overrideAccess: true })

    log.mockClear()
    expect(await runSeed(p, { env: { VERCEL: '1' } })).toMatchObject({ example: 'skipped', created: 0 })
    expect(logged()).toEqual(["SEED: skipped (the example content was added before; your editors' changes are kept)"])
    expect(await count(p, 'pages')).toBe(3)
    expect((await p.find({ collection: 'pages', where: { slug: { equals: 'about' } } })).docs).toHaveLength(0)
  })

  it('on your own computer, the skipped line also says how to add back deleted example records', async () => {
    const p = await getTestPayload()
    await runSeed(p, { env: {} })
    log.mockClear()
    await runSeed(p, { env: {} })
    expect(logged()[0]).toBe("SEED: skipped (the example content was added before; your editors' changes are kept)")
    expect(logged()[1]).toContain('npm run seed -- --again')
  })

  it('--again adds back a deleted example record, overwrites nothing and leaves the flag set', async () => {
    const p = await getTestPayload()
    await runSeed(p, { env: {} })
    const privacy = await bySlug(p, 'pages', 'privacy')
    await p.delete({ collection: 'pages', id: privacy.id, overrideAccess: true })
    const about = await bySlug(p, 'pages', 'about')
    await p.update({ collection: 'pages', id: about.id, data: { title: 'About (changed by an editor)' }, overrideAccess: true })

    expect(await runSeed(p, { again: true, env: {} })).toMatchObject({ example: 'added', created: 1, skipped: ALL_RECORDS - 1 })
    expect(await count(p, 'pages')).toBe(4)
    expect((await bySlug(p, 'pages', 'about')).title).toBe('About (changed by an editor)')
    expect(await exampleWasAdded(p)).toBe(true)
    expect(logged().at(-1)).toMatch(/^SEED: created 1, kept 6 \(--again/)
  })

  it('ADD_EXAMPLE_CONTENT false: no content at all, but the first editor is still created', async () => {
    const p = await getTestPayload()
    expect(await runSeed(p, { addExampleContent: false, env: {} })).toMatchObject({ example: 'off', created: 0 })
    expect(await countAll(p)).toEqual({ pages: 0, media: 0, users: 1 })
    expect(logged()[0]).toContain('ADD_EXAMPLE_CONTENT')
  })

  it('a failing seed still leaves the first editor created: it is the first step', async () => {
    const p = await getTestPayload()
    // On Vercel without a Blob store: the seed stops before it creates anything.
    await expect(runSeed(p, { env: { VERCEL: '1' } })).rejects.toThrow(NO_BLOB_STORE_MESSAGE)
    expect(await countAll(p)).toEqual({ pages: 0, media: 0, users: 1 })
    expect(await exampleWasAdded(p)).toBe(false)
  })

  it('a first run that never finished: the next run creates only what is missing, then sets the flag', async () => {
    const p = await getTestPayload()
    // Everything was created, but the run stopped before it could write the flag; then a page was
    // deleted.
    await seed(p)
    expect(await exampleWasAdded(p)).toBe(false)
    const privacy = await bySlug(p, 'pages', 'privacy')
    await p.delete({ collection: 'pages', id: privacy.id, overrideAccess: true })

    expect(await runSeed(p, { env: {} })).toMatchObject({ example: 'added', created: 1, skipped: ALL_RECORDS - 1 })
    expect(await count(p, 'pages')).toBe(4)
    expect(await exampleWasAdded(p)).toBe(true)
  })
})
