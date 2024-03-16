import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Layout } from '@/pages/_layout'
import { Fragment } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { getCreditId, getCredits, type TCredit } from '@/api/credit'
import { Credits } from '@/pages/_layout/credit'
import { CreditById } from '@/pages/_layout/credit_/$creditId'
import { DeleteCreditById } from '@/pages/_layout/credit_/$creditId/delete'
import { UpdateCreditById } from '@/pages/_layout/credit_/$creditId/update'
import { NewCredit } from '@/pages/_layout/credit/new'
import { PayCreditById } from '@/pages/_layout/credit/$creditId/pay'
import { PrintCreditById } from '@/pages/_layout/credit/$creditId/print'
import { getClients } from '@/api/clients'

function _Layout(Story: StoryFn) {
  return (
    <Layout>
      <Story />
    </Layout>
  )
}

function _CreditLayout( credits: TCredit[] ){
 return (Story: StoryFn) =>
    <Credits credits={credits} open >
      <Story />
    </Credits>
}

function _CreditByIdLayout( credit: TCredit ){
 return (Story: StoryFn) =>
    <CreditById credit={credit} open >
      <Story />
    </CreditById>
}

function _Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

function _ToastProvider(Story: StoryFn) {
  return (
    <>
      <Toaster />
      <Story />
    </>
  )
}

function _CreditsBase( prop: React.ComponentProps< typeof Credits >  ) {
  return <Credits {...prop}> <></>  </Credits>
}

const meta: Meta = {
  title: '@pages/credit',
  component: Fragment,
  decorators: [_Layout, _Router, _ToastProvider],
}
export default meta

export const _Credits: StoryObj< React.ComponentProps< typeof _CreditsBase > > = {
  name: '/credit',
  render: _CreditsBase,
  args: {
    credits: getCredits()
  }
}

export const _NewCredit: StoryObj< React.ComponentProps< typeof NewCredit > > = {
  name: '/credit/new',
  render: NewCredit,
  args: {
    clients: getClients()
  },
  decorators: [_CreditLayout(getCredits())]
}

export const _PayCreditById: StoryObj< React.ComponentProps< typeof PayCreditById > > = {
  name: '/credit/$creditId/pay',
  render: PayCreditById,
  args: {
    amount: 450,
  },
  decorators: [_CreditLayout(getCredits())]
}

export const _PrintCreditById: StoryObj< React.ComponentProps< typeof PrintCreditById > > = {
  name: '/credit/$creditId/print',
  render: PrintCreditById,
  args: {
    credit: getCreditId({ creditId: 4 })
  },
  decorators: [ _CreditLayout( getCredits() ) ]
}

export const _CreditById: StoryObj< React.ComponentProps< typeof CreditById > > = {
  name: '/credit/$creditId',
  render: CreditById,
  args: {
    credit: getCreditId({ creditId: 4 })
  },
}

export const _DeleteCreditById: StoryObj< React.ComponentProps< typeof DeleteCreditById > > = {
  name: '/credit/$creditId/delete',
  render: DeleteCreditById,
  args: {
    credit: getCreditId({ creditId: 4 })
  },
  decorators: [ _CreditByIdLayout(getCreditId({ creditId: 4 })) ]
}

export const _UpdateCreditById: StoryObj< React.ComponentProps< typeof UpdateCreditById > > = {
  name: '/credit/$creditId/update',
  render: UpdateCreditById,
  args: {
    credit: getCreditId({ creditId: 4 }),
    open: false
  },
}
