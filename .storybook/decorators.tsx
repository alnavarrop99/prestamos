import React from 'react'
import { StoryFn } from '@storybook/react'
import { ThemeProvider, type Theme } from '../src/components/theme-provider'

export function _ThemeProvider(
  Story: StoryFn,
  context: { globals: { theme: Theme } }
) {
  return (
    <ThemeProvider
      defaultTheme={context.globals.theme}
      storageKey="vite-ui-theme"
    >
      <Story />
    </ThemeProvider>
  )
}
