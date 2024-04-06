import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Layout } from '@/pages/_layout'
import { Fragment } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { getCreditById, getCreditsList, type TCredit } from '@/api/credit'
import { Credits } from '@/pages/_layout/credit'
import { CreditById } from '@/pages/_layout/credit_/$creditId'
import { DeleteCreditById } from '@/pages/_layout/credit_/$creditId/delete'
import { UpdateCreditById } from '@/pages/_layout/credit_/$creditId_/update'
import { NewCredit } from '@/pages/_layout/credit/new'
import { PaySelectedCredit } from '@/pages/_layout/credit/pay'
import { PrintSelectedCredit } from '@/pages/_layout/credit/print'
import { PayCreditById } from '@/pages/_layout/credit_/$creditId/pay'
import { PrintCreditById } from '@/pages/_layout/credit_/$creditId/print'
import { UpdateConfirmationCredit } from '../_layout/credit_/$creditId_/update.confirm'
import { getClients } from '@/api/clients'
import { Theme } from '@/components/theme-provider'
import { getUserId } from '@/api/users'

function _Layout(Story: StoryFn, context: { globals: { theme: Theme } }) {
  return (
    <Layout theme={context.globals.theme} clients={getClients()} user={getUserId({ userId: 4 })}>
      <Story />
    </Layout>
  )
}

function _CreditLayout(credits: TCredit[]) {
  return (Story: StoryFn) => (
    <Credits credits={credits} open>
      <Story />
    </Credits>
  )
}

function _UpdateCreditLayout(credit: TCredit) {
  return (Story: StoryFn) => (
    <UpdateCreditById credit={credit} open>
      <Story />
    </UpdateCreditById>
  )
}

function _CreditByIdLayout(credit: TCredit) {
  return (Story: StoryFn) => (
    <CreditById credit={credit} open>
      <Story />
    </CreditById>
  )
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

function _CreditsBase(prop: React.ComponentProps<typeof Credits>) {
  return (
    <Credits {...prop}>
      {' '}
      <></>{' '}
    </Credits>
  )
}

const meta: Meta = {
  title: '@pages/credit',
  component: Fragment,
  decorators: [_Layout, _Router, _ToastProvider],
}
export default meta

export const _Credits: StoryObj<React.ComponentProps<typeof _CreditsBase>> = {
  name: '/credit',
  render: _CreditsBase,
  args: {
    credits: getCreditsList(),
  },
}

export const _NewCredit: StoryObj<React.ComponentProps<typeof NewCredit>> = {
  name: '/credit/new',
  render: NewCredit,
  args: {
    clients: getClients(),
  },
  decorators: [_CreditLayout(getCreditsList())],
}

export const _PaySelectedCredit: StoryObj<
  React.ComponentProps<typeof PaySelectedCredit>
> = {
  name: '/credit/$creditId/pay-selected',
  render: PaySelectedCredit,
  args: {
    credit: getCreditById({ creditId: 4 }),
  },
  decorators: [_CreditLayout(getCreditsList())],
}

export const _PrintSelectedCredit: StoryObj<
  React.ComponentProps<typeof PrintSelectedCredit>
> = {
  name: '/credit/$creditId/print-selected',
  render: PrintSelectedCredit,
  args: {
    credit: getCreditById({ creditId: 4 }),
  },
  decorators: [_CreditLayout(getCreditsList())],
}

export const _CreditById: StoryObj<React.ComponentProps<typeof CreditById>> = {
  name: '/credit/$creditId',
  render: CreditById,
  args: {
    credit: getCreditById({ creditId: 4 }),
  },
}

export const _DeleteCreditById: StoryObj<
  React.ComponentProps<typeof DeleteCreditById>
> = {
  name: '/credit/$creditId/delete',
  render: DeleteCreditById,
  args: {
    credit: getCreditById({ creditId: 4 }),
  },
  decorators: [_CreditByIdLayout(getCreditById({ creditId: 4 }))],
}

export const _UpdateCreditById: StoryObj<
  React.ComponentProps<typeof UpdateCreditById>
> = {
  name: '/credit/$creditId/update',
  render: UpdateCreditById,
  args: {
    credit: getCreditById({ creditId: 4 }),
    open: false,
  },
}

export const _UpdateConfirmationCredit: StoryObj<
  React.ComponentProps<typeof UpdateConfirmationCredit>
> = {
  name: '/credit/$creditId/update/confirmation',
  render: UpdateConfirmationCredit,
  args: {
    credit: getCreditById({ creditId: 4 }),
  },
  decorators: [_UpdateCreditLayout(getCreditById({ creditId: 4 }))],
}

export const _PayCreditById: StoryObj<
  React.ComponentProps<typeof PayCreditById>
> = {
  name: '/credit/$creditId/pay',
  render: PayCreditById,
  args: {
    credit: getCreditById({ creditId: 4 }),
  },
  decorators: [_CreditByIdLayout(getCreditById({ creditId: 4 }))],
}

export const _PrintCreditById: StoryObj<
  React.ComponentProps<typeof PrintCreditById>
> = {
  name: '/credit/$creditId/print',
  render: PrintCreditById,
  args: {
    credit: getCreditById({ creditId: 4 }),
  },
  decorators: [_CreditByIdLayout(getCreditById({ creditId: 4 }))],
}
