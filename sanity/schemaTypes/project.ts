import { defineField, defineType } from 'sanity'

const seoFields = [
  defineField({ name: 'metaTitle',       type: 'string', title: 'Meta title' }),
  defineField({ name: 'metaDescription', type: 'text',   title: 'Meta description', rows: 3 }),
  defineField({ name: 'ogImage',         type: 'image',  title: 'OG image' }),
]

const CX_TYPES = [
  { title: 'New Construction Cx (NCx)',     value: 'NCx' },
  { title: 'Existing Building Cx (EBCx)',   value: 'EBCx' },
  { title: 'Retro-Cx (RCx)',               value: 'RCx' },
  { title: 'Ongoing Cx (OCx)',              value: 'OCx' },
  { title: 'Recommissioning',               value: 'Recommissioning' },
  { title: 'Integrated Systems Testing (IST)', value: 'IST' },
]

export const project = defineType({
  name:  'project',
  title: 'Project',
  type:  'document',
  fields: [
    defineField({ name: 'title',  title: 'Title',  type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',   title: 'Slug',   type: 'slug',   options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'client', title: 'Client', type: 'string' }),
    defineField({
      name:    'cxType',
      title:   'Cx Type',
      type:    'string',
      options: { list: CX_TYPES, layout: 'dropdown' },
      validation: (r) => r.required(),
    }),
    defineField({
      name:  'images',
      title: 'Images',
      type:  'array',
      of:    [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3 }),
    defineField({
      name:  'body',
      title: 'Body',
      type:  'array',
      of:    [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'featured', title: 'Featured on homepage?', type: 'boolean', initialValue: false }),
    defineField({ name: 'order',    title: 'Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'seo', title: 'SEO', type: 'object', fields: seoFields }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'cxType', media: 'images.0' },
  },
})
