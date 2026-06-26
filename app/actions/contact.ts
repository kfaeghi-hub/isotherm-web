'use server'

import { getContactFormHandler, type FormResult } from '@/lib/seams'

export async function submitContactForm(_prevState: FormResult | null, formData: FormData): Promise<FormResult> {
  const name    = formData.get('name')?.toString().trim() ?? ''
  const email   = formData.get('email')?.toString().trim() ?? ''
  const company = formData.get('company')?.toString().trim()
  const phone   = formData.get('phone')?.toString().trim()
  const message = formData.get('message')?.toString().trim() ?? ''

  if (!name || !email || !message) {
    return { success: false, message: 'Please fill in all required fields.' }
  }

  const handler = getContactFormHandler()
  // TODO Phase 3: handler will call Resend / email provider
  return handler({ name, email, company, phone, message })
}
