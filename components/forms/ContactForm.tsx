'use client'

import { useActionState } from 'react'
import { submitContactForm } from '@/app/actions/contact'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FormResult } from '@/lib/seams'

const INITIAL: FormResult | null = null

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, INITIAL)

  if (state?.success) {
    return (
      <div className="rounded-sm border border-steel/30 bg-steel/5 p-8">
        <p className="font-heading font-semibold text-navy text-base mb-2">Message received</p>
        <p className="text-ink/70 text-sm leading-relaxed">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-name">Full name <span className="text-red-500">*</span></Label>
          <Input id="contact-name" name="name" required placeholder="Jane Smith" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-email">Email <span className="text-red-500">*</span></Label>
          <Input id="contact-email" name="email" type="email" required placeholder="jane@example.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-company">Company / organization</Label>
          <Input id="contact-company" name="company" placeholder="ACME Development Corp." />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input id="contact-phone" name="phone" type="tel" placeholder="(416) 555-1234" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">How can we help? <span className="text-red-500">*</span></Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Describe your project, building type, and what you're looking to accomplish."
        />
      </div>

      {state && !state.success && (
        <p className="text-red-600 text-sm">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-steel text-white text-sm font-medium rounded-sm hover:bg-steel/90 transition-colors disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </button>

      <p className="text-ink/40 text-xs">
        We respond within one business day.
      </p>
    </form>
  )
}
