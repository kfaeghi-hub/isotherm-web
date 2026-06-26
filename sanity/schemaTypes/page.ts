import { defineField, defineType } from 'sanity'

export const page = defineType({
  name:  'page',
  title: 'Page',
  type:  'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',  title: 'Slug',  type: 'slug',   options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name:  'sections',
      title: 'Content sections',
      type:  'array',
      of: [
        // Rich text block
        { type: 'block' },
        // Standalone image with optional caption
        {
          type:   'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            defineField({ name: 'alt',     title: 'Alt text', type: 'string' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
