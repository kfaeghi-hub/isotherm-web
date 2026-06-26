/**
 * Seed script — Phase 1
 *
 * Requires a write-capable token. Before running:
 *   1. Go to manage.sanity.io → your project → API → Tokens
 *   2. Create a token with "Editor" permissions (or use an existing one)
 *   3. Add to .env.local:  SANITY_API_WRITE_TOKEN=<your-token>
 *   4. Run:  npm run seed
 *
 * Safe to re-run: uses createOrReplace so existing docs are updated, not duplicated.
 */

import { createClient } from '@sanity/client'

// Load env from .env.local when running directly with tsx
import { config as dotenv } from 'dotenv'
dotenv({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'bdcdjnce',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn:    false,
  token:     process.env.SANITY_API_WRITE_TOKEN,
})

// ─── siteSettings (singleton — fixed _id) ────────────────────────────────────

const siteSettingsDoc = {
  _id:   'siteSettings',
  _type: 'siteSettings',
  companyName: 'Isotherm Engineering',
  phone:       '(905) 822-2430',
  email:       'info@isothermengineering.com',
  address: {
    street:   '95 Mural St., Suite 600',
    city:     'Richmond Hill',
    province: 'ON',
    postal:   'L4B 3G2',
    country:  'Canada',
  },
  stats: [
    { _key: 'stat-projects',   value: '280+',  label: 'Projects Commissioned' },
    { _key: 'stat-leed',       value: '50+',   label: 'LEED-Certified Projects' },
    { _key: 'stat-years',      value: '20+',   label: 'Years in Business' },
    { _key: 'stat-sqft',       value: '25M+',  label: 'Sq Ft Commissioned' },
  ],
  footerBlurb: [
    {
      _key:      'blurb-1',
      _type:     'block',
      style:     'normal',
      children:  [{ _key: 'span-1', _type: 'span', text: 'Canada\'s trusted commissioning authority for high-performance buildings — data centres, healthcare, education, and mixed-use developments.', marks: [] }],
      markDefs:  [],
    },
  ],
  defaultSeo: {
    metaTitle:       'Isotherm Engineering — Commissioning & Engineering Solutions',
    metaDescription: 'Isotherm Engineering delivers comprehensive building commissioning, engineering solutions, and building code & fire safety compliance across Canada.',
  },
}

// ─── Service Categories ───────────────────────────────────────────────────────

const serviceCategoryDocs = [
  { _id: 'cat-commissioning', _type: 'serviceCategory', title: 'Commissioning Services',                    slug: { _type: 'slug', current: 'commissioning-services' },      order: 1, shortDescription: 'End-to-end commissioning from design review through post-occupancy verification.' },
  { _id: 'cat-engineering',   _type: 'serviceCategory', title: 'Engineering Solutions',                     slug: { _type: 'slug', current: 'engineering-solutions' },         order: 2, shortDescription: 'Mechanical, electrical, and controls engineering tailored to complex building systems.' },
  { _id: 'cat-code',          _type: 'serviceCategory', title: 'Building Code & Fire Safety Compliance',    slug: { _type: 'slug', current: 'building-code-fire-safety' },     order: 3, shortDescription: 'Code compliance, fire protection reviews, and integrated systems testing for life safety.' },
]

// ─── Services ─────────────────────────────────────────────────────────────────

const placeholder = (name: string) => [
  { _key: `block-${name}`, _type: 'block', style: 'normal', children: [{ _key: 'span-1', _type: 'span', text: `Full description for ${name} — to be refined in Sanity Studio.`, marks: [] }], markDefs: [] },
]

const serviceDocs = [
  {
    _id: 'svc-ncx', _type: 'service',
    title: 'New Construction Commissioning (NCx)',
    slug: { _type: 'slug', current: 'new-construction-commissioning' },
    category: { _type: 'reference', _ref: 'cat-commissioning' },
    excerpt: 'Commissioning authority services from design through final acceptance — ensuring systems perform to owner project requirements.',
    body: placeholder('NCx'),
    order: 1,
  },
  {
    _id: 'svc-ebcx', _type: 'service',
    title: 'Existing Building Commissioning (EBCx)',
    slug: { _type: 'slug', current: 'existing-building-commissioning' },
    category: { _type: 'reference', _ref: 'cat-commissioning' },
    excerpt: 'Systematic investigation and optimization of existing building systems to improve performance and energy efficiency.',
    body: placeholder('EBCx'),
    order: 2,
  },
  {
    _id: 'svc-retrocx', _type: 'service',
    title: 'Retro-Commissioning (RCx)',
    slug: { _type: 'slug', current: 'retro-commissioning' },
    category: { _type: 'reference', _ref: 'cat-commissioning' },
    excerpt: 'Restoring existing systems to their original design intent and improving energy performance through targeted adjustments.',
    body: placeholder('RCx'),
    order: 3,
  },
  {
    _id: 'svc-oncx', _type: 'service',
    title: 'Ongoing Commissioning (OCx)',
    slug: { _type: 'slug', current: 'ongoing-commissioning' },
    category: { _type: 'reference', _ref: 'cat-commissioning' },
    excerpt: 'Continuous monitoring and verification to maintain system performance and quickly identify deviations.',
    body: placeholder('OCx'),
    order: 4,
  },
  {
    _id: 'svc-mep', _type: 'service',
    title: 'MEP Engineering',
    slug: { _type: 'slug', current: 'mep-engineering' },
    category: { _type: 'reference', _ref: 'cat-engineering' },
    excerpt: 'Mechanical, electrical, and plumbing engineering for complex commercial and institutional buildings.',
    body: placeholder('MEP Engineering'),
    order: 5,
  },
  {
    _id: 'svc-ist', _type: 'service',
    title: 'Integrated Systems Testing (IST)',
    slug: { _type: 'slug', current: 'integrated-systems-testing' },
    category: { _type: 'reference', _ref: 'cat-code' },
    excerpt: 'Verifying that life-safety and building systems interact correctly under all operating scenarios.',
    body: placeholder('IST'),
    order: 6,
  },
  {
    _id: 'svc-fire', _type: 'service',
    title: 'Fire & Life Safety Compliance',
    slug: { _type: 'slug', current: 'fire-life-safety-compliance' },
    category: { _type: 'reference', _ref: 'cat-code' },
    excerpt: 'Code review, fire protection system commissioning, and building code compliance for complex occupancies.',
    body: placeholder('Fire & Life Safety'),
    order: 7,
  },
]

// ─── Projects ─────────────────────────────────────────────────────────────────

type CxType = 'NCx' | 'EBCx' | 'RCx' | 'OCx' | 'Recommissioning' | 'IST'

const projectDocs: {
  _id: string; _type: string; title: string; slug: { _type: string; current: string };
  client: string; cxType: CxType; summary: string; body: ReturnType<typeof placeholder>;
  featured: boolean; order: number;
}[] = [
  {
    _id: 'proj-cibc',     _type: 'project',
    title: 'CIBC Square — 81 Bay Street',
    slug: { _type: 'slug', current: 'cibc-square-81-bay' },
    client: 'Ivanhoé Cambridge / Hines',
    cxType: 'NCx',
    summary: 'New construction commissioning for CIBC Square, a 49-storey Class-AAA office tower in Toronto\'s Financial District.',
    body: placeholder('CIBC Square'),
    featured: true, order: 1,
  },
  {
    _id: 'proj-panam',    _type: 'project',
    title: 'Pan Am Games Centre',
    slug: { _type: 'slug', current: 'pan-am-games-centre' },
    client: 'Infrastructure Ontario',
    cxType: 'NCx',
    summary: 'Commissioning of the Pan Am / Parapan Am Games aquatics centre — a P3 delivery for the 2015 Toronto Games.',
    body: placeholder('Pan Am Games Centre'),
    featured: true, order: 2,
  },
  {
    _id: 'proj-daniels',  _type: 'project',
    title: 'Daniels Waterfront — 130 Queens Quay East',
    slug: { _type: 'slug', current: 'daniels-waterfront-130-qe' },
    client: 'The Daniels Corporation',
    cxType: 'NCx',
    summary: 'New construction commissioning for a mixed-use development on Toronto\'s waterfront including office, residential, and cultural uses.',
    body: placeholder('Daniels Waterfront'),
    featured: true, order: 3,
  },
  {
    _id: 'proj-seneca',   _type: 'project',
    title: 'Seneca King Campus Expansion (P3)',
    slug: { _type: 'slug', current: 'seneca-king-campus-expansion' },
    client: 'Seneca College / Infrastructure Ontario',
    cxType: 'NCx',
    summary: 'P3 delivery commissioning for a major campus expansion including academic, library, and student centre facilities.',
    body: placeholder('Seneca King Campus'),
    featured: false, order: 4,
  },
  {
    _id: 'proj-mattamy',  _type: 'project',
    title: 'Mattamy Athletic Centre',
    slug: { _type: 'slug', current: 'mattamy-athletic-centre' },
    client: 'Toronto Metropolitan University',
    cxType: 'EBCx',
    summary: 'Existing building commissioning for the historic Maple Leaf Gardens, repurposed as an athletic and recreation centre.',
    body: placeholder('Mattamy Athletic Centre'),
    featured: true, order: 5,
  },
  {
    _id: 'proj-tmu-eng',  _type: 'project',
    title: 'TMU Engineering Building',
    slug: { _type: 'slug', current: 'tmu-engineering-building' },
    client: 'Toronto Metropolitan University',
    cxType: 'NCx',
    summary: 'New construction commissioning for the George Vari Engineering and Computing Centre at Toronto Metropolitan University.',
    body: placeholder('TMU Engineering Building'),
    featured: false, order: 6,
  },
  {
    _id: 'proj-tmu-285',  _type: 'project',
    title: 'TMU — 285 Victoria Street',
    slug: { _type: 'slug', current: 'tmu-285-victoria' },
    client: 'Toronto Metropolitan University',
    cxType: 'NCx',
    summary: 'Commissioning services for 285 Victoria Street, a multi-use academic and student facility.',
    body: placeholder('TMU 285 Victoria'),
    featured: false, order: 7,
  },
  {
    _id: 'proj-humber',   _type: 'project',
    title: 'Humber Data Centres (Etobicoke + Lakeshore)',
    slug: { _type: 'slug', current: 'humber-data-centres' },
    client: 'Humber College',
    cxType: 'NCx',
    summary: 'Commissioning of dual data centre facilities at Humber College\'s Etobicoke and Lakeshore campuses.',
    body: placeholder('Humber Data Centres'),
    featured: true, order: 8,
  },
  {
    _id: 'proj-tier',     _type: 'project',
    title: 'Tier-Aligned Data Centre',
    slug: { _type: 'slug', current: 'tier-aligned-data-centre' },
    client: 'Confidential',
    cxType: 'IST',
    summary: 'Integrated systems testing for a Tier III-aligned mission-critical data centre in the Greater Toronto Area.',
    body: placeholder('Tier-Aligned Data Centre'),
    featured: true, order: 9,
  },
]

// ─── Execute seed ─────────────────────────────────────────────────────────────

async function seed() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌  SANITY_API_WRITE_TOKEN is not set in .env.local')
    console.error('   Add a write token from manage.sanity.io to run the seed.')
    process.exit(1)
  }

  console.log('🌱  Seeding Sanity project bdcdjnce / production…\n')

  const tx = client.transaction()

  tx.createOrReplace(siteSettingsDoc)
  console.log('  ✓  siteSettings')

  for (const doc of serviceCategoryDocs) {
    tx.createOrReplace(doc)
  }
  console.log(`  ✓  ${serviceCategoryDocs.length} serviceCategories`)

  for (const doc of serviceDocs) {
    tx.createOrReplace(doc)
  }
  console.log(`  ✓  ${serviceDocs.length} services`)

  for (const doc of projectDocs) {
    tx.createOrReplace(doc)
  }
  console.log(`  ✓  ${projectDocs.length} projects`)

  await tx.commit()
  console.log('\n✅  Seed complete. Open Sanity Studio to review and refine.')
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
