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
