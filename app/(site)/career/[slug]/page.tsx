import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Calendar } from 'lucide-react'
import { getCareerPostBySlug } from '@/lib/sanity/queries'
import { PortableText } from '@/components/ui/portable-text'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { siteConfig } from '@/lib/siteConfig'
import { buildMeta } from '@/lib/metadata'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post     = await getCareerPostBySlug(slug)

  const title       = post?.title ? `${post.title} | ${siteConfig.name}` : `Career | ${siteConfig.name}`
  const description = `${post?.title ?? 'Open position'} at Isotherm Engineering${post?.location ? ` — ${post.location}` : ''}. Join a technically rigorous independent commissioning team.`

  return buildMeta(title, description, { path: `/career/${slug}` })
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params
  const post     = await getCareerPostBySlug(slug)

  if (!post) notFound()

  const postedDate = post.postedDate
    ? new Date(post.postedDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-14 md:py-18">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/career" className="hover:text-white transition-colors">Careers</Link>
            <span>/</span>
            <span className="text-white/80">{post.title}</span>
          </nav>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight mb-5">{post.title}</h1>
          <div className="flex flex-wrap gap-5 text-white/60 text-sm">
            {post.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-steel" /> {post.location}
              </span>
            )}
            {post.type && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-steel" />
                {post.type === 'full-time' ? 'Full-time' : 'Contract'}
              </span>
            )}
            {postedDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-steel" /> Posted {postedDate}
              </span>
            )}
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* Content + form */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-14 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Job description */}
          <article>
            {post.body?.length ? (
              <PortableText value={post.body as Parameters<typeof PortableText>[0]['value']} />
            ) : (
              <p className="text-ink/40 italic text-sm">Role description coming soon.</p>
            )}
          </article>

          {/* Application form */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-line rounded-sm p-6">
              <h2 className="font-heading font-semibold text-navy text-lg mb-1">Apply for this role</h2>
              <p className="text-ink/60 text-sm mb-6">Fill in the form below and we'll be in touch.</p>
              <ApplicationForm position={post.title ?? slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Back */}
      <div className="border-t border-line bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <Link href="/career" className="inline-flex items-center gap-2 text-steel text-sm font-medium hover:underline underline-offset-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all openings
          </Link>
        </div>
      </div>
    </>
  )
}
