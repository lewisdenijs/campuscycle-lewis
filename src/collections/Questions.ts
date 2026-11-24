import type { CollectionConfig } from 'payload'
import { publicContent } from '../access'

// A question users often ask, with its answer. The contact page shows them, in their order, so users
// find most answers without sending an e-mail.
export const Questions: CollectionConfig = {
  slug: 'questions',
  labels: { singular: 'Question', plural: 'Questions' },
  admin: { useAsTitle: 'question', defaultColumns: ['question', 'order'] },
  access: publicContent,
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: { description: 'Lower numbers come first on the contact page.' },
    },
  ],
}
