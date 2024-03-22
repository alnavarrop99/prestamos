import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Clients } from '@/pages/_layout/client'
import { NewClient } from '@/pages/_layout/client/new'
import { DeleteSelectedClients } from '@/pages/_layout/client/delete'
import { UpdateClientById } from '@/pages/_layout/client/$clientId/update'
import { DeleteClientById } from '@/pages/_layout/client/$clientId/delete'
import { Layout } from '@/pages/_layout'
import React, { Fragment } from 'react'
import { Toaster } from '@/components/ui/toaster'
import clients from '@/__mock__/CLIENTS.json'
import { getClientId, getClients, type TClient } from '@/api/clients'
import { Theme } from '@/components/theme-provider'
import { getUserId } from '@/api/users'

function _Layout(Story: StoryFn, context: { globals: { theme: Theme } }) {
  return (
    <Layout theme={context.globals.theme} clients={getClients()} user={getUserId({ userId: 4 })}>
      <Story />
    </Layout>
  )
}

function _ClientLayout(clients: TClient[]) {
  return (Story: StoryFn) => (
    <Clients open={true} clients={clients}>
      <Story />
    </Clients>
  )
}

function _ToastProvider(Story: StoryFn) {
  return (
    <>
      <Toaster />
      <Story />
    </>
  )
}

function _ClientRender({ ...props }: React.ComponentProps<typeof Clients>) {
  return (
    <Clients {...props}>
      <></>
    </Clients>
  )
}

function _Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

const meta: Meta<typeof Fragment> = {
  title: '@pages/client',
  component: Fragment,
  decorators: [_Layout, _Router],
}
export default meta

export const _Home: StoryObj<React.ComponentProps<typeof Clients>> = {
  name: '/client',
  args: {
    clients,
  },
  render: _ClientRender,
}

export const _User: StoryObj<React.ComponentProps<typeof NewClient>> = {
  name: '/client/new',
  render: NewClient,
  args: {},
  decorators: [_ToastProvider, _ClientLayout(clients)],
}

export const _Delete: StoryObj<
  React.ComponentProps<typeof DeleteSelectedClients>
> = {
  name: '/client/delete',
  render: DeleteSelectedClients,
  args: { clients },
  decorators: [_ToastProvider, _ClientLayout(clients)],
}

export const _UpdateById: StoryObj<
  React.ComponentProps<typeof UpdateClientById>
> = {
  name: '/client/$clientId/update',
  render: UpdateClientById,
  args: {
    client: getClientId({ clientId: 4 }),
  },
  decorators: [_ToastProvider, _ClientLayout(clients)],
}

export const _DeleteByClientId: StoryObj<
  React.ComponentProps<typeof DeleteClientById>
> = {
  name: '/client/$clientId/delete',
  render: DeleteClientById,
  args: {
    client: getClientId({ clientId: 4 }),
  },
  decorators: [_ToastProvider, _ClientLayout(clients)],
}
