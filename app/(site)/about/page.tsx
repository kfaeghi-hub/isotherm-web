import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPageBySlug, getSiteSettings } from '@/lib/sanity/queries'
import { PortableText } from '@/components/ui/portable-text'
import { siteConfig } from '@/lib/siteConfig'
import { buildMeta } from '@/lib/metadata'
import { FadeUp, StatCounter } from '@/components/ui/motion'

export function generateMetadata(): Metadata {
  return buildMeta(
    `About | ${siteConfig.name}`,
    'Isotherm Engineering is an independent commissioning authority serving Canada\'s most technically demanding building projects — data centres, healthcare, and institutional construction.',
    { path: '/about' },
  )
}

// ─── Geometric accent — engineering drawing motif ────────────────────────────
// Blueprint-style crosshair + concentric circles + grid, at low opacity.
// Absolutely positioned in the hero's right half; hidden on mobile.
function GeometricAccent() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 right-0 w-[52%] overflow-hidden pointer-events-none select-none hidden lg:block"
    >
      <svg
        viewBox="0 0 600 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full opacity-[0.09]"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Regular grid */}
        {[60,120,180,240,300,360].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#2E6DB4" strokeWidth="0.5" />
        ))}
        {[60,120,180,240,300,360,420,480,540].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="420" stroke="#2E6DB4" strokeWidth="0.5" />
        ))}
        {/* Concentric circles */}
        <circle cx="390" cy="210" r="155" stroke="#2E6DB4" strokeWidth="1" />
        <circle cx="390" cy="210" r="100" stroke="#2E6DB4" strokeWidth="0.75" />
        <circle cx="390" cy="210" r="48"  stroke="#2E6DB4" strokeWidth="0.75" />
        <circle cx="390" cy="210" r="7"   fill="#2E6DB4" />
        {/* Dashed crosshair */}
        <line x1="390" y1="0"   x2="390" y2="420" stroke="#2E6DB4" strokeWidth="1.5" strokeDasharray="5 7" />
        <line x1="0"   y1="210" x2="600" y2="210" stroke="#2E6DB4" strokeWidth="1.5" strokeDasharray="5 7" />
        {/* Cardinal point markers */}
        <circle cx="390" cy="55"  r="3" fill="#2E6DB4" />
        <circle cx="390" cy="365" r="3" fill="#2E6DB4" />
        <circle cx="235" cy="210" r="3" fill="#2E6DB4" />
        <circle cx="545" cy="210" r="3" fill="#2E6DB4" />
        {/* Engineering-drawing corner brackets */}
        <path d="M22 50 L22 22 L50 22"   stroke="#2E6DB4" strokeWidth="1.5" />
        <path d="M550 22 L578 22 L578 50" stroke="#2E6DB4" strokeWidth="1.5" />
        <path d="M22 370 L22 398 L50 398" stroke="#2E6DB4" strokeWidth="1.5" />
        <path d="M550 398 L578 398 L578 370" stroke="#2E6DB4" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

// ─── Right-panel mini blueprint (mission section) ────────────────────────────
function BlueprintPanel() {
  return (
    <div className="border-l-2 border-steel/25 pl-10 pt-1 h-full flex flex-col justify-between">
      <svg
        viewBox="0 0 220 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full opacity-[0.17]"
        aria-hidden="true"
      >
        {[40,80,120,160,200,240].map(y => (
          <line key={y} x1="0" y1={y} x2="220" y2={y} stroke="#0E2243" strokeWidth="0.5" />
        ))}
        {[44,88,132,176].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="280" stroke="#0E2243" strokeWidth="0.5" />
        ))}
        <circle cx="110" cy="140" r="70" stroke="#2E6DB4" strokeWidth="1.5" />
        <circle cx="110" cy="140" r="38" stroke="#2E6DB4" strokeWidth="1"   />
        <circle cx="110" cy="140" r="7"  fill="#2E6DB4" opacity="0.6"       />
        <line x1="110" y1="70"  x2="110" y2="210" stroke="#2E6DB4" strokeWidth="1" />
        <line x1="40"  y1="140" x2="180" y2="140" stroke="#2E6DB4" strokeWidth="1" />
        {/* Corner ticks */}
        <path d="M12 28 L12 12 L28 12"   stroke="#2E6DB4" strokeWidth="1" />
        <path d="M192 12 L208 12 L208 28" stroke="#2E6DB4" strokeWidth="1" />
        <path d="M12 252 L12 268 L28 268" stroke="#2E6DB4" strokeWidth="1" />
        <path d="M192 268 L208 268 L208 252" stroke="#2E6DB4" strokeWidth="1" />
      </svg>
      <p className="text-navy/25 text-[11px] font-mono tracking-wider mt-6 leading-loose">
        NCx · EBCx · RCx<br />OCx · IST · MBCx
      </p>
    </div>
  )
}

// ─── Principles derived from brand copy ──────────────────────────────────────
const PRINCIPLES = [
  {
    title: 'Owner-Independent',
    body:  'We work exclusively for the building owner — never the contractor or designer — ensuring unbiased, conflict-free verification at every stage.',
  },
  {
    title: 'Technically Rigorous',
    body:  'Every functional performance test is designed, witnessed, and documented to our own standards — not the minimum the contract requires.',
  },
  {
    title: 'Lifecycle-Focused',
    body:  'Commissioning is not a checkbox. We track deficiencies to resolution and support operational teams throughout the life of the asset.',
  },
] as const

export default async function AboutPage() {
  const [page, settings] = await Promise.all([
    getPageBySlug('about'),
    getSiteSettings(),
  ])

  const stats = settings?.stats ?? []

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy text-white overflow-hidden">
        <GeometricAccent />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28 lg:py-36">
          {/* Constrain to left ~55% so text stays clear of the blueprint graphic */}
          <div className="max-w-[580px] iso-hero-enter">
            <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-5">
              Who We Are
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.1] mb-6">
              {page?.title ?? 'About Isotherm Engineering'}
            </h1>
            <p className="text-white/65 text-lg leading-relaxed">
              An independent, technically-driven commissioning firm committed to excellence
              in building system performance across Canada.
            </p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* ── Mission ────────────────────────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">

            {/* Left: content */}
            <FadeUp>
              <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-5">
                Our Mission
              </p>

              {page?.sections?.length ? (
                /* Sanity path: PortableText with lead-sentence treatment */
                <div className="[&>*:first-child]:font-heading [&>*:first-child]:text-xl [&>*:first-child]:md:text-2xl [&>*:first-child]:font-semibold [&>*:first-child]:text-navy [&>*:first-child]:leading-snug [&>*:first-child]:mb-5 text-ink/70 leading-relaxed [&_p]:mb-4">
                  <PortableText value={page.sections as Parameters<typeof PortableText>[0]['value']} />
                </div>
              ) : (
                /* Fallback static content */
                <>
                  <p className="font-heading text-xl md:text-2xl font-semibold text-navy leading-snug mb-5">
                    Your independent advocate for building performance.
                  </p>
                  <div className="w-10 h-0.5 bg-steel mb-6" />
                  <p className="text-ink/70 leading-relaxed mb-4">
                    Isotherm Engineering was founded on the principle that building owners deserve
                    independent, technically rigorous verification that their systems perform as
                    designed — from day one and throughout the building's operational life.
                  </p>
                  <p className="text-ink/70 leading-relaxed">
                    We serve as the Owner's independent commissioning authority across Canada,
                    providing new construction commissioning (NCx), existing building commissioning
                    (EBCx), retro-commissioning (RCx), and integrated systems testing (IST) for
                    data centres, healthcare, education, and complex mixed-use developments.
                  </p>
                </>
              )}
            </FadeUp>

            {/* Right: blueprint graphic panel, desktop only */}
            <FadeUp delay={0.12} className="hidden lg:block">
              <BlueprintPanel />
            </FadeUp>
          </div>

          {/* Principles row — always shown, derived from brand copy */}
          <div className="mt-14 md:mt-16 pt-12 border-t border-line">
            <FadeUp className="mb-8">
              <p className="text-steel text-xs font-semibold uppercase tracking-widest">
                How We Work
              </p>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {PRINCIPLES.map(({ title, body }, i) => (
                <FadeUp key={title} delay={i * 0.07}>
                  <div className="w-8 h-0.5 bg-steel mb-4" />
                  <h3 className="font-heading font-semibold text-navy text-base mb-2">{title}</h3>
                  <p className="text-ink/60 text-sm leading-relaxed">{body}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ────────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="bg-navy text-white">
          <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
            <FadeUp className="mb-10 md:mb-12">
              <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-2">
                By the Numbers
              </p>
              <h2 className="font-heading text-2xl font-semibold">
                A track record that speaks for itself.
              </h2>
            </FadeUp>

            {/* 2×2 on mobile, 4-across on md+.
                gap-px with bg-white/10 parent draws subtle 1-px dividers between cells. */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.08]">
              {stats.map((stat, i) => (
                <FadeUp
                  key={stat._key ?? String(i)}
                  delay={i * 0.08}
                  className="bg-navy"
                >
                  <div className="px-8 py-10 flex flex-col gap-3">
                    <p className="font-heading text-4xl md:text-5xl font-bold text-steel leading-none">
                      {/* whitespace-nowrap prevents "25M+" and "sq ft" splitting across lines */}
                      <span className="whitespace-nowrap">
                        <StatCounter value={stat.value ?? ''} />
                      </span>
                    </p>
                    <p className="text-white/50 text-sm leading-snug">{stat.label}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="bg-steel text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-heading text-2xl font-semibold mb-2">
              Join our team or work with us
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              We're always interested in connecting with talented commissioning professionals
              and building owners with ambitious projects.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/career"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/40 text-white text-sm font-medium rounded-sm hover:border-white hover:bg-white/10 transition-colors"
            >
              View Openings
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-navy text-sm font-semibold rounded-sm hover:bg-white/90 transition-colors"
            >
              Contact Us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
