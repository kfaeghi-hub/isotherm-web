import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Zap, Leaf, BarChart3, CheckCircle2 } from 'lucide-react'
import {
  getSiteSettings,
  getServiceCategories,
  getFeaturedProjects,
} from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { siteConfig } from '@/lib/siteConfig'
import { buildMeta } from '@/lib/metadata'
import { FadeUp, StatCounter } from '@/components/ui/motion'
import { HomepageCanvasWrapper } from '@/components/hero/HomepageCanvasWrapper'
import { ENABLE_SCROLL_STORY, STORY_HEIGHT_VH } from '@/lib/scrollStoryConfig'
import type { SiteSettings, ServiceCategory, Project } from '@/sanity.types'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title       = settings?.defaultSeo?.metaTitle       ?? `${siteConfig.name} — ${siteConfig.tagline}`
  const description = settings?.defaultSeo?.metaDescription ?? 'Independent commissioning and engineering services for high-performance buildings across Canada.'
  return buildMeta(title, description, { path: '/' })
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
//
// When ENABLE_SCROLL_STORY = true:
//   The hero becomes a STORY_HEIGHT_VH-tall sticky container. The 3D scene
//   evolves as the user scrolls through it. Text + CTAs stay anchored.
//   Content sections start after the scroll story ends.
//
// When ENABLE_SCROLL_STORY = false:
//   Normal single-viewport hero. 3D rotates at a constant speed.
//
// Layer order inside the sticky viewport: CSS grid → 3D canvas → gradient → text.

function Hero({ tagline }: { tagline: string }) {
  const heroViewport = (
    <div className="bg-navy text-white relative overflow-hidden h-screen">

      {/* Layer 1: CSS blueprint grid — mobile background + canvas loading fallback */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none iso-blueprint-bg" />

      {/* Layer 2: 3D building wireframe — async, desktop only.
          Evolves with scroll progress when ENABLE_SCROLL_STORY is true.
          Returns null on mobile — CSS grid is the permanent background there. */}
      <HomepageCanvasWrapper />

      {/* Layer 3: Left→right gradient vignette.
          Navy solid on the text side → transparent by the building.
          Maintains WCAG AA contrast on hero text at every scroll position. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(90deg, #0E2243 0%, #0E2243 18%, rgba(14,34,67,0.92) 36%, rgba(14,34,67,0.45) 62%, rgba(14,34,67,0) 100%)',
        }}
      />

      {/* Layer 4: Hero text — anchored to top-left of viewport throughout story */}
      <div
        className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-32 lg:py-40"
        style={{ zIndex: 10 }}
      >
        {/* iso-hero-enter: CSS keyframe fade-up 0.55s; disabled by prefers-reduced-motion */}
        <div className="max-w-3xl iso-hero-enter">
          <p className="text-steel text-sm font-semibold uppercase tracking-widest mb-6">
            Commissioning · Engineering · Compliance
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-8">
            {tagline}
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Isotherm Engineering delivers independent, technically rigorous commissioning and
            engineering services for data centres, institutional buildings, healthcare
            facilities, and complex mixed-use developments across Canada.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-steel text-white font-medium rounded-sm hover:bg-steel/90 transition-colors"
            >
              Request a Commissioning Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-medium rounded-sm hover:border-white/60 hover:bg-white/5 transition-colors"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* Steel accent line at viewport bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60"
        style={{ zIndex: 10 }}
      />
    </div>
  )

  // Scroll-story: wrap in a tall container; hero viewport sticks to top while scrolling
  if (ENABLE_SCROLL_STORY) {
    return (
      <section
        id="hero-scroll-wrapper"
        aria-label="Hero"
        style={{ height: `${STORY_HEIGHT_VH}vh` }}
        className="relative"
      >
        <div className="sticky top-0">
          {heroViewport}
        </div>
      </section>
    )
  }

  // Non-story: standard hero section
  return (
    <section className="bg-navy text-white relative overflow-hidden">
      {/* Blueprint grid — mobile background + loading fallback */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none iso-blueprint-bg" />
      <HomepageCanvasWrapper />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(90deg, #0E2243 0%, #0E2243 18%, rgba(14,34,67,0.92) 36%, rgba(14,34,67,0.45) 62%, rgba(14,34,67,0) 100%)',
        }}
      />
      <div
        className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-32 lg:py-40"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-3xl iso-hero-enter">
          <p className="text-steel text-sm font-semibold uppercase tracking-widest mb-6">
            Commissioning · Engineering · Compliance
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-8">
            {tagline}
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Isotherm Engineering delivers independent, technically rigorous commissioning and
            engineering services for data centres, institutional buildings, healthcare
            facilities, and complex mixed-use developments across Canada.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-steel text-white font-medium rounded-sm hover:bg-steel/90 transition-colors"
            >
              Request a Commissioning Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-medium rounded-sm hover:border-white/60 hover:bg-white/5 transition-colors"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>
      <div className="relative h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" style={{ zIndex: 10 }} />
    </section>
  )
}

// ─── Trust Strip ──────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: Shield,       title: 'Comprehensive Commissioning', body: 'Full-cycle Cx from design review through post-occupancy, to Owner Project Requirements.' },
  { icon: CheckCircle2, title: 'Quality Assurance',          body: 'Independent verification that every system performs as designed and installed.' },
  { icon: Leaf,         title: 'Sustainable Practices',      body: 'Commissioning that supports LEED, energy efficiency targets, and carbon reduction goals.' },
  { icon: Zap,          title: 'Energy Efficiency',          body: 'Identifying operational savings and optimizing building performance for the life of the asset.' },
]

function TrustStrip() {
  return (
    <section className="bg-paper border-b border-line">
      <div className="mx-auto max-w-[1200px] px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {TRUST_ITEMS.map(({ icon: Icon, title, body }, i) => (
          <FadeUp key={title} delay={i * 0.06} className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-sm bg-navy/5 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-steel" />
            </div>
            <div>
              <p className="font-heading font-semibold text-navy text-sm mb-1">{title}</p>
              <p className="text-ink/60 text-sm leading-relaxed">{body}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

// ─── Services Overview ────────────────────────────────────────────────────────

function ServicesOverview({ categories }: { categories: ServiceCategory[] }) {
  if (!categories.length) return null
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <FadeUp className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy">Our Services</h2>
          </div>
          <Link href="/services" className="text-steel text-sm font-medium hover:underline underline-offset-4 shrink-0">
            View all services →
          </Link>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <FadeUp key={cat._id} delay={i * 0.06} className="flex flex-col">
              <Link
                href={`/services#${cat.slug?.current ?? ''}`}
                className="group flex flex-col flex-1 border border-line rounded-sm p-8 hover:border-steel hover:shadow-md hover:-translate-y-px transition-all bg-paper"
              >
                <span className="text-steel/50 font-heading text-4xl font-bold mb-6 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading font-semibold text-navy text-lg mb-3">{cat.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed flex-1">{cat.shortDescription}</p>
                <span className="mt-6 text-steel text-sm font-medium group-hover:gap-3 inline-flex items-center gap-2 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Approach ─────────────────────────────────────────────────────────────────

const APPROACH_STEPS = [
  { n: '01', title: 'Define Objectives',  body: 'We establish the Owner Project Requirements and Basis of Design — the benchmark every system is tested against.' },
  { n: '02', title: 'Develop Strategies', body: 'A detailed commissioning plan and issue log are created, ensuring every trade and system is covered before construction.' },
  { n: '03', title: 'Implement & Verify', body: 'Functional performance testing, final reporting, and post-occupancy follow-up confirm lasting system performance.' },
]

function ApproachSection() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <FadeUp className="mb-12">
          <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-3">How We Work</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy">Our Approach</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[16.7%] right-[16.7%] h-px bg-line" />
          {APPROACH_STEPS.map(({ n, title, body }, i) => (
            <FadeUp key={n} delay={i * 0.06} className="relative flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-steel bg-white flex items-center justify-center shrink-0 z-10">
                  <span className="font-heading font-bold text-steel text-sm">{n}</span>
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-navy text-lg mb-2">{title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed">{body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats Band ───────────────────────────────────────────────────────────────

function StatsSection({ settings }: { settings: SiteSettings | null }) {
  const stats = settings?.stats
  if (!stats?.length) return null
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <FadeUp key={stat._key} delay={i * 0.08} className="text-center">
            <p className="font-heading text-4xl md:text-5xl font-bold text-steel mb-2">
              <StatCounter value={stat.value ?? ''} />
            </p>
            <p className="text-white/60 text-sm leading-snug">{stat.label}</p>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

// ─── Featured Projects ────────────────────────────────────────────────────────

function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <FadeUp className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-3">Selected Work</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-navy">Featured Projects</h2>
          </div>
          <Link href="/portfolio" className="text-steel text-sm font-medium hover:underline underline-offset-4 shrink-0">
            View all projects →
          </Link>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((proj, i) => {
            const img = (proj.images as unknown as { asset?: unknown }[] | undefined)?.[0]
            return (
              <FadeUp key={proj._id} delay={i * 0.06} className="flex flex-col">
                <Link
                  href={`/portfolio/${proj.slug?.current ?? proj._id}`}
                  className="group flex flex-col flex-1 border border-line rounded-sm overflow-hidden hover:border-steel hover:shadow-md hover:-translate-y-px transition-all bg-paper"
                >
                  <div className="relative aspect-[4/3] bg-navy/10 overflow-hidden">
                    {img?.asset ? (
                      <Image
                        src={urlFor(img).width(600).height(450).url()}
                        alt={proj.title ?? ''}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-navy/5">
                        <BarChart3 aria-hidden="true" className="h-12 w-12 text-navy/20" />
                      </div>
                    )}
                    {proj.cxType && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-2 py-0.5 bg-navy/90 text-white text-xs font-medium rounded-sm">
                          {proj.cxType}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <p className="font-heading font-semibold text-navy text-sm leading-snug">{proj.title}</p>
                    {proj.client && <p className="text-ink/50 text-xs">{proj.client}</p>}
                    {proj.summary && (
                      <p className="text-ink/60 text-xs leading-relaxed line-clamp-2">{proj.summary}</p>
                    )}
                  </div>
                </Link>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────

function CTABand() {
  return (
    <section className="bg-steel text-white">
      <FadeUp>
        <div className="mx-auto max-w-[1200px] px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-2">
              Connect With Our Commissioning Experts
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Whether you have a project in design, an existing building underperforming, or a
              compliance question — we can help.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy font-semibold rounded-sm hover:bg-white/90 transition-colors shrink-0"
          >
            Request a Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FadeUp>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [settings, categories, featuredProjects] = await Promise.all([
    getSiteSettings(),
    getServiceCategories(),
    getFeaturedProjects(),
  ])

  return (
    <>
      <Hero tagline={siteConfig.tagline} />
      <TrustStrip />
      <ServicesOverview categories={categories} />
      <ApproachSection />
      <StatsSection settings={settings} />
      <FeaturedProjects projects={featuredProjects} />
      <CTABand />
    </>
  )
}
