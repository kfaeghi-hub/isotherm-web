import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getServiceCategories, getServices, getSiteSettings } from '@/lib/sanity/queries'
import { siteConfig } from '@/lib/siteConfig'
import { buildMeta } from '@/lib/metadata'
import { FadeUp } from '@/components/ui/motion'
import type { ServiceCategory } from '@/sanity.types'

// GROQ `category->` populates the reference inline at runtime
type ServiceWithCategory = {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  category?: ServiceCategory
}

export function generateMetadata(): Metadata {
  return buildMeta(
    `Services | ${siteConfig.name}`,
    'Commissioning services, engineering solutions, and building code compliance — delivered by an independent commissioning authority.',
    { path: '/services' },
  )
}

export default async function ServicesPage() {
  const [categories, rawServices] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ])

  // Cast: GROQ `category->` expands the reference at runtime
  const services = rawServices as unknown as ServiceWithCategory[]

  return (
    <>
      {/* Page header */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-4">What We Offer</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">Our Services</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Isotherm Engineering provides independent commissioning and engineering services
            across three core practice areas — ensuring every building system performs as designed.
          </p>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* Categories + services */}
      <div className="bg-paper">
        {categories.map((cat) => {
          const catServices = services.filter(
            (s) => s.category?._id === cat._id || (s.category as unknown as { _ref?: string })?._ref === cat._id,
          )

          return (
            <section key={cat._id} id={cat.slug?.current ?? cat._id} className="border-b border-line">
              <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
                {/* Category header */}
                <FadeUp className="mb-10">
                  <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-3">Practice Area</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold text-navy mb-3">{cat.title}</h2>
                  {cat.shortDescription && (
                    <p className="text-ink/60 text-base leading-relaxed max-w-2xl">{cat.shortDescription}</p>
                  )}
                </FadeUp>

                {/* Service cards — staggered reveal */}
                {catServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catServices.map((svc, j) => (
                      <FadeUp key={svc._id} delay={j * 0.06} className="flex flex-col">
                        <Link
                          href={`/service/${svc.slug?.current ?? svc._id}`}
                          className="group flex flex-col flex-1 bg-white border border-line rounded-sm p-6 hover:border-steel hover:shadow-md hover:-translate-y-px transition-all"
                        >
                          <h3 className="font-heading font-semibold text-navy text-base mb-2 group-hover:text-steel transition-colors">
                            {svc.title}
                          </h3>
                          {svc.excerpt && (
                            <p className="text-ink/60 text-sm leading-relaxed flex-1">{svc.excerpt}</p>
                          )}
                          <span className="mt-5 inline-flex items-center gap-1.5 text-steel text-sm font-medium">
                            Learn more <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </Link>
                      </FadeUp>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink/40 text-sm italic">Services coming soon.</p>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* CTA */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold mb-2">Need a custom scope of work?</h2>
            <p className="text-white/70 text-sm">Our team can develop a commissioning plan tailored to your specific project and Owner Project Requirements.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-steel text-white font-medium rounded-sm hover:bg-steel/90 transition-colors shrink-0"
          >
            Request a Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
