import type { Meta, StoryObj } from '@storybook/react'
import { Error, Pending } from "@/pages/_layout/report"
import $ from "@/lib/render";
import React from 'react';

const meta: Meta = {
  title: '@pages/reports',
  component: React.Fragment,
  decorators: [ ( Storie ) => $.customRenderStorie( () => <Storie />) ]
}
export default meta

export const _PendingReports: StoryObj< typeof Pending > = {
  name: 'Reports | Pending',
  render: Pending,
}

export const _ErrorReports: StoryObj< typeof Error > = {
  name: 'Reports | Error',
  render: Error,
  parameters: {
    layout: "centered"
  }
}

