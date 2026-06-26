import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'bdcdjnce',
    dataset:   'production',
  },
  studioHost: 'isotherm',
})
