import type { Metadata } from 'next'
import { MapPin, Phone, Mail } from 'lucide-react'
import { getSiteSettings } from '@/lib/sanity/queries'
import { ContactForm } from '@/components/forms/ContactForm'
import { siteConfig } from '@/lib/siteConfig'
import { buildMeta } from '@/lib/metadata'
import { FadeUp } from '@/components/ui/motion'

export function generateMetadata(): Metadata {
  return buildMeta(
    `Contact | ${siteConfig.name}`,
    'Reach Isotherm Engineering — building commissioning and engineering consultants based in Richmond Hill, Ontario. Contact us to discuss your project.',
    { path: '/contact' },
  )
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const phone   = settings?.phone   ?? siteConfig.contact.phone
  const email   = settings?.email   ?? siteConfig.contact.email
  const address = settings?.address ?? siteConfig.contact.address

  const mapsQuery = [
    address?.street,
    address?.city,
    address?.province,
    address?.country,
  ].filter(Boolean).join(', ')

  const mapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`

  return (
    <>
      {/* Header */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
          <p className="text-steel text-xs font-semibold uppercase tracking-widest mb-4">Get in Touch</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">Contact Us</h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Whether you're planning a new commissioning engagement, have a question about an existing building, or just want to explore what we can do for your project — we're here.
          </p>
        </div>
        <div className="h-1 bg-gradient-to-r from-steel/60 via-steel to-steel/60" />
      </section>

      {/* Contact grid */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Form */}
          <FadeUp>
            <h2 className="font-heading text-xl font-semibold text-navy mb-6">Send us a message</h2>
            <ContactForm />
          </FadeUp>

          {/* Contact details */}
          <FadeUp delay={0.1} className="flex flex-col gap-6">
            <div className="bg-white border border-line rounded-sm p-6 space-y-5">
              <h2 className="font-heading font-semibold text-navy text-base">Office</h2>

              {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-steel shrink-0 mt-0.5" />
                  <address className="not-italic text-ink/70 text-sm leading-relaxed">
                    {address.street}<br />
                    {address.city}, {address.province} {address.postal}<br />
                    {address.country}
                  </address>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-steel shrink-0" />
                <a href={`tel:${phone}`} className="text-ink/70 text-sm hover:text-steel transition-colors">{phone}</a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-steel shrink-0" />
                <a href={`mailto:${email}`} className="text-ink/70 text-sm hover:text-steel transition-colors">{email}</a>
              </div>
            </div>

            <div className="bg-white border border-line rounded-sm p-4 space-y-2">
              <p className="font-heading font-semibold text-navy text-xs uppercase tracking-widest">Office Hours</p>
              <p className="text-ink/60 text-sm">Monday – Friday: 8:30 AM – 5:00 PM ET</p>
              <p className="text-ink/40 text-xs">We respond to all inquiries within one business day.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-line">
        <div className="relative h-72 md:h-96 w-full overflow-hidden">
          <iframe
            title="Isotherm Engineering office location"
            src={mapsEmbedSrc}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}
