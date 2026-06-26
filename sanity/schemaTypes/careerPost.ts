import { defineField, defineType } from 'sanity'

export const careerPost = defineType({
  name:  'careerPost',
  title: 'Career Post',
  type:  'document',
  fields: [
    defineField({ name: 'title',    title: 'Job title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',     title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name:    'type',
      title:   'Employment type',
      type:    'string',
      options: { list: [{ title: 'Full-time', value: 'full-time' }, { title: 'Contract', value: 'contract' }], layout: 'radio' },
    }),
    defineField({
      name:  'body',
      title: 'Job description',
      type:  'array',
      of:    [{ type: 'block' }],
    }),
    defineField({ name: 'active',     title: 'Active (visible on site)', type: 'boolean', initialValue: true }),
    defineField({ name: 'postedDate', title: 'Posted date', type: 'date' }),
  ],
  orderings: [{ title: 'Newest first', name: 'postedDateDesc', by: [{ field: 'postedDate', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'type' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `${subtitle ?? ''} · ${subtitle ? '' : ''}` }),
  },
})
