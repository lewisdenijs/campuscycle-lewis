// The repairs, /repairs: task 1, "find the repair for your device". The filter is in the address:
// /repairs?device=laptop lists only the repairs for laptops. It is a plain form that sends with GET, so
// it works without JavaScript, the Back button returns to it, and a filtered list can be shared.
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { ButtonLink } from '@/components/site/ButtonLink'
import { FramedCard } from '@/components/site/FramedCard'
import { Notice } from '@/components/site/Notice'
import { PageTitle } from '@/components/site/PageTitle'
import Link from 'next/link'
import { DeviceIcon } from '@/components/site/DeviceIcon'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { priceInWords } from '@/lib/repairs'
import { cn } from '@/lib/utils'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

// The address's ?device=... (Next.js passes it; a test may call the page without it).
type Props = { searchParams?: Promise<{ device?: string }> }

export async function generateMetadata({ searchParams }: Props = {}): Promise<Metadata> {
  const { device = '' } = (await searchParams) ?? {}
  const payload = await getPayload({ config })
  const chosen = device
    ? (await payload.find({ collection: 'devices', where: { slug: { equals: device } }, depth: 0, limit: 1 })).docs[0]
    : undefined
  return {
    title: chosen ? `Repairs for your ${chosen.name.toLowerCase()}` : 'Repairs',
    description: 'Find the repair for your phone, tablet, laptop or headphones, with its price and how long it takes.',
  }
}

export default async function RepairsPage({ searchParams }: Props = {}) {
  const { device = '' } = (await searchParams) ?? {}
  const payload = await getPayload({ config })
  // The choices for the filter, and the one chosen (none when the address names no known device).
  const devices = (await payload.find({ collection: 'devices', sort: 'name', depth: 0, limit: 100 })).docs
  const chosen = devices.find((item) => item.slug === device)
  const repairs = (
    await payload.find({
      collection: 'services',
      where: chosen ? { devices: { in: [chosen.id] } } : {},
      sort: 'price',
      depth: 1,
      limit: 100,
    })
  ).docs

  return (
    <div className="grid gap-block pb-6">
      <PageTitle
        title="Repairs"
        intro="Choose your device to see what we can fix, what it costs and how long it takes. Then book a time slot at the repair café."
      />

      {/* One-tap choices: each link is the same filter as the form below, already chosen. */}
      <nav aria-label="Repairs by device">
        <ul className="flex flex-wrap gap-3">
          {devices.map((item) => (
            <li key={item.id}>
              <Link
                href={`/repairs?device=${item.slug}#results`}
                aria-current={item.slug === chosen?.slug ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-semibold no-underline',
                  item.slug === chosen?.slug ? 'bg-ink text-canvas' : 'bg-paper text-ink hover:bg-mint-tint',
                )}
              >
                <DeviceIcon slug={item.slug} className="size-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <form method="get" action="/repairs#results" className="flex flex-wrap items-end gap-3">
        <div className="grid gap-2">
          <Label htmlFor="device">Your device</Label>
          <NativeSelect id="device" name="device" defaultValue={chosen?.slug ?? ''}>
            <NativeSelectOption value="">All devices</NativeSelectOption>
            {devices.map((item) => (
              <NativeSelectOption key={item.id} value={item.slug}>
                {item.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <Button type="submit">Show repairs</Button>
      </form>

      <section id="results" aria-labelledby="results-heading" className="grid gap-block">
        {/* role="status": a screen reader reads out how many repairs the filter left. */}
        <h2 id="results-heading" role="status" className="text-2xl">
          {chosen
            ? `Repairs for your ${chosen.name.toLowerCase()}: ${repairs.length}`
            : `All repairs: ${repairs.length}`}
        </h2>

        {repairs.length === 0 ? (
          <Notice tone="warning" label="No repairs" className="max-w-3xl">
            <p>We have no repairs listed for this device yet. Book a free device check at the repair café instead.</p>
            <ButtonLink href="/repairs" variant="secondary" className="mt-2 w-fit">Show all repairs</ButtonLink>
          </Notice>
        ) : (
          <ul className="grid max-w-3xl gap-block">
            {repairs.map((repair) => (
              <li key={repair.id} className="grid">
                <FramedCard title={repair.name} href={`/repairs/${repair.slug}`} accent="coral" headingLevel="h3">
                  <p className="font-semibold">
                    {priceInWords(repair.price)} · about {repair.minutes} minutes
                  </p>
                  <p>{repair.summary}</p>
                  <p className="text-ink-soft">
                    For:{' '}
                    {(repair.devices ?? [])
                      .map((item) => (typeof item === 'object' ? item.name : null))
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </FramedCard>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
