import type { Meta, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { _404 } from './__404'
import { Login } from './login'

const meta: Meta = {
  title: '@pages/root',
  component: $.customRenderStorie,
}
export default meta

export const __404: StoryObj = {
  name: '/404',
  render: _404,
}

export const _login: StoryObj = {
  name: '/login',
  render: Login,
}
