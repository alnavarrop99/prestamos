import ThemeProvider from './decorators'
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
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [ThemeProvider],
  // loaders: [mswLoader],
}

export default preview
