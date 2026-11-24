import type { CollectionConfig } from 'payload'
import { publicContent } from '../access'
import { checkUniqueSlug } from '../lib/modelIntegrity'
import { slug } from './fields'

// A kind of device users bring to the repair café, such as a smartphone or a laptop. Users filter the
// repairs by device. One device has many repairs and one repair fits many devices: the many-to-many
// is stored once, on each repair (its "devices" field); `repairs` below reads it back with a join.
export const Devices: CollectionConfig = {
  slug: 'devices',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  access: publicContent,
  hooks: { beforeChange: [checkUniqueSlug] },
  fields: [
    { name: 'name', type: 'text', required: true },
    slug,
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'One or two sentences for the device page: what we can and cannot fix on it.' },
    },
    // The other side of the many-to-many: every repair that lists this device.
    { name: 'repairs', type: 'join', collection: 'services', on: 'devices' },
  ],
}
