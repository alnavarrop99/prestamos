import type { Meta, StoryObj } from '@storybook/react'
import { Error, Pending } from "@/pages/_layout/client"
import $ from "@/lib/render";
import React from 'react';

const meta: Meta = {
  title: '@pages/clients',
  component: React.Fragment,
  decorators: [ ( Storie ) => $.customRenderStorie( () => <Storie />) ]
}
export default meta

export const _PendingClients: StoryObj< typeof Pending > = {
  name: 'Clients | Pending',
  render: Pending,
}

export const _ErrorClients: StoryObj< typeof Error > = {
  name: 'Clients | Error',
  render: Error,
  parameters: {
    layout: "centered"
  }
}
