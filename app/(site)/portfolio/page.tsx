import type { Metadata } from 'next'
import { getProjects } from '@/lib/sanity/queries'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'
import { siteConfig } from '@/lib/siteConfig'
import { buildMeta } from '@/lib/metadata'

export function generateMetadata(): Metadata {
  return buildMeta(
    `Portfolio | ${siteConfig.name}`,
    'Commissioned projects across data centres, healthcare, education and mixed-use developments — delivered by Isotherm Engineering.',
    { path: '/portfolio' },
  )
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <>
      {/* Page header */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-4">Our Work</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">Project Portfolio</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            From data centre commissioning to LEED-certified institutional buildings — a sample of projects where Isotherm Engineering has delivered measurable performance outcomes.
          </p>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* Filterable grid (client component) */}
      <div className="bg-paper min-h-[400px]">
        <PortfolioGrid projects={projects} />
      </div>
    </>
  )
}
