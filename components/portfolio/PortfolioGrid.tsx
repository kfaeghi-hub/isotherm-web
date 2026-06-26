'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart3 } from 'lucide-react'
import { urlFor } from '@/lib/sanity/image'
import { FadeUp } from '@/components/ui/motion'
import type { Project } from '@/sanity.types'

const CX_TYPES = ['NCx', 'EBCx', 'RCx', 'OCx', 'Recommissioning', 'IST'] as const
type CxType = typeof CX_TYPES[number]

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<CxType | 'All'>('All')

  const availableTypes = Array.from(
    new Set(projects.map((p) => p.cxType).filter(Boolean)),
  ) as CxType[]

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.cxType === activeFilter)

  return (
    <>
      {/* Filter bar */}
      {availableTypes.length > 0 && (
        <div className="border-b border-line bg-white sticky top-16 z-40">
          <div className="mx-auto max-w-[1200px] px-6 py-3 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                activeFilter === 'All'
                  ? 'bg-navy text-white'
                  : 'border border-line text-ink/60 hover:border-steel hover:text-steel bg-white'
              }`}
            >
              All ({projects.length})
            </button>
            {availableTypes.map((type) => {
              const count = projects.filter((p) => p.cxType === type).length
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                    activeFilter === type
                      ? 'bg-navy text-white'
                      : 'border border-line text-ink/60 hover:border-steel hover:text-steel bg-white'
                  }`}
                >
                  {type} ({count})
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Grid — staggered reveal on initial load */}
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        {filtered.length === 0 ? (
          <p className="text-ink/40 text-sm italic">No projects found for this filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((proj, i) => {
              const img = proj.images?.[0]
              return (
                <FadeUp key={proj._id} delay={i * 0.05} className="flex flex-col">
                  <Link
                    href={`/portfolio/${proj.slug?.current ?? proj._id}`}
                    className="group flex flex-col flex-1 border border-line rounded-sm overflow-hidden hover:border-steel hover:shadow-md hover:-translate-y-px transition-all bg-paper"
                  >
                    <div className="relative aspect-[4/3] bg-navy/5 overflow-hidden">
                      {img?.asset ? (
                        <Image
                          src={urlFor(img).width(600).height(450).url()}
                          alt={proj.title ?? ''}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BarChart3 className="h-12 w-12 text-navy/15" />
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
                    <div className="p-5 flex flex-col gap-1.5 flex-1">
                      <p className="font-heading font-semibold text-navy text-sm leading-snug">{proj.title}</p>
                      {proj.client && <p className="text-ink/50 text-xs">{proj.client}</p>}
                      {proj.summary && (
                        <p className="text-ink/60 text-xs leading-relaxed line-clamp-2 mt-0.5">{proj.summary}</p>
                      )}
                    </div>
                  </Link>
                </FadeUp>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
