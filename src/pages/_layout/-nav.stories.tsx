import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { User } from './user'
import { Client } from './client'
import { Credit } from './credit'
import { Home } from './index'
import { Navigation } from '../_layout.tsx'

function Layout(Story: StoryFn) {
  return (
    <Navigation>
      {' '}
      <Story />{' '}
    </Navigation>
  )
}

const meta: Meta = {
  title: '@pages/nav',
  component: $.customRenderStorie,
  decorators: [Layout],
}
export default meta

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

export const _Home: StoryObj = {
  name: '/home',
  render: Home,
}
