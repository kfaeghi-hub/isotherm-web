import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPageBySlug, getTeam, getSiteSettings } from '@/lib/sanity/queries'
import { PortableText } from '@/components/ui/portable-text'
import { urlFor } from '@/lib/sanity/image'
import { siteConfig } from '@/lib/siteConfig'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageBySlug('about'), getSiteSettings()])
  return {
    title:       `About | ${siteConfig.name}`,
    description: settings?.defaultSeo?.metaDescription ?? 'Independent commissioning experts serving Canada\'s most demanding building projects.',
  }
}

export default async function AboutPage() {
  const [page, team] = await Promise.all([
    getPageBySlug('about'),
    getTeam(),
  ])

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-4">Who We Are</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            {page?.title ?? 'About Isotherm Engineering'}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            An independent, technically-driven commissioning firm committed to excellence in building system performance across Canada.
          </p>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* Page sections (from Sanity) */}
      {page?.sections?.length ? (
        <section className="bg-paper">
          <div className="mx-auto max-w-[800px] px-6 py-16">
            <PortableText value={page.sections as Parameters<typeof PortableText>[0]['value']} />
          </div>
        </section>
      ) : (
        /* Fallback static content when Sanity not yet seeded */
        <section className="bg-paper">
          <div className="mx-auto max-w-[1200px] px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-4">Our Mission</p>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-navy mb-5">
                Your independent advocate for building performance
              </h2>
              <p className="text-ink/70 leading-relaxed mb-4">
                Isotherm Engineering was founded on the principle that building owners deserve
                independent, technically rigorous verification that their systems perform as
                designed — from day one and throughout the building's operational life.
              </p>
              <p className="text-ink/70 leading-relaxed mb-4">
                We serve as the Owner's independent commissioning authority across Canada, providing
                new construction commissioning (NCx), existing building commissioning (EBCx),
                retro-commissioning (RCx), and integrated systems testing (IST) for data centres,
                healthcare, education, and mixed-use developments.
              </p>
              <p className="text-ink/70 leading-relaxed">
                With over 20 years of experience, 280+ completed projects, and 25M+ square feet
                commissioned, our team brings deep technical expertise and an unwavering commitment
                to quality.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: '280+', desc: 'Commissioning projects completed' },
                { label: '25M+ sq ft', desc: 'Floor area commissioned' },
                { label: '50+', desc: 'LEED projects supported' },
                { label: '20+ years', desc: 'Of commissioning experience' },
              ].map(({ label, desc }) => (
                <div key={label} className="border border-line rounded-sm p-5 bg-white flex items-center gap-5">
                  <span className="font-heading font-bold text-2xl text-steel shrink-0 w-28">{label}</span>
                  <span className="text-ink/60 text-sm">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team grid */}
      {team.length > 0 && (
        <section className="bg-white border-t border-line">
          <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
            <div className="mb-12">
              <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-3">The People</p>
              <h2 className="font-heading text-3xl font-semibold text-navy">Our Team</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member._id} className="flex flex-col gap-3">
                  <div className="relative aspect-square rounded-sm overflow-hidden bg-navy/10">
                    {member.photo?.asset ? (
                      <Image
                        src={urlFor(member.photo).width(400).height(400).url()}
                        alt={member.name ?? ''}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-navy/5">
                        <span className="font-heading font-bold text-3xl text-navy/20">
                          {member.name?.charAt(0) ?? '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-navy text-sm">{member.name}</p>
                    {member.role && <p className="text-ink/50 text-xs mt-0.5">{member.role}</p>}
                    {member.bio && <p className="text-ink/60 text-xs leading-relaxed mt-2">{member.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-steel text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold mb-2">Join our team or work with us</h2>
            <p className="text-white/80 text-sm">We're always interested in connecting with talented commissioning professionals and building owners with ambitious projects.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/career" className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/40 text-white text-sm font-medium rounded-sm hover:border-white hover:bg-white/10 transition-colors">
              View Openings
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-navy text-sm font-semibold rounded-sm hover:bg-white/90 transition-colors">
              Contact Us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
