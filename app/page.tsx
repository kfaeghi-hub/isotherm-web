import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

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

function SiteFooter() {
  const { address, phone, email } = siteConfig.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="mx-auto max-w-[1200px] px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand column */}
        <div>
          <p className="font-heading font-semibold text-lg mb-3">
            {siteConfig.name}
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
            <p>{address.street}</p>
            <p>
              {address.city}, {address.province} {address.postal}
            </p>
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
          © {year} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Token + Font Demo ────────────────────────────────────────────────────────

function DesignSystemDemo() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 space-y-16">
      {/* Phase badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line text-sm text-ink/60">
        <span className="w-2 h-2 rounded-full bg-steel inline-block" />
        Phase 0 — Scaffold
      </div>

      {/* Hero copy */}
      <div className="max-w-2xl space-y-6">
        <h1 className="font-heading text-5xl font-semibold text-navy leading-tight tracking-tight">
          {siteConfig.tagline}
        </h1>
        <p className="text-ink/70 text-lg leading-relaxed">
          This is a placeholder page confirming the design system is wired up correctly.
          Real content, animations, and Sanity integration come in later phases.
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
        </div>
      </div>

      {/* Colour palette swatch strip */}
      <div className="space-y-4">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-ink/40">
          Design Tokens
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { bg: "bg-navy",  label: "Navy #0E2243",  text: "text-white",        border: false },
            { bg: "bg-steel", label: "Steel #2E6DB4", text: "text-white",        border: false },
            { bg: "bg-ink",   label: "Ink #111827",   text: "text-white",        border: false },
            { bg: "bg-paper", label: "Paper #F9F9FB", text: "text-ink",          border: true },
            { bg: "bg-line",  label: "Line #D4D8E2",  text: "text-ink",          border: false },
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

      {/* Typography specimen */}
      <div className="space-y-4 border-t border-line pt-10">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-ink/40">
          Typography
        </h2>
        <p className="font-heading text-4xl font-semibold text-navy">
          Inter Tight — heading font
        </p>
        <p className="font-sans text-lg text-ink leading-relaxed">
          Inter — body font. Generous whitespace, strong vertical rhythm.
          Max content width 1200 px. Consistent section padding.
        </p>
        <p className="font-sans text-sm text-ink/60">
          Small / muted — captions, metadata, labels.
        </p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <DesignSystemDemo />
      </main>
      <SiteFooter />
    </>
  );
}
