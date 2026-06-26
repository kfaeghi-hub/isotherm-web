import { defineField, defineType } from 'sanity'

export const teamMember = defineType({
  name:  'teamMember',
  title: 'Team Member',
  type:  'document',
  fields: [
    defineField({ name: 'name',  title: 'Name',  type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role',  title: 'Role',  type: 'string' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio',   title: 'Bio',   type: 'text', rows: 4 }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
  },
})
