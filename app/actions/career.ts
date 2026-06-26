'use server'

import { getApplicationFormHandler, type FormResult } from '@/lib/seams'

export async function submitApplication(_prevState: FormResult | null, formData: FormData): Promise<FormResult> {
  const name       = formData.get('name')?.toString().trim() ?? ''
  const email      = formData.get('email')?.toString().trim() ?? ''
  const phone      = formData.get('phone')?.toString().trim()
  const message    = formData.get('message')?.toString().trim() ?? ''
  const resumeNote = formData.get('resumeNote')?.toString().trim()
  const position   = formData.get('position')?.toString().trim() ?? ''

  if (!name || !email || !message) {
    return { success: false, message: 'Please fill in all required fields.' }
  }

  const handler = getApplicationFormHandler()
  // TODO Phase 3: handler will call Resend / email provider
  return handler({ name, email, phone, message, resumeNote, position })
}
