'use client'

import { useActionState } from 'react'
import { submitApplication } from '@/app/actions/career'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FormResult } from '@/lib/seams'

const INITIAL: FormResult | null = null

export function ApplicationForm({ position }: { position: string }) {
  const [state, action, pending] = useActionState(submitApplication, INITIAL)

  if (state?.success) {
    return (
      <div className="rounded-sm border border-steel/30 bg-steel/5 p-6">
        <p className="font-heading font-semibold text-navy text-sm mb-1">Application received</p>
        <p className="text-ink/70 text-sm">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="position" value={position} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="app-name">Full name <span className="text-red-500">*</span></Label>
          <Input id="app-name" name="name" required placeholder="Jane Smith" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="app-email">Email <span className="text-red-500">*</span></Label>
          <Input id="app-email" name="email" type="email" required placeholder="jane@example.com" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="app-phone">Phone</Label>
        <Input id="app-phone" name="phone" type="tel" placeholder="(416) 555-1234" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="app-message">Cover note / relevant experience <span className="text-red-500">*</span></Label>
        <Textarea
          id="app-message"
          name="message"
          required
          rows={5}
          placeholder="Briefly describe your commissioning background and why you're interested in this role."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="app-resume">Resume / LinkedIn URL</Label>
        <Input
          id="app-resume"
          name="resumeNote"
          placeholder="https://linkedin.com/in/yourprofile or note that you'll email your resume"
        />
        <p className="text-ink/40 text-xs">Full resume upload coming in a future update. For now, link or email directly.</p>
      </div>

      {state && !state.success && (
        <p className="text-red-600 text-sm">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-steel text-white text-sm font-medium rounded-sm hover:bg-steel/90 transition-colors disabled:opacity-60"
      >
        {pending ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
