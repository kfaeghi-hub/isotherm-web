import type { MetadataRoute } from 'next'
import { getServices, getProjects, getActiveCareerPosts } from '@/lib/sanity/queries'
import { siteConfig } from '@/lib/siteConfig'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url
  const now  = new Date()

  const [services, projects, careers] = await Promise.all([
    getServices(),
    getProjects(),
    getActiveCareerPosts(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                changeFrequency: 'weekly',  priority: 1.0, lastModified: now },
    { url: `${base}/services`,  changeFrequency: 'weekly',  priority: 0.9, lastModified: now },
    { url: `${base}/portfolio`, changeFrequency: 'weekly',  priority: 0.8, lastModified: now },
    { url: `${base}/about`,     changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${base}/career`,    changeFrequency: 'weekly',  priority: 0.7, lastModified: now },
    { url: `${base}/contact`,   changeFrequency: 'monthly', priority: 0.8, lastModified: now },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter(s => s.slug?.current)
    .map(s => ({
      url:             `${base}/service/${s.slug!.current}`,
      changeFrequency: 'monthly' as const,
      priority:        0.7,
      lastModified:    now,
    }))

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter(p => p.slug?.current)
    .map(p => ({
      url:             `${base}/portfolio/${p.slug!.current}`,
      changeFrequency: 'monthly' as const,
      priority:        0.6,
      lastModified:    now,
    }))

  const careerRoutes: MetadataRoute.Sitemap = careers
    .filter(c => c.slug?.current)
    .map(c => ({
      url:             `${base}/career/${c.slug!.current}`,
      changeFrequency: 'weekly' as const,
      priority:        0.6,
      lastModified:    now,
    }))

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...careerRoutes]
}
