import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Client } from '@/pages/_layout/client'
import { NewClient } from '@/pages/_layout/client/new'
import { DeleteClient } from '@/pages/_layout/client/delete'
import { UpdateByClientId } from '@/pages/_layout/client/$clientId.update'
import { DeleteByClientId } from '@/pages/_layout/client/$clientId.delete'
import { Navigation } from '@/pages/_layout'
import React, { Fragment } from 'react'
import { Toaster } from '@/components/ui/toaster'
import clients from "@/__mock__/CLIENTS.json";
import { TClient } from '@/api/clients'

function Layout(Story: StoryFn) {
  return (
    <Navigation>
      <Story />
    </Navigation>
  )
}

function ClientLayout( clients: TClient[] ){
 return (Story: StoryFn) =>
    <Client open={true} clients={clients}>
      <Story />
    </Client>
}

function ToastProvider(Story: StoryFn) {
  return (
    <>
      <Toaster />
      <Story />
    </>
  )
}

function ClientRender({ ...props }: React.ComponentProps< typeof Client >) {
  return <Client {...props}><></></Client> 
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

export const _Home: StoryObj< React.ComponentProps< typeof Client> > = {
  name: '/client',
  args: {
    clients,
  },
  render: ClientRender
}

export const _User: StoryObj< React.ComponentProps< typeof NewClient > > = {
  name: '/client/new',
  render: NewClient,
  args: { },
  decorators: [ToastProvider, ClientLayout(clients)],
}

export const _Delete: StoryObj< React.ComponentProps< typeof DeleteClient > > = {
  name: '/client/delete',
  render: DeleteClient,
  args: { clients },
  decorators: [ToastProvider, ClientLayout(clients)],
}

export const _UpdateById: StoryObj< React.ComponentProps< typeof UpdateByClientId > > = {
  name: '/client/$clientId/update',
  render: UpdateByClientId,
  args: {
    client: clients[0]
  },
  decorators: [ToastProvider, ClientLayout(clients)],
}

export const _DeleteByClientId: StoryObj< React.ComponentProps< typeof DeleteByClientId > > = {
  name: '/client/$clientId/delete',
  render: DeleteByClientId,
    args: {
    client: clients[0]
  },
  decorators: [ToastProvider, ClientLayout(clients)],
}
