import type { Meta, StoryObj } from '@storybook/react'
import { _404 } from '@/pages/__404'
import { Login } from '@/pages/login'
import { Toaster } from '@/components/ui/toaster'
import { Fragment } from 'react'

const meta: Meta = {
  title: '@pages/root',
  component: Fragment,
}
export default meta

export const __404: StoryObj<React.ComponentProps<typeof _404>> = {
  name: '/404',
  render: _404,
}

export const _login: StoryObj<React.ComponentProps<typeof Login>> = {
  name: '/login',
  args: {
    error: false,
  },
  render: Login,
  decorators: [
    function (Story) {
      return (
        <>
          <Toaster />
          <Story />
        </>
      )
    },
  ],
}
