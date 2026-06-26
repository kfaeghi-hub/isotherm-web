import type { Metadata } from 'next'
import { siteConfig } from './siteConfig'

// Default OG image served by app/opengraph-image.tsx
export const DEFAULT_OG = { url: '/opengraph-image', width: 1200, height: 630, alt: siteConfig.name }

/** Build consistent per-page metadata with OG + Twitter cards. */
export function buildMeta(
  title:       string,
  description: string,
  {
    path  = '/',
    image = DEFAULT_OG,
  }: { path?: string; image?: { url: string; width: number; height: number; alt: string } } = {},
): Pick<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'> {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:      `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      locale:   'en_CA',
      type:     'website',
      images:   [image],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [image.url],
    },
  }
}
