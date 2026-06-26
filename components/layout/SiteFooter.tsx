import Link from 'next/link'
import { siteConfig } from '@/lib/siteConfig'
import type { SiteSettings, ServiceCategory } from '@/sanity.types'

type Props = { settings: SiteSettings | null; categories?: ServiceCategory[] }

export function SiteFooter({ settings, categories }: Props) {
  const year    = new Date().getFullYear()
  const phone   = settings?.phone   ?? siteConfig.contact.phone
  const email   = settings?.email   ?? siteConfig.contact.email
  const address = settings?.address ?? siteConfig.contact.address
  const name    = settings?.companyName ?? siteConfig.name

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-heading font-semibold text-lg mb-3">{name}</p>
          <p className="text-white/60 text-sm leading-relaxed">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Services */}
        <div>
          <p className="font-heading font-semibold text-xs uppercase tracking-widest text-steel mb-4">Services</p>
          <ul className="space-y-2">
            <li>
              <Link href="/services" className="text-white/60 hover:text-white text-sm transition-colors">All Services</Link>
            </li>
            {(categories ?? []).map((cat) => {
              const slug = cat.slug?.current
              if (!slug) return null
              return (
                <li key={cat._id}>
                  <Link
                    href={`/services#${slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="font-heading font-semibold text-xs uppercase tracking-widest text-steel mb-4">Company</p>
          <ul className="space-y-2">
            {[
              { label: 'Portfolio', href: '/portfolio' },
              { label: 'About Us',  href: '/about' },
              { label: 'Careers',   href: '/career' },
              { label: 'Contact',   href: '/contact' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="text-white/60 hover:text-white text-sm transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-heading font-semibold text-xs uppercase tracking-widest text-steel mb-4">Contact</p>
          <address className="not-italic text-white/60 text-sm leading-relaxed space-y-1">
            {address && (
              <>
                <p>{address.street}</p>
                <p>{address.city}, {address.province} {address.postal}</p>
              </>
            )}
            <p className="mt-3">
              <a href={`tel:${phone}`} className="hover:text-steel transition-colors">{phone}</a>
            </p>
            <p>
              <a href={`mailto:${email}`} className="hover:text-steel transition-colors">{email}</a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">© {year} {name}. All rights reserved.</p>
          <p className="text-white/40 text-xs">Building commissioning &amp; engineering — Canada</p>
        </div>
      </div>
    </footer>
  )
}
