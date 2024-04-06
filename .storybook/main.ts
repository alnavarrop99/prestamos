import type { StorybookConfig } from '@storybook/react-vite'
import { join } from 'path'

const root = join(__dirname, '.storybook')

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  viteFinal(config) {
    config.css = {
      ...config.css,
      postcss: join(root, '.postcssrc'),
    }
    return config
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
