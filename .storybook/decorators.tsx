import React from 'react'
import { StoryFn } from '@storybook/react'
import { type Theme } from '../src/components/theme-provider'

export default function _ThemeProvider(
  Story: StoryFn,
  context: { globals: { theme: Theme } }
) {
  return (
    <div id="theme-provider" className={context.globals.theme}>
      <Story />
    </div>
  )
}
