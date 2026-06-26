# Isotherm Engineering — Marketing Site Rebuild
## Master Build Specification (v1)

**Owner:** Tony (Isotherm Engineering Ltd.)
**Purpose:** Replace the existing PlusAgency (Laravel) marketing site at `isothermengineering.com` with a modern, animated, headless-CMS-driven site. This document is the authoritative source of truth. Claude Code reads this directly.

**Replaces:** PlusAgency multipurpose CMS (Laravel + Bootstrap 3, construction skin).
**Does NOT touch:** The Isotherm Cx Management App or its Supabase project. This is a separate, standalone repo and deployment.

---

## 1. Stack (locked)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | SSG/ISR for marketing pages; per-page metadata |
| Hosting | **Vercel** | Same account/workflow as existing projects |
| Language | **TypeScript** | Strict mode |
| Styling | **Tailwind CSS** | Design tokens defined in config (see §5) |
| Component base | **shadcn/ui** | Radix primitives, owned code |
| Component source | **21st.dev** | Install via `npx shadcn add "https://21st.dev/r/..."`; MCP available |
| Animation | **Motion (Framer Motion)** | Subtle/precise only — see §6 |
| CMS | **Sanity** | Headless; Studio for Peiman + Adam editing |
| Forms | **Next.js route handler → email** (Resend or similar) | Contact + Career applications |

**Out of scope for v1:** e-commerce, newsletter automation, blog (carry the route but defer content), multi-language, online payments.

---

## 2. Roles

- **Tony** — admin (full Sanity access + deploy access)
- **Peiman** — editor (Sanity Studio: edit content, publish)
- **Adam Cheney** — editor (Sanity Studio: edit content, publish)

Editors never touch code or git. All content changes happen in Sanity Studio and publish to the live site via ISR/webhook revalidation.

---

## 3. Pages (full parity — v1 scope)

1. **Home** — animated landing (see §7)
2. **Services** — list by category (Commissioning Services, Engineering Solutions, Building Code & Fire Safety Compliance)
3. **Service detail** — `/service/[slug]`
4. **Portfolio** — project grid, filterable by Cx type
5. **Portfolio detail** — `/portfolio/[slug]`
6. **About Us**
7. **Career** — list + **Career detail** `/career/[slug]` with application form
8. **Contact** — form + firm details + map

Global: header with services mega-menu, footer with real contact info and links.

---

## 4. Content model (Sanity schemas)

Everything below is editable in Sanity. **No content is hardcoded** — including stats, contact info, and SEO meta.

### `siteSettings` (singleton)
- `companyName`, `phone`, `email`, `address` (street, city, province, postal, country)
- `socialLinks[]`
- `defaultSeo` { metaTitle, metaDescription, ogImage }
- `stats[]` { value (e.g. "280+"), label (e.g. "Projects Commissioned") }
- `footerBlurb` (rich text)

### `serviceCategory`
- `title`, `slug`, `order`, `shortDescription`, `icon/image`

### `service`
- `title`, `slug`, `category` (ref → serviceCategory), `excerpt`, `body` (rich text), `image`, `order`, `seo`

### `project` (portfolio)
- `title`, `slug`, `client`, `cxType` (NCx / EBCx / RCx / OCx / Recommissioning / IST), `images[]`, `summary`, `body` (rich text), `featured` (bool), `order`, `seo`
- Seed from existing real projects: CIBC Square 81 Bay, Pan Am Games Centre, Daniels Waterfront 130 QQE, Seneca King Campus Expansion (P3), Mattamy Athletic Centre, Ryerson/TMU Engineering Building, Ryerson/TMU 285 Victoria, Humber Data Centres (Etobicoke + Lakeshore), Tier-Aligned Data Centre.

### `teamMember`
- `name`, `role`, `photo`, `bio`, `order`

### `careerPost`
- `title`, `slug`, `location`, `type` (full-time/contract), `body` (rich text), `active` (bool), `postedDate`

### `page` (flexible — About content blocks)
- `title`, `slug`, `sections[]` (portable text + image blocks)

---

## 5. Design system (engineering-grade)

**Direction:** precise, trustworthy, technical. Reads as a firm that commissions data centres and life-safety systems — not a generic agency template.

### Color tokens (Tailwind config)
- `--navy` `#0E2243` (primary — already part of old theme; carry it forward)
- `--steel` a cool mid-blue accent (e.g. `#2E6DB4` range — tune in build)
- `--ink` near-black for body text on light
- `--paper` off-white background `#F9F9FB`
- `--line` subtle border gray
- **Drop the PlusAgency default green entirely.**

### Typography
- **Headings:** a clean geometric/grotesque (Inter Tight, Geist, or similar — pick in build)
- **Body:** Inter or Geist
- **Replace** Montserrat + Muli from the old theme.
- Loaded via `next/font` (no render-blocking Google Fonts import).

### Layout
- Generous whitespace, strong vertical rhythm
- Max content width ~1200px
- Consistent section padding scale (no `.mt-5…mt-300` utility soup — use Tailwind spacing scale)

---

## 6. Animation rules (subtle & precise — locked)

Motion (Framer Motion). The brand is engineering: animation must feel **deliberate and calm**, never bouncy or showy.

**Allowed:**
- Fade + small upward translate (8–16px) on scroll-into-view, once per element
- Staggered reveal of card grids (≤60ms stagger)
- Animated **stat counters** (count up to 280+, 50+, etc.) on first view
- Smooth hero entrance (opacity + subtle translate)
- Hover: gentle lift/shadow on cards, fast (150–200ms)

**Forbidden:**
- Bounce, spring overshoot, parallax-heavy scenes, autoplaying carousels that move on their own, spinning 3D objects, anything that delays content readability
- Respect `prefers-reduced-motion` — disable transforms, keep content fully visible

**Performance:** animate only `transform` and `opacity`. No layout-thrashing properties.

---

## 7. Homepage section order

1. **Hero** — headline "Your Advocate for High Performance Buildings" (editable), subhead, primary CTA → Contact, secondary CTA → Services. Real building/mechanical imagery, not stock graphic. Subtle entrance animation.
2. **Trust strip** — value props (Comprehensive Commissioning, Quality Assurance, Sustainable Practices, Energy Efficiency).
3. **Services overview** — three category cards → category pages.
4. **Approach** — Define Objectives → Develop Strategies → Implement & Verify (3-step).
5. **Stats** — animated counters from `siteSettings.stats`.
6. **Featured projects** — grid of `project.featured`, real logos/clients.
7. **CTA band** — "Connect With Our Commissioning Experts" → real `/contact` link (NOT localhost).
8. **Footer** — real address (95 Mural St., Suite 600, Richmond Hill, ON L4B 3G2), phone (905) 822-2430, email, useful links, current-year copyright (auto).

---

## 8. Carry-over fixes from the audit (must-do)

These bugs exist on the current live site — do NOT reproduce them:
- ❌ Lorem-ipsum meta description/keywords → ✅ real per-page SEO from Sanity
- ❌ "GET IN TOUCH" → `localhost/plusagency/...` → ✅ real `/contact`
- ❌ Envato marketplace logos (ThemeForest/AudioJungle/etc.) in footer → ✅ real client logos or remove
- ❌ "Copyright © 2019" → ✅ auto current year
- ❌ dead `#` links ("see more", hero logo) → ✅ real destinations
- ❌ empty "Useful Links" / newsletter → ✅ populate or remove

---

## 9. Architecture & maintainability principles

(Consistent with how the Cx app and Caspian Pay are built.)

- **One config source** — `siteConfig.ts` for non-CMS constants (nav structure, route map, feature flags).
- **Content contract** — typed Sanity schema → generated TS types (`sanity typegen`), consumed by the front-end. Front-end never assumes shape; it reads typed data.
- **Named seams for deferred features** — `getBlogPosts()`, `getNewsletterProvider()` stubbed now, real later (mirrors the Caspian Pay seam pattern).
- **Components own their code** — shadcn/21st.dev components live in repo, editable.
- **`ARCHITECTURE.md`** — documents the maintainability principles, like the Cx app.
- **No secrets in client** — Sanity read token / Resend key in Vercel env vars only.

---

## 10. Repo & deployment

- New GitHub repo (suggest: `isotherm-web`)
- Local path: `C:\Dev\isotherm-web`
- Vercel project, connected to repo, auto-deploy on push to `main`
- Sanity project (separate from Cx app's Supabase) — free tier
- Domain cutover: build and verify on a Vercel preview / staging subdomain FIRST, then repoint `isothermengineering.com` DNS away from GoDaddy/cPanel to Vercel only after sign-off. **Keep the old site live until the new one is approved.**

---

## 11. Build phases (for Claude Code)

**Phase 0 — Scaffold:** Next.js + TS + Tailwind + shadcn init; tokens from §5; `next/font`; `siteConfig.ts`; `ARCHITECTURE.md`.

**Phase 1 — Sanity:** project + schemas (§4); Studio deployed; typegen; seed real services/projects content.

**Phase 2 — Core pages:** Home (all sections §7, static content first), Services + detail, Portfolio + detail, Contact (form → email). Wire to Sanity.

**Phase 3 — Remaining pages:** About, Career + detail + application form.

**Phase 4 — Motion:** apply §6 animations across Home, then card grids site-wide. Verify `prefers-reduced-motion`.

**Phase 5 — Polish & QA:** SEO metadata per page, OG images, Lighthouse pass (perf/a11y/SEO), responsive sweep, fix-list from §8 verified absent.

**Phase 6 — Cutover:** staging review with Peiman/Adam → DNS repoint → decommission old cPanel site.

---

## 12. Open items to confirm during build

- Exact accent (`--steel`) hex — tune against navy for contrast (WCAG AA).
- Heading typeface final pick (Inter Tight vs Geist vs alternative).
- Email provider for forms (Resend recommended) + destination inbox.
- Whether to migrate any existing project photos from the old site's `/assets/front/img`.
- Map provider on Contact (Google Maps embed vs static).
