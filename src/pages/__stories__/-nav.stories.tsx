import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Home } from '@/pages/_layout/index'
import { Layout } from '@/pages/_layout'
import { Fragment } from 'react'

function _Layout(Story: StoryFn) {
  return (
    <Layout>
      <Story />
    </Layout>
  )
}

function _Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

const meta: Meta = {
  title: '@pages/nav',
  component: Fragment,
  decorators: [_Layout, _Router],
}
export default meta

export const _Home: StoryObj = {
  name: '/',
  render: Home,
}
