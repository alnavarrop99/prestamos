import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Credit } from '@/pages/_layout/credit'
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

function CreditLayout(  ){
 return (Story: StoryFn) =>
    <Credit >
      <Story />
    </Credit>
}

function Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

function ToastProvider(Story: StoryFn) {
  return (
    <>
      <Toaster />
      <Story />
    </>
  )
}

function _CreditLayout( prop: React.ComponentProps< typeof Credit >  ) {
  return <Credit {...prop}> <></>  </Credit>
}

const meta: Meta = {
  title: '@pages/credit',
  component: Fragment,
  decorators: [Layout, Router, ToastProvider],
}
export default meta

export const _User: StoryObj< React.ComponentProps< typeof Credit > > = {
  name: '/credit',
  render: _CreditLayout,
  args: {
  }
}

export const _NewCredit: StoryObj< React.ComponentProps< typeof Credit > > = {
  name: '/credit/new',
  render: Credit,
  args: {
  },
  decorators: [CreditLayout()]
}

export const _DeleteCredit: StoryObj< React.ComponentProps< typeof Credit > > = {
  name: '/credit/delete',
  render:Credit,
  args: {
  },
  decorators: [CreditLayout()]
}

export const _UpdateCreditById: StoryObj< React.ComponentProps< typeof Credit > > = {
  name: '/credit/$creditId/update',
  render: Credit,
  args: {
  },
  decorators: [CreditLayout()]
}

export const _DeleteCreditById: StoryObj< React.ComponentProps< typeof Credit > > = {
  name: '/credit/$creditId/delete',
  render: Credit,
  args: {
  },
  decorators: [CreditLayout()]
}
