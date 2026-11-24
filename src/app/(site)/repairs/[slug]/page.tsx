// One repair, /repairs/<slug>: what happens, the price, how long it takes, and the devices it is for.
// The devices are one side of the many-to-many; each device's page (/devices/<slug>) shows the other.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'
import { ButtonLink } from '@/components/site/ButtonLink'
import { PageTitle } from '@/components/site/PageTitle'
import { ParentLink } from '@/components/site/ParentLink'
import { priceInWords } from '@/lib/repairs'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

// cache(): the page and its browser-tab title ask for the same record once per visit.
const findRepair = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const found = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, depth: 1, limit: 1 })
  return found.docs[0]
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const repair = await findRepair((await params).slug)
  return repair ? { title: repair.name, description: repair.summary } : {}
}

export default async function RepairPage({ params }: Props) {
  const repair = await findRepair((await params).slug)
  if (!repair) notFound()
  const devices = (repair.devices ?? []).filter((item) => typeof item === 'object')
  const payload = await getPayload({ config })
  // The repair café to book at: the most recent one.
  const cafe = (await payload.find({ collection: 'clinics', sort: '-createdAt', depth: 0, limit: 1, joins: false })).docs[0]

  return (
    <article className="pb-6">
      <ParentLink href="/repairs" label="Repairs" current={repair.name} />
      <PageTitle title={repair.name} intro={repair.summary} className="mt-3 sm:mt-4" />

      <div className="grid gap-block lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section aria-labelledby="facts" className="framed grid gap-4 p-6 offset-coral lg:col-start-2 lg:row-start-1">
          <h2 id="facts" className="text-xl">At a glance</h2>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2">
            <dt className="text-ink-soft">Price</dt>
            <dd className="font-semibold">{priceInWords(repair.price)}</dd>
            <dt className="text-ink-soft">Takes</dt>
            <dd className="font-semibold">about {repair.minutes} minutes</dd>
          </dl>
          <ButtonLink href={cafe ? `/repair-cafe/${cafe.slug}` : '/repair-cafe'} className="w-fit">
            Book a time slot
          </ButtonLink>
        </section>

        <div className="grid content-start gap-block lg:col-start-1 lg:row-start-1">
          <section aria-labelledby="what" className="grid gap-3">
            <h2 id="what" className="text-2xl">What we do</h2>
            <p className="max-w-(--container-reading)">{repair.details}</p>
          </section>
          <section aria-labelledby="devices" className="grid gap-3">
            <h2 id="devices" className="text-2xl">For these devices</h2>
            <ul className="grid list-disc gap-1 pl-5">
              {devices.map((device) => (
                <li key={device.id}>
                  <Link href={`/devices/${device.slug}`}>{device.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  )
}
