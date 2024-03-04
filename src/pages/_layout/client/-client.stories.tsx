import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Client } from '@/pages/_layout/client'
import { New } from '@/pages/_layout/client/new'
import { Navigation } from '@/pages/_layout'
import { Fragment } from 'react'
import { Toaster } from '@/components/ui/toaster'

function Layout(Story: StoryFn) {
  return (
    <Navigation>
      <Story />
    </Navigation>
  )
}

function ClientLayout(Story: StoryFn) {
  return (
    <Client open={true}>
      <Story />
    </Client>
  )
}

function ToastProvider(Story: StoryFn) {
  return (
    <>
      <Toaster />
      <Story />
    </>
  )
}

function Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

const meta: Meta<typeof Fragment> = {
  title: '@pages/client',
  component: Fragment,
  decorators: [Layout, Router],
}
export default meta

export const _Home: StoryObj = {
  name: '/client',
  render: Client,
}

export const _User: StoryObj = {
  name: '/client/new',
  render: New,
  decorators: [ToastProvider, ClientLayout],
}
