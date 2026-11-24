// The frame around every public page: the font, the colours (globals.css), the header with the menu,
// the page itself in <main>, and the footer. The admin (/admin) has its own frame in (payload).
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Hanken_Grotesk, Space_Grotesk } from 'next/font/google'
import type { ReactNode } from 'react'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { SITE_TITLE } from '@/content/campus-cycle'
import './globals.css'

// Hanken Grotesk, free to share (SIL Open Font Licence). next/font downloads it once, while the site is
// built, and serves it from this site itself: no request to Google from the user's browser.
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hanken-grotesk',
})

// Space Grotesk for headings (SIL Open Font Licence): Fixpoint's technical look (globals.css).
const space = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  // The site's name on the home page's tab; every other page gives its own part, and the name is added
  // after it (src/content/campus-cycle.ts, SITE_TITLE).
  title: SITE_TITLE,
  description:
    'Fixpoint: a repair café for phones, tablets, laptops and headphones at the college. A fictional site for the course Building better websites.',
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${space.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        {/* tabIndex -1: the skip link can move the keyboard's focus here in every browser. It is not a
            stop for Tab, and it is not a control, so it shows no focus ring (not for a mouse click either). */}
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-page flex-1 px-gutter focus:outline-none">
          {children}
        </main>
        <Footer />
        {/* Page views for Vercel Web Analytics, only when NEXT_PUBLIC_ANALYTICS is "vercel" (see
            src/lib/analytics.ts). Without it, the site loads no analytics script at all. */}
        {process.env.NEXT_PUBLIC_ANALYTICS === 'vercel' && <Analytics />}
      </body>
    </html>
  )
}
