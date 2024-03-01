import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { User } from './user'
import { Client } from './client'
import { Credit } from './credit'
import { Home } from './index'
import { Navigation } from '../_layout.tsx'
import { Fragment } from 'react'

function Layout(Story: StoryFn) {
  return (
    <Navigation>
      <Story />
    </Navigation>
  )
}

function Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

const meta: Meta = {
  title: '@pages/nav',
  component: Fragment,
  decorators: [Layout, Router],
}
export default meta

export const _Home: StoryObj = {
  name: '/',
  render: Home,
}

export const _User: StoryObj = {
  name: '/user',
  render: User,
}

export const _Client: StoryObj = {
  name: '/client',
  render: Client,
}

export const _Credit: StoryObj = {
  name: '/credit',
  render: Credit,
}
