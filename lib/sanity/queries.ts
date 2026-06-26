import { defineQuery } from 'next-sanity'
import { client } from './client'
import type {
  SiteSettings,
  ServiceCategory,
  Service,
  Project,
  TeamMember,
  CareerPost,
  Page,
} from '@/sanity.types'

// ─── GROQ query strings (defined here so typegen can scan them) ───────────────

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]`,
)

export const SERVICE_CATEGORIES_QUERY = defineQuery(
  `*[_type == "serviceCategory"] | order(order asc)`,
)

export const SERVICES_QUERY = defineQuery(
  `*[_type == "service"] | order(order asc) { ..., category-> }`,
)

export const SERVICE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "service" && slug.current == $slug][0] { ..., category-> }`,
)

export const PROJECTS_QUERY = defineQuery(
  `*[_type == "project"] | order(order asc)`,
)

export const FEATURED_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && featured == true] | order(order asc)`,
)

export const PROJECT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]`,
)

export const TEAM_QUERY = defineQuery(
  `*[_type == "teamMember"] | order(order asc)`,
)

export const ACTIVE_CAREER_POSTS_QUERY = defineQuery(
  `*[_type == "careerPost" && active == true] | order(postedDate desc)`,
)

export const CAREER_POST_BY_SLUG_QUERY = defineQuery(
  `*[_type == "careerPost" && slug.current == $slug][0]`,
)

export const PAGE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]`,
)

// ─── Typed fetch helpers ──────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(SITE_SETTINGS_QUERY)
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return client.fetch(SERVICE_CATEGORIES_QUERY)
}

export async function getServices(): Promise<Service[]> {
  return client.fetch(SERVICES_QUERY)
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return client.fetch(SERVICE_BY_SLUG_QUERY, { slug })
}

export async function getProjects(): Promise<Project[]> {
  return client.fetch(PROJECTS_QUERY)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(FEATURED_PROJECTS_QUERY)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(PROJECT_BY_SLUG_QUERY, { slug })
}

export async function getTeam(): Promise<TeamMember[]> {
  return client.fetch(TEAM_QUERY)
}

export async function getActiveCareerPosts(): Promise<CareerPost[]> {
  return client.fetch(ACTIVE_CAREER_POSTS_QUERY)
}

export async function getCareerPostBySlug(slug: string): Promise<CareerPost | null> {
  return client.fetch(CAREER_POST_BY_SLUG_QUERY, { slug })
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return client.fetch(PAGE_BY_SLUG_QUERY, { slug })
}
