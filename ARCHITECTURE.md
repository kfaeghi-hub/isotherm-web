# Architecture & Maintainability

This document records the structural principles for the Isotherm Engineering marketing site.
It mirrors the conventions used in the Isotherm Cx Management App.

---

## 1. One config source

All non-CMS constants live in **`lib/siteConfig.ts`**: nav structure, route map, contact details, and feature flags.
Nothing else should duplicate these values. Import from `siteConfig` everywhere.

```ts
import { siteConfig, routes, featureFlags } from "@/lib/siteConfig";
```

---

## 2. Typed content contract

All CMS-editable content comes from **Sanity** (Phase 1+).
The workflow is:
1. Schemas in `sanity/schemaTypes/` define the shape
2. `sanity typegen` generates `sanity.types.ts`
3. Front-end data-fetching functions (in `lib/sanity/`) return those typed objects
4. Components consume the types — never `any`, never raw `fetch` response

The front-end must never assume the shape of CMS data; it reads typed, validated results only.

---

## 3. Named seams for deferred features

Features that are in the roadmap but not yet built are represented as **typed stub functions** in **`lib/seams.ts`**.
These stubs return safe empty/no-op values today and will be swapped for real implementations later — without touching call sites.

Current seams:
- `getBlogPosts()` — returns `[]` until `featureFlags.blogEnabled = true`
- `getNewsletterProvider()` — returns a no-op until `featureFlags.newsletterEnabled = true`

---

## 4. Components own their code

shadcn/ui and 21st.dev components are copied into **`components/ui/`** at install time.
They are owned source code, not runtime dependencies. Edit them freely; do not re-run `shadcn add` to "reset" them.

---

## 5. No secrets in client code

- Sanity read token, Resend API key, and all credentials live in **Vercel environment variables only**
- No `.env` files are committed — `.gitignore` excludes `.env*`
- This is a public repo; assume every committed file is visible to the world

---

## 6. Design token layer

All brand colors and typography are defined in **`app/globals.css`** under `@theme inline` and `:root`.
Tailwind utility classes (`bg-navy`, `text-steel`, `text-ink`, `bg-paper`, `border-line`) derive from those variables.
Do not hardcode hex values in components — always use the token name.

Token reference:

| Token    | Hex       | Usage                                  |
|----------|-----------|----------------------------------------|
| `navy`   | `#0E2243` | Header, footer, primary CTAs           |
| `steel`  | `#2E6DB4` | Accent, links, interactive highlights  |
| `ink`    | `#111827` | Body text on light backgrounds         |
| `paper`  | `#F9F9FB` | Page background                        |
| `line`   | `#D4D8E2` | Borders, dividers                      |

---

## 7. Animation system (Phase 4+)

All motion uses **`motion`** (Motion 12 / Framer Motion). Spec §6 rules are strict:
- Fade + upward translate (14px) on scroll-into-view, fires **once**
- ≤60ms stagger across card grids (60ms = `delay={i * 0.06}`)
- `prefers-reduced-motion`: `useReducedMotion()` disables transforms, shows content immediately
- **Hero only**: CSS keyframe `iso-hero-enter` (defined in `globals.css`) — no JS required, no hydration flicker
- Forbidden: bounce, spring overshoot, parallax, auto-carousels, 3D

### Shared primitives (`components/ui/motion.tsx`)

```tsx
import { FadeUp, StatCounter } from '@/components/ui/motion'

// Single reveal
<FadeUp>section content</FadeUp>

// Staggered grid — FadeUp wraps each grid cell with delay={i * 0.06}
<div className="grid grid-cols-3 gap-6">
  {items.map((item, i) => (
    <FadeUp key={item.id} delay={i * 0.06} className="flex flex-col">
      <Card {...item} />           // card must have flex-1 to fill wrapper
    </FadeUp>
  ))}
</div>

// Stat counter (count-up on scroll)
<StatCounter value="280+" />     // parses "280" + suffix "+"
```

### Rules
- **Server components** import `FadeUp`/`StatCounter` as client sub-components (children are serialized)
- **Card hover lift**: CSS `hover:-translate-y-px transition-all` — no Motion needed for hover
- All animation transitions use `REVEAL_TRANSITION` from `motion.tsx` (500ms, expo-ease-out)
- Timing is deliberate. If a section reads clearly without motion, leave it still.

---

## 8. Build phases

See `Isotherm_Web_Rebuild_Spec.md §11` for the full phase plan.
