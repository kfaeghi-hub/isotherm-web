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

## 7. Build phases

See `Isotherm_Web_Rebuild_Spec.md §11` for the full phase plan.
This scaffold is **Phase 0**. Real pages, Sanity, and animations begin in Phase 1+.
