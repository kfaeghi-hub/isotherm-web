import { defineField, defineType } from 'sanity'

export const serviceCategory = defineType({
  name:  'serviceCategory',
  title: 'Service Category',
  type:  'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',  title: 'Slug',  type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'shortDescription', title: 'Short description', type: 'text', rows: 2 }),
    defineField({ name: 'icon', title: 'Icon / image', type: 'image', options: { hotspot: true } }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'shortDescription' },
  },
})
