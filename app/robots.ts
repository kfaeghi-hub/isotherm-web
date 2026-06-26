import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/siteConfig'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // PRE-LAUNCH: disallow all crawling until DNS cutover is confirmed (Phase 6).
      // Change disallow to allow: '/' before going live.
      disallow: '/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
