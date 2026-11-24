// The about page, /about: its text from the page record "about" (edited in /admin → Pages), and the
// volunteers from their own collection (src/collections/Fixers.ts), each with the repairs they do.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { PlainPage } from '@/components/site/PlainPage'
import { findPage, pageMetadata } from '@/lib/pages'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await findPage('about'))
}

export default async function AboutPage() {
  const page = await findPage('about')
  if (!page) notFound()
  const payload = await getPayload({ config })
  const fixers = (await payload.find({ collection: 'fixers', sort: 'name', depth: 1, limit: 50 })).docs

  return (
    <PlainPage page={page}>
      {fixers.length > 0 && (
        <section aria-labelledby="fixers" className="grid max-w-(--container-reading) gap-4">
          <h2 id="fixers" className="text-2xl">Our volunteers</h2>
          <ul className="grid gap-4">
            {fixers.map((fixer) => {
              const repairs = (fixer.repairs ?? []).filter((repair) => typeof repair === 'object')
              return (
                <li key={fixer.id} className="grid gap-1">
                  <h3 className="text-xl">{fixer.name}</h3>
                  <p>{fixer.bio}</p>
                  {repairs.length > 0 && (
                    <p className="text-ink-soft">
                      Repairs:{' '}
                      {repairs.map((repair, index) => (
                        <span key={repair.id}>
                          {index > 0 && ', '}
                          <Link href={`/repairs/${repair.slug}`}>{repair.name}</Link>
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </PlainPage>
  )
}
