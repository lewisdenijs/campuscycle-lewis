// The home page. It shows what a user comes to do: book the repair clinic. Everything on it comes from
// the records editors keep in /admin (the home page's title and intro, the clinic, and the pricing rule
// in the Site facts global), never from a copy typed here, so a fact changed in /admin is right on
// every page at once.
import { getPayload } from 'payload'
import { ButtonLink } from '@/components/site/ButtonLink'
import { Hero } from '@/components/site/Hero'
import { Notice } from '@/components/site/Notice'
import { Badge } from '@/components/ui/badge'
import { SITE_NAME } from '@/content/campus-cycle'
import { formatWhen, imageFrom } from '@/lib/format'
import config from '@/payload.config'

// Read the database on every visit, never once while the site is built: editors' changes then show
// at once, and the build needs no database.
export const dynamic = 'force-dynamic'

// The home page's picture, from the media library. To use another one, upload it in /admin and put
// its file name here.
const HOME_IMAGE = 'workshop-tools'

export default async function HomePage() {
  const payload = await getPayload({ config })
  // One after the other, not all at once: simple to read, and quick enough for a page this small.
  const home = (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })).docs[0]
  const picture = (await payload.find({ collection: 'media', where: { filename: { contains: HOME_IMAGE } }, limit: 1 })).docs[0]
  // The newest clinic: the one a user can book now.
  const clinic = (await payload.find({ collection: 'clinics', sort: '-createdAt', depth: 0, limit: 1 })).docs[0]
  // The facts several pages share, such as the pricing rule (src/globals/SiteFacts.ts).
  const facts = await payload.findGlobal({ slug: 'site-facts', depth: 0 })

  return (
    <div className="grid gap-section pt-6 sm:pt-10">
      <Hero
        title={home?.title ?? SITE_NAME}
        text={home?.intro}
        image={imageFrom(picture)}
        actions={
          <ButtonLink href={clinic ? `/clinics/${clinic.slug}` : '/clinics'} size="lg">
            Repair clinic
          </ButtonLink>
        }
      />

      <section aria-labelledby="clinic" className="grid gap-block">
        <div className="framed grid content-start gap-4 p-6 offset-coral sm:p-8">
          <Badge tone="coral">Let us fix it</Badge>
          <h2 id="clinic" className="text-2xl">Repair clinic</h2>
          {clinic ? (
            <>
              <p className="font-semibold">{clinic.name} · {formatWhen(clinic)}</p>
              <p>{clinic.summary}</p>
              <ButtonLink href={`/clinics/${clinic.slug}`} className="w-fit">Book a time slot</ButtonLink>
            </>
          ) : (
            <>
              <p className="font-semibold">The repair clinic opens soon</p>
              <p>When it opens, you can book a time slot here and bring your bicycle for a check or a repair.</p>
            </>
          )}
        </div>
        {facts.pricingRule && (
          <Notice>
            <p>{facts.pricingRule}</p>
          </Notice>
        )}
      </section>
    </div>
  )
}
