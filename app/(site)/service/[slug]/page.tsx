import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getServiceBySlug, getSiteSettings } from '@/lib/sanity/queries'
import { PortableText } from '@/components/ui/portable-text'
import { siteConfig } from '@/lib/siteConfig'
import type { ServiceCategory } from '@/sanity.types'

type ServiceWithCategory = {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  body?: unknown[]
  category?: ServiceCategory
  seo?: { metaTitle?: string; metaDescription?: string }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const svc      = await getServiceBySlug(slug) as unknown as ServiceWithCategory | null
  const settings = await getSiteSettings()

  return {
    title:       svc?.seo?.metaTitle       ?? `${svc?.title ?? 'Service'} | ${siteConfig.name}`,
    description: svc?.seo?.metaDescription ?? settings?.defaultSeo?.metaDescription,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const svc      = await getServiceBySlug(slug) as unknown as ServiceWithCategory | null

  if (!svc) notFound()

  const category = svc.category

  return (
    <>
      {/* Breadcrumb + hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-20">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-8">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            {category?.title && (
              <>
                <span>/</span>
                <Link href={`/services#${category.slug?.current ?? ''}`} className="hover:text-white transition-colors">
                  {category.title}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-white/80">{svc.title}</span>
          </nav>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight mb-4">{svc.title}</h1>
          {svc.excerpt && (
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">{svc.excerpt}</p>
          )}
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* Body */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          {/* Main content */}
          <article className="prose-sm max-w-none">
            {svc.body?.length ? (
              <PortableText value={svc.body as Parameters<typeof PortableText>[0]['value']} />
            ) : (
              <p className="text-ink/50 italic">Detailed service description coming soon.</p>
            )}
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            {category && (
              <div className="bg-white border border-line rounded-sm p-6">
                <p className="font-heading font-semibold text-xs uppercase tracking-widest text-steel mb-3">Practice Area</p>
                <p className="font-heading font-semibold text-navy text-sm mb-1">{category.title}</p>
                {category.shortDescription && (
                  <p className="text-ink/60 text-xs leading-relaxed mb-3">{category.shortDescription}</p>
                )}
                <Link
                  href={`/services#${category.slug?.current ?? ''}`}
                  className="text-steel text-xs font-medium hover:underline underline-offset-2"
                >
                  All {category.title} services →
                </Link>
              </div>
            )}
            <div className="bg-steel text-white rounded-sm p-6">
              <p className="font-heading font-semibold text-base mb-2">Get in touch</p>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Discuss your project requirements with our commissioning team.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-navy text-sm font-semibold rounded-sm hover:bg-white/90 transition-colors"
              >
                Request a Consultation <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Back link */}
      <div className="border-t border-line bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <Link href="/services" className="inline-flex items-center gap-2 text-steel text-sm font-medium hover:underline underline-offset-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all services
          </Link>
        </div>
      </div>
    </>
  )
}
