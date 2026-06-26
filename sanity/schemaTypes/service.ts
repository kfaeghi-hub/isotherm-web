import { defineField, defineType } from 'sanity'

const seoFields = [
  defineField({ name: 'metaTitle',       type: 'string', title: 'Meta title' }),
  defineField({ name: 'metaDescription', type: 'text',   title: 'Meta description', rows: 3 }),
  defineField({ name: 'ogImage',         type: 'image',  title: 'OG image' }),
]

export const service = defineType({
  name:  'service',
  title: 'Service',
  type:  'document',
  fields: [
    defineField({ name: 'title',  title: 'Title',  type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',   title: 'Slug',   type: 'slug',   options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name:  'category',
      title: 'Category',
      type:  'reference',
      to:    [{ type: 'serviceCategory' }],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({
      name:  'body',
      title: 'Body',
      type:  'array',
      of:    [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'image', title: 'Featured image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'seo', title: 'SEO', type: 'object', fields: seoFields }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'category.title', media: 'image' },
  },
})
