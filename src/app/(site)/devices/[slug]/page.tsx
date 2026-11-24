// One device, /devices/<slug>: the other side of the many-to-many. It lists every repair for this
// device, read through the join on devices (src/collections/Devices.ts).
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'
import { ButtonLink } from '@/components/site/ButtonLink'
import { FramedCard } from '@/components/site/FramedCard'
import { PageTitle } from '@/components/site/PageTitle'
import { ParentLink } from '@/components/site/ParentLink'
import { priceInWords } from '@/lib/repairs'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

// cache(): the page and its browser-tab title ask for the same record once per visit.
const findDevice = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'devices',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    joins: { repairs: { limit: 100, sort: 'price' } },
  })
  return found.docs[0]
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const device = await findDevice((await params).slug)
  return device ? { title: `${device.name} repairs`, description: device.description } : {}
}

export default async function DevicePage({ params }: Props) {
  const device = await findDevice((await params).slug)
  if (!device) notFound()
  const repairs = (device.repairs?.docs ?? []).filter((repair) => typeof repair === 'object')

  return (
    <article className="grid gap-block pb-6">
      <div>
        <ParentLink href="/repairs" label="Repairs" current={device.name} />
        <PageTitle title={`${device.name} repairs`} intro={device.description} className="mt-3 sm:mt-4" />
      </div>
      <section aria-labelledby="repairs" className="grid gap-block">
        <h2 id="repairs" className="text-2xl">
          {repairs.length === 0 ? 'No repairs listed yet' : `What we fix on a ${device.name.toLowerCase()}`}
        </h2>
        <ul className="grid max-w-3xl gap-block">
          {repairs.map((repair) => (
            <li key={repair.id} className="grid">
              <FramedCard title={repair.name} href={`/repairs/${repair.slug}`} accent="coral" headingLevel="h3">
                <p className="font-semibold">
                  {priceInWords(repair.price)} · about {repair.minutes} minutes
                </p>
                <p>{repair.summary}</p>
              </FramedCard>
            </li>
          ))}
        </ul>
        <ButtonLink href={`/repairs?device=${device.slug}#results`} variant="secondary" className="w-fit">
          Compare these repairs
        </ButtonLink>
      </section>
    </article>
  )
}
