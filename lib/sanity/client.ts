import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  // Read token is required to fetch draft content; leave undefined for published-only reads
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})
