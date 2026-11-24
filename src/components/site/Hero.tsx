// What this is: the big opening of the home page: a short line above the title (the tagline), the
// title, one or two sentences, the main actions, a row of facts and a photo. No slideshow: one clear
// message and the two things a user comes to do. On a phone the photo goes below the text.
//
// Fixpoint's own look: a dark "circuit board" panel (the utilities circuit and on-dark in globals.css),
// the title's last word under an orange marker, and the photo in a frame with a lime offset.
//
// What to change for your own site: the TAGLINE below. The title, text and photo come from the home
// page's record and the media library in /admin; the actions and facts from src/app/(site)/page.tsx.
import Image from 'next/image'
import type { ReactNode } from 'react'

// W4: put your own name in this tagline
const TAGLINE = 'Repairs while you wait, by volunteers · a site by Lewis'

type HeroProps = {
  title: string
  text?: string | null
  actions?: ReactNode
  // Short facts under the actions, such as "8 repairs" or "Saturdays 13:00–17:00".
  facts?: { value: string; label: string }[]
  image?: { src: string; alt: string; width: number; height: number } | null
}

export function Hero({ title, text, actions, facts, image }: HeroProps) {
  // The marker goes under the title's last word; a one-word title gets it under that word.
  const words = title.trim().split(/\s+/)
  const last = words.pop()
  return (
    <section className="circuit on-dark relative grid items-center gap-block overflow-hidden rounded-panel p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-14">
      <div className="grid gap-5">
        <p className="w-fit rounded-full border border-canvas/30 px-3 py-1 text-sm font-bold tracking-[0.08em] uppercase">
          <span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-mint align-middle" />
          {TAGLINE}
        </p>
        <h1 className="text-4xl">
          {words.length > 0 && <>{words.join(' ')} </>}
          <span className="marker text-canvas">{last}</span>
        </h1>
        {text && <p className="max-w-[46ch] text-lg text-canvas/85">{text}</p>}
        {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
        {facts && facts.length > 0 && (
          <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-canvas/20 pt-5">
            {facts.map((fact) => (
              <div key={fact.label} className="grid">
                <dt className="order-2 text-sm text-canvas/70">{fact.label}</dt>
                <dd className="order-1 font-heading text-2xl font-bold text-mint">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {image && (
        <div className="relative">
          <div className="framed relative aspect-[4/3] overflow-hidden border-canvas offset-mint [--offset-size:12px] lg:rotate-2">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="object-cover"
            />
          </div>
          <p
            aria-hidden="true"
            className="absolute -bottom-3 -left-3 rounded-control border-2 border-ink bg-coral px-3 py-1 font-heading font-bold text-ink lg:-rotate-3"
          >
            Repaired at the table
          </p>
        </div>
      )}
    </section>
  )
}
