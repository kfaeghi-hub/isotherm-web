import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { getActiveCareerPosts } from '@/lib/sanity/queries'
import { siteConfig } from '@/lib/siteConfig'
import { buildMeta } from '@/lib/metadata'
import { FadeUp } from '@/components/ui/motion'

export function generateMetadata(): Metadata {
  return buildMeta(
    `Careers | ${siteConfig.name}`,
    'Join the Isotherm Engineering team. We\'re looking for driven commissioning engineers and technical professionals who want to shape building performance.',
    { path: '/career' },
  )
}

export default async function CareerPage() {
  const posts = await getActiveCareerPosts()

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-4">Join Us</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">Careers</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            We're looking for technically rigorous, curious professionals who want to help building owners get the most out of their assets. Join a team where your work directly shapes building performance.
          </p>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* Job listings */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          {posts.length === 0 ? (
            <div className="max-w-xl">
              <h2 className="font-heading text-xl font-semibold text-navy mb-3">No openings posted right now</h2>
              <p className="text-ink/60 text-sm leading-relaxed mb-6">
                We don't have any active postings at the moment, but we're always interested in hearing from qualified candidates. Send us your resume and a brief note about your background.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-steel text-white text-sm font-medium rounded-sm hover:bg-steel/90 transition-colors"
              >
                Get in touch <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/career/${post.slug?.current ?? post._id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-line rounded-sm p-6 hover:border-steel hover:shadow-md hover:-translate-y-px transition-all"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="font-heading font-semibold text-navy text-base group-hover:text-steel transition-colors">
                      {post.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-ink/50 text-xs">
                      {post.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {post.location}
                        </span>
                      )}
                      {post.type && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.type === 'full-time' ? 'Full-time' : 'Contract'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-steel text-sm font-medium shrink-0">
                    View role <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values band */}
      <section className="bg-white border-t border-line">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <FadeUp className="mb-10">
            <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-4">Why Isotherm</p>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-navy">What it's like to work here</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Technical depth',     body: 'You\'ll work on complex, high-stakes building systems across data centres, hospitals, and institutional buildings — not cookie-cutter projects.' },
              { title: 'Small team culture',  body: 'Everyone\'s work is visible and valued. You\'ll collaborate directly with senior commissioning authorities on every project.' },
              { title: 'Owner-first mindset', body: 'We work for the owner, not the contractor. That independence shapes everything — from how we write reports to how we hold trades accountable.' },
            ].map(({ title, body }, i) => (
              <FadeUp key={title} delay={i * 0.06} className="border-t-2 border-steel pt-5">
                <h3 className="font-heading font-semibold text-navy text-base mb-2">{title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed">{body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
