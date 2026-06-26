import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { getProjectBySlug, getSiteSettings } from '@/lib/sanity/queries'
import { PortableText } from '@/components/ui/portable-text'
import { urlFor } from '@/lib/sanity/image'
import { siteConfig } from '@/lib/siteConfig'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const proj     = await getProjectBySlug(slug)
  const settings = await getSiteSettings()

  return {
    title:       proj?.seo?.metaTitle       ?? `${proj?.title ?? 'Project'} | ${siteConfig.name}`,
    description: proj?.seo?.metaDescription ?? proj?.summary ?? settings?.defaultSeo?.metaDescription,
  }
}

const CX_LABELS: Record<string, string> = {
  NCx:             'New Construction Commissioning',
  EBCx:            'Existing Building Commissioning',
  RCx:             'Retro-Commissioning',
  OCx:             'Ongoing Commissioning',
  Recommissioning: 'Recommissioning',
  IST:             'Integrated Systems Testing',
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const proj     = await getProjectBySlug(slug)

  if (!proj) notFound()

  const images = proj.images ?? []
  const hero   = images[0]

  return (
    <>
      {/* Hero image or navy band */}
      <div className="relative bg-navy">
        {hero?.asset ? (
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            <Image
              src={urlFor(hero).width(1200).height(600).url()}
              alt={proj.title ?? ''}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            <BarChart3 className="h-16 w-16 text-white/10" />
          </div>
        )}
        {/* Title overlay */}
        <div className={`${hero?.asset ? 'absolute bottom-0 left-0 right-0' : ''} mx-auto max-w-[1200px] px-6 py-10`}>
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-4">
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <span>/</span>
            <span className="text-white/80">{proj.title}</span>
          </nav>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-white tracking-tight">{proj.title}</h1>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </div>

      {/* Content */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-14 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main */}
          <article>
            {proj.summary && (
              <p className="text-ink/80 text-lg leading-relaxed mb-8 font-medium">{proj.summary}</p>
            )}
            {proj.body?.length ? (
              <PortableText value={proj.body as Parameters<typeof PortableText>[0]['value']} />
            ) : (
              <p className="text-ink/40 italic text-sm">Detailed project description coming soon.</p>
            )}

            {/* Additional images */}
            {images.length > 1 && (
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.slice(1).map((img, i) => (
                  img.asset && (
                    <div key={i} className="relative aspect-[4/3] rounded overflow-hidden">
                      <Image
                        src={urlFor(img).width(800).height(600).url()}
                        alt={`${proj.title} — image ${i + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="bg-white border border-line rounded-sm p-6 space-y-4">
              {proj.client && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-steel mb-1">Client</p>
                  <p className="text-navy text-sm font-medium">{proj.client}</p>
                </div>
              )}
              {proj.cxType && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-steel mb-1">Service Type</p>
                  <p className="text-navy text-sm">{CX_LABELS[proj.cxType] ?? proj.cxType}</p>
                </div>
              )}
            </div>
            <div className="bg-steel text-white rounded-sm p-6">
              <p className="font-heading font-semibold text-sm mb-2">Start a similar project</p>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Our team can develop a commissioning scope tailored to your building type and Owner Project Requirements.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-navy text-xs font-semibold rounded-sm hover:bg-white/90 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Back */}
      <div className="border-t border-line bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-steel text-sm font-medium hover:underline underline-offset-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to portfolio
          </Link>
        </div>
      </div>
    </>
  )
}
