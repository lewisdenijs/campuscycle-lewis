// The repair clinic's list page, where the menu's "Repair café" link goes. It lists every clinic
// with a link to its own page. Until an editor adds a clinic in /admin, it says so honestly and
// explains what the clinic will be, instead of showing an empty page.
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { ButtonLink } from '@/components/site/ButtonLink'
import { FramedCard } from '@/components/site/FramedCard'
import { Notice } from '@/components/site/Notice'
import { PageTitle } from '@/components/site/PageTitle'
import { formatWhen, imageFrom } from '@/lib/format'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

// The clinic's picture, from the media library (the seed uploads it). To use another one, upload it
// in /admin and put its file name here.
const CLINIC_IMAGE = 'laptop-memory'

export const metadata: Metadata = {
  title: 'Repair café',
  description: 'Book a time slot at the Fixpoint repair café and bring your phone, tablet, laptop or headphones for a check or a repair.',
}

export default async function ClinicsPage() {
  const payload = await getPayload({ config })
  // Newest first: the clinic added last is usually the one that is on now.
  const clinics = (await payload.find({ collection: 'clinics', sort: '-createdAt', depth: 0, limit: 20 })).docs
  const picture = (await payload.find({ collection: 'media', where: { filename: { contains: CLINIC_IMAGE } }, limit: 1 })).docs[0]

  return (
    <div className="pb-6">
      <PageTitle
        title="Repair café"
        intro="Bring your phone, tablet, laptop or headphones on a Saturday afternoon. Book a time slot first, so a volunteer is free for you and the right parts are ready."
        image={imageFrom(picture)}
      />
      {clinics.length === 0 ? (
        <Notice tone="warning" label="Not open yet" className="max-w-3xl">
          <p className="font-heading text-xl font-extrabold">The repair café opens soon</p>
          <p>When it opens, you can book a time slot on this page and bring your device for a check or a repair.</p>
        </Notice>
      ) : (
        <ul className="grid max-w-3xl gap-block">
          {clinics.map((clinic) => (
            <li key={clinic.id} className="grid">
              <FramedCard title={clinic.name} href={`/repair-cafe/${clinic.slug}`} accent="coral" headingLevel="h2">
                <p className="font-semibold">{formatWhen(clinic)}</p>
                <p>{clinic.summary}</p>
                <ButtonLink href={`/repair-cafe/${clinic.slug}`} className="w-fit">Book a time slot</ButtonLink>
              </FramedCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
