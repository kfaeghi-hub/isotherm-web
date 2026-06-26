import { defineField, defineType } from 'sanity'

const seoFields = [
  defineField({ name: 'metaTitle',       type: 'string', title: 'Meta title' }),
  defineField({ name: 'metaDescription', type: 'text',   title: 'Meta description', rows: 3 }),
  defineField({ name: 'ogImage',         type: 'image',  title: 'OG image' }),
]

export const siteSettings = defineType({
  name:  'siteSettings',
  title: 'Site Settings',
  type:  'document',
  // Singleton: desk structure in sanity.config.ts hides the list view
  // and links directly to the fixed documentId 'siteSettings'.
  fields: [
    defineField({ name: 'companyName', title: 'Company name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone',       title: 'Phone',        type: 'string' }),
    defineField({ name: 'email',       title: 'Email',        type: 'string' }),
    defineField({
      name:  'address',
      title: 'Address',
      type:  'object',
      fields: [
        defineField({ name: 'street',   title: 'Street',   type: 'string' }),
        defineField({ name: 'city',     title: 'City',     type: 'string' }),
        defineField({ name: 'province', title: 'Province', type: 'string' }),
        defineField({ name: 'postal',   title: 'Postal code', type: 'string' }),
        defineField({ name: 'country',  title: 'Country',  type: 'string' }),
      ],
    }),
    defineField({
      name:  'socialLinks',
      title: 'Social links',
      type:  'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string', options: { list: ['LinkedIn', 'Twitter/X', 'Facebook', 'Instagram', 'YouTube'] } }),
            defineField({ name: 'url',      title: 'URL',      type: 'url' }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),
    defineField({
      name:   'defaultSeo',
      title:  'Default SEO',
      type:   'object',
      fields: seoFields,
    }),
    defineField({
      name:  'stats',
      title: 'Stats (animated counters)',
      type:  'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value (e.g. "280+")', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label (e.g. "Projects Commissioned")', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),
    defineField({
      name:  'footerBlurb',
      title: 'Footer blurb',
      type:  'array',
      of:    [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'companyName' },
    prepare: ({ title }) => ({ title: title || 'Site Settings' }),
  },
})
