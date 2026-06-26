import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool }    from '@sanity/vision'
import { schemaTypes }   from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name:    'isotherm-web',
  title:   'Isotherm Engineering',
  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ── Singleton: Site Settings ─────────────────────
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            // ── Collections ──────────────────────────────────
            S.documentTypeListItem('serviceCategory').title('Service Categories'),
            S.documentTypeListItem('service').title('Services'),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
            S.divider(),
            S.documentTypeListItem('teamMember').title('Team'),
            S.documentTypeListItem('careerPost').title('Career Posts'),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  schema: { types: schemaTypes },
})
