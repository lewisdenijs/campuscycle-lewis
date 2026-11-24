import type { CollectionConfig } from 'payload'
import { publicContent } from '../access'
import { checkUniqueSlug } from '../lib/modelIntegrity'
import { slug } from './fields'

// A repair the café offers, such as a new phone battery or a laptop clean-up, with its price. Users
// find the repairs for their device on /repairs and choose them when they book a time slot.
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Repair', plural: 'Repairs' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'price', 'minutes'] },
  access: publicContent,
  hooks: { beforeChange: [checkUniqueSlug] },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true },
    slug,
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'One sentence: what we do. Shown in the list of repairs.' },
    },
    {
      name: 'details',
      type: 'textarea',
      required: true,
      admin: { description: 'What happens during the repair, and what the user should know first.' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'In euros, parts included. 0 means free.' },
    },
    {
      name: 'minutes',
      type: 'number',
      required: true,
      min: 5,
      admin: { description: 'About how long the repair takes, in minutes.' },
    },
    // The many-to-many: the devices this repair is for. Stored here once; each device reads it back.
    { name: 'devices', type: 'relationship', relationTo: 'devices', hasMany: true, required: true },
  ],
}
