// A small picture for each kind of device, from the icon set the site already uses (lucide-react).
// The icon only decorates: the device's name is always written next to it, so it is hidden from
// screen readers (aria-hidden). A device an editor adds later gets the wrench.
import { Headphones, Laptop, Smartphone, Tablet, Wrench, type LucideProps } from 'lucide-react'

const ICONS: Record<string, typeof Wrench> = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  headphones: Headphones,
}

export function DeviceIcon({ slug, ...props }: { slug: string } & LucideProps) {
  const Icon = ICONS[slug] ?? Wrench
  return <Icon aria-hidden="true" strokeWidth={2} {...props} />
}
