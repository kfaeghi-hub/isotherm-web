import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { getSiteSettings } from "@/lib/sanity/queries";
import type { SiteSettings } from "@/sanity.types";

// ─── Header ──────────────────────────────────────────────────────────────────

function SiteHeader() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-heading font-semibold text-xl tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-sm bg-steel text-white text-sm font-medium hover:bg-steel/90 transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

type FooterProps = { settings: SiteSettings | null };

function SiteFooter({ settings }: FooterProps) {
  const year = new Date().getFullYear();

  // Fall back to siteConfig values if Sanity hasn't been seeded yet
  const phone   = settings?.phone   ?? siteConfig.contact.phone;
  const email   = settings?.email   ?? siteConfig.contact.email;
  const address = settings?.address ?? siteConfig.contact.address;

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="mx-auto max-w-[1200px] px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand column */}
        <div>
          <p className="font-heading font-semibold text-lg mb-3">
            {settings?.companyName ?? siteConfig.name}
          </p>
          <p className="text-white/70 text-sm leading-relaxed">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Contact column */}
        <div>
          <p className="font-heading font-semibold text-sm uppercase tracking-widest text-steel mb-4">
            Contact
          </p>
          <address className="not-italic text-white/70 text-sm leading-relaxed space-y-1">
            {address && (
              <>
                <p>{address.street}</p>
                <p>{address.city}, {address.province} {address.postal}</p>
              </>
            )}
            <p className="mt-3">
              <a href={`tel:${phone}`} className="hover:text-steel transition-colors">
                {phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${email}`} className="hover:text-steel transition-colors">
                {email}
              </a>
            </p>
          </address>
        </div>

        {/* Links column */}
        <div>
          <p className="font-heading font-semibold text-sm uppercase tracking-widest text-steel mb-4">
            Quick Links
          </p>
          <ul className="space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-6 py-4 text-white/50 text-xs">
          © {year} {settings?.companyName ?? siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Stats band (from Sanity) ─────────────────────────────────────────────────

type StatsBandProps = { settings: SiteSettings | null };

function StatsBand({ settings }: StatsBandProps) {
  const stats = settings?.stats;
  if (!stats?.length) return null;

  return (
    <div className="bg-navy text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat._key} className="text-center">
            <p className="font-heading text-4xl font-bold text-steel">{stat.value}</p>
            <p className="text-white/70 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

type MainContentProps = { settings: SiteSettings | null };

function MainContent({ settings }: MainContentProps) {
  const source = settings ? "Sanity" : "static fallback (seed not run yet)";

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 space-y-16">
      {/* Phase badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line text-sm text-ink/60">
        <span className="w-2 h-2 rounded-full bg-steel inline-block" />
        Phase 1 — Sanity CMS · data source: {source}
      </div>

      {/* Hero copy */}
      <div className="max-w-2xl space-y-6">
        <h1 className="font-heading text-5xl font-semibold text-navy leading-tight tracking-tight">
          {siteConfig.tagline}
        </h1>
        <p className="text-ink/70 text-lg leading-relaxed">
          Sanity CMS is wired up. The footer contact details and stats below
          are read live from the <strong>siteSettings</strong> document.
          Real pages begin in Phase 2.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-navy text-white font-medium rounded-sm hover:bg-navy/90 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center px-6 py-3 border border-navy text-navy font-medium rounded-sm hover:bg-navy/5 transition-colors"
          >
            Our Services
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center px-6 py-3 border border-steel text-steel font-medium rounded-sm hover:bg-steel/5 transition-colors"
          >
            Open Studio →
          </Link>
        </div>
      </div>

      {/* Design tokens strip */}
      <div className="space-y-4 border-t border-line pt-10">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-ink/40">
          Design Tokens
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { bg: "bg-navy",  label: "Navy #0E2243",  text: "text-white", border: false },
            { bg: "bg-steel", label: "Steel #2E6DB4", text: "text-white", border: false },
            { bg: "bg-ink",   label: "Ink #111827",   text: "text-white", border: false },
            { bg: "bg-paper", label: "Paper #F9F9FB", text: "text-ink",   border: true  },
            { bg: "bg-line",  label: "Line #D4D8E2",  text: "text-ink",   border: false },
          ].map(({ bg, label, text, border }) => (
            <div
              key={label}
              className={`${bg} ${text} ${border ? "border border-line" : ""} w-40 h-20 rounded flex items-end p-3`}
            >
              <span className="text-xs font-mono leading-tight opacity-80">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page (server component — fetches from Sanity) ────────────────────────────

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <MainContent settings={settings} />
      </main>
      <StatsBand settings={settings} />
      <SiteFooter settings={settings} />
    </>
  );
}
