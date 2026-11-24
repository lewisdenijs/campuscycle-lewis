// The home page. It shows the two things a user comes to do: find the repair for their device, and
// book a time at the repair café. Everything on it comes from the records editors keep in /admin (the
// home page's title and intro, the devices, the repairs, the repair café, the volunteers and the
// pricing rule in the Site facts global), never from a copy typed here, so a fact changed in /admin is
// right on every page at once.
import { CalendarCheck, ScanSearch, Wrench } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ButtonLink } from '@/components/site/ButtonLink'
import { DeviceIcon } from '@/components/site/DeviceIcon'
import { Hero } from '@/components/site/Hero'
import { SITE_NAME } from '@/content/campus-cycle'
import { formatWhen, imageFrom } from '@/lib/format'
import { priceInWords } from '@/lib/repairs'
import config from '@/payload.config'

// Read the database on every visit, never once while the site is built: editors' changes then show
// at once, and the build needs no database.
export const dynamic = 'force-dynamic'

// The home page's picture, from the media library. To use another one, upload it in /admin and put
// its file name here.
const HOME_IMAGE = 'cracked-phone-screen'

// How a visit goes, in three steps. Fixed words, not content: they describe how the site works.
const STEPS = [
  { icon: ScanSearch, title: 'Find your repair', text: 'Choose your device and see what we fix, what it costs and how long it takes.' },
  { icon: CalendarCheck, title: 'Book a time', text: 'Pick a Saturday time at the repair café and tick what needs fixing.' },
  { icon: Wrench, title: 'Watch it get fixed', text: 'A volunteer repairs it with you at the table. You pay only when it works.' },
]

export default async function HomePage() {
  const payload = await getPayload({ config })
  const home = (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })).docs[0]
  const picture = (await payload.find({ collection: 'media', where: { filename: { contains: HOME_IMAGE } }, limit: 1 })).docs[0]
  const clinic = (await payload.find({ collection: 'clinics', sort: '-createdAt', depth: 0, limit: 1 })).docs[0]
  const facts = await payload.findGlobal({ slug: 'site-facts', depth: 0 })
  // The devices, each with its repairs (the join), for the "What do you bring?" tiles.
  const devices = (
    await payload.find({ collection: 'devices', sort: 'name', depth: 1, limit: 20, joins: { repairs: { limit: 100 } } })
  ).docs
  const repairs = (await payload.find({ collection: 'services', sort: 'price', depth: 0, limit: 100 })).docs
  const fixers = (await payload.find({ collection: 'fixers', sort: 'name', depth: 0, limit: 6 })).docs
  // The three repairs users ask for most often: the ones with a price, the cheapest first.
  const popular = repairs.filter((repair) => repair.price > 0).slice(0, 3)
  const cheapest = repairs.filter((repair) => repair.price > 0)[0]
  const bookHref = clinic ? `/repair-cafe/${clinic.slug}` : '/repair-cafe'

  return (
    <div className="grid gap-section pt-6 sm:pt-10">
      <Hero
        title={home?.title ?? SITE_NAME}
        text={home?.intro}
        image={imageFrom(picture)}
        actions={
          <>
            <ButtonLink href="/repairs" size="lg">
              Find your repair
            </ButtonLink>
            <ButtonLink href={bookHref} size="lg" variant="secondary">
              Book a time slot
            </ButtonLink>
          </>
        }
        facts={[
          { value: String(repairs.length), label: 'kinds of repair' },
          { value: cheapest ? priceInWords(cheapest.price) : 'Free', label: cheapest ? 'cheapest repair' : 'device check' },
          { value: clinic ? clinic.startTime : 'Soon', label: clinic ? `${clinic.day}s` : 'opening' },
        ]}
      />

      <section aria-labelledby="how" className="grid gap-block">
        <div className="grid gap-2">
          <p className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">How it works</p>
          <h2 id="how" className="text-3xl">Three steps to a working device</h2>
        </div>
        {/* On a phone the steps swipe sideways, one card at a time (scroll-snap); from md up, three columns. */}
        <ol className="flex snap-x snap-mandatory gap-4 overflow-x-auto pr-3 pb-4 [scrollbar-width:thin] md:grid md:grid-cols-3 md:gap-block md:overflow-visible md:pr-0 md:pb-0">
          {STEPS.map((step, index) => (
            <li key={step.title} className="framed grid w-[82%] shrink-0 snap-start content-start gap-3 p-6 offset-ink [--offset-size:6px] md:w-auto">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-control border-2 border-ink bg-coral">
                  <step.icon aria-hidden="true" className="size-6" />
                </span>
                <span aria-hidden="true" className="font-heading text-5xl font-bold text-ink-soft/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-xl">{step.title}</h3>
              <p className="text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {devices.length > 0 && (
        <section aria-labelledby="devices" className="grid gap-block">
          <div className="grid gap-2">
            <p className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">What do you bring?</p>
            <h2 id="devices" className="text-3xl">Choose your device</h2>
          </div>
          {/* The devices swipe sideways on a phone too; from sm up, a grid. */}
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pr-3 pb-4 [scrollbar-width:thin] sm:grid sm:grid-cols-2 sm:gap-block sm:overflow-visible sm:pr-0 sm:pb-0 lg:grid-cols-4">
            {devices.map((device) => {
              const its = (device.repairs?.docs ?? []).filter((repair) => typeof repair === 'object')
              const paid = its.map((repair) => repair.price).filter((price) => price > 0)
              return (
                <li key={device.id} className="grid w-[70%] shrink-0 snap-start sm:w-auto">
                  <Link
                    href={`/devices/${device.slug}`}
                    className="framed group grid content-start gap-4 p-6 text-ink no-underline offset-coral transition-[translate,box-shadow] hover:-translate-y-1 hover:[--offset-size:10px]"
                  >
                    <span className="grid size-14 place-items-center rounded-full bg-mint-tint">
                      <DeviceIcon slug={device.slug} className="size-7" />
                    </span>
                    <span className="font-heading text-2xl font-bold">{device.name}</span>
                    <span className="text-ink-soft">
                      {its.length} {its.length === 1 ? 'repair' : 'repairs'}
                      {paid.length > 0 && <>, from {priceInWords(Math.min(...paid))}</>}
                    </span>
                    <span className="font-semibold underline underline-offset-4 group-hover:decoration-2">See the repairs</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {popular.length > 0 && (
        <section aria-labelledby="popular" className="grid gap-block lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div className="grid gap-3">
            <p className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">Clear prices</p>
            <h2 id="popular" className="text-3xl">You know the price before you come</h2>
            {facts.pricingRule && <p className="max-w-[46ch] text-lg">{facts.pricingRule}</p>}
            <ButtonLink href="/repairs" variant="secondary" className="w-fit">
              All repairs and prices
            </ButtonLink>
          </div>
          <ul className="framed grid divide-y-2 divide-ink overflow-hidden offset-mint [--offset-size:8px]">
            {popular.map((repair) => (
              <li key={repair.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-5">
                <div className="grid gap-1">
                  <Link href={`/repairs/${repair.slug}`} className="font-heading text-xl font-bold text-ink">
                    {repair.name}
                  </Link>
                  <span className="text-ink-soft">about {repair.minutes} minutes</span>
                </div>
                <span className="rounded-control border-2 border-ink bg-yellow-tint px-3 py-1 font-heading text-xl font-bold">
                  {priceInWords(repair.price)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="clinic" className="grid-paper grid gap-block rounded-panel border-2 border-ink bg-coral-wash p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="grid gap-4">
          <p className="text-sm font-bold tracking-[0.08em] text-ink-soft uppercase">The repair café</p>
          <h2 id="clinic" className="text-3xl">
            {clinic ? <>{clinic.name}</> : 'The repair café opens soon'}
          </h2>
          {clinic ? (
            <>
              <p className="font-heading text-xl font-bold">{formatWhen(clinic)}</p>
              <p className="max-w-[52ch]">{clinic.summary}</p>
              <ButtonLink href={bookHref} size="lg" className="w-fit">
                Book a time slot
              </ButtonLink>
            </>
          ) : (
            <p>When it opens, you can book a time slot here and bring your device for a check or a repair.</p>
          )}
        </div>
        {fixers.length > 0 && (
          <div className="grid gap-3">
            <h3 className="text-xl">Our volunteers</h3>
            <ul className="grid gap-3">
              {fixers.map((fixer) => (
                <li key={fixer.id} className="flex items-center gap-3 rounded-frame border-2 border-ink bg-paper p-3">
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-heading text-lg font-bold text-mint">
                    {fixer.name.slice(0, 1)}
                  </span>
                  <span className="grid">
                    <span className="font-bold">{fixer.name}</span>
                    <span className="text-sm text-ink-soft">{fixer.bio.split('.')[0]}.</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="w-fit font-semibold">
              Meet the volunteers
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
