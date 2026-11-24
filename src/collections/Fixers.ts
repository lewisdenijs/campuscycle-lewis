import type { CollectionConfig } from 'payload'
import { publicContent } from '../access'

// A volunteer who repairs devices at the café. Made-up people only: this is a practice project. The
// about page lists them with the repairs each one does.
export const Fixers: CollectionConfig = {
  slug: 'fixers',
  labels: { singular: 'Fixer', plural: 'Fixers' },
  admin: { useAsTitle: 'name' },
  access: publicContent,
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'A first name only.' } },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      admin: { description: 'One or two sentences: who they are and what they like to fix.' },
    },
    { name: 'repairs', type: 'relationship', relationTo: 'services', hasMany: true },
  ],
}
