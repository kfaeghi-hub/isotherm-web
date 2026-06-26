/**
 * Named seams for deferred features (spec §9).
 * Each function is a typed stub that returns a safe empty value today.
 * Replace the implementation here when the feature is activated —
 * call sites never need to change.
 */

import { featureFlags } from "@/lib/siteConfig";

// ─── Blog ────────────────────────────────────────────────────────────────────

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!featureFlags.blogEnabled) return [];
  // TODO Phase 1+: fetch from Sanity using GROQ query
  return [];
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export type NewsletterSubscribeResult = {
  success: boolean;
  message?: string;
};

export type NewsletterProvider = {
  subscribe: (email: string) => Promise<NewsletterSubscribeResult>;
};

export function getNewsletterProvider(): NewsletterProvider {
  if (!featureFlags.newsletterEnabled) {
    return {
      subscribe: async (_email: string) => ({
        success: false,
        message: "Newsletter not yet available.",
      }),
    };
  }
  // TODO Phase 2+: return a real provider (e.g. Resend audience, ConvertKit, etc.)
  return {
    subscribe: async (_email: string) => ({ success: false }),
  };
}

// ─── Forms ────────────────────────────────────────────────────────────────────
// TODO Phase 3: wire both handlers to Resend email route handlers.
// The server actions at app/actions/ call these seams so only one edit is
// needed when the real provider is added.

export type ContactFormData = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
};

export type ApplicationFormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  resumeNote?: string;
  position: string;
};

export type FormResult = {
  success: boolean;
  message: string;
};

export function getContactFormHandler() {
  // TODO Phase 3: replace with Resend API call
  return async (_data: ContactFormData): Promise<FormResult> => ({
    success: true,
    message:
      "Thank you for reaching out. A member of our team will be in touch within one business day.",
  });
}

export function getApplicationFormHandler() {
  // TODO Phase 3: replace with Resend API call to careers inbox
  return async (_data: ApplicationFormData): Promise<FormResult> => ({
    success: true,
    message:
      "Thank you for your application. We review all submissions and will be in touch if your profile is a match.",
  });
}
