import type { Preview } from '@storybook/react'
import '../src/index.css'
// import { initialize, mswLoader } from 'msw-storybook-addon'

// Initialize MSW
// initialize()

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {},
  },
  // loaders: [mswLoader],
}

export default preview
