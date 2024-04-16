import type { Meta, StoryObj } from '@storybook/react'
import { Error, Pending, PrintCredit } from "@/pages/_layout/credit"
import { Error as ErrorCreditById, Pending as PendingCreditById } from "@/pages/_layout/credit_/$creditId"
import $ from "@/lib/render";
import React from 'react';

const meta: Meta = {
  title: '@pages/credits',
  component: React.Fragment,
  decorators: [ ( Storie ) => $.customRenderStorie( () => <Storie />) ]
}
export default meta

export const _PendingCredits: StoryObj< typeof Pending > = {
  name: 'Credits | Pending',
  render: Pending,
}

export const _ErrorCredits: StoryObj< typeof Error > = {
  name: 'Credits | Error',
  render: Error,
  parameters: {
    layout: "centered"
  }
}

export const _PrintCredits: StoryObj< React.ComponentRef<typeof PrintCredit> > = {
  name: 'Credits | Print',
  render: ( args ) => <PrintCredit {...args} />,
  parameters: {
    viewport: {
      defaultViewport: "mobile"
    },
  },
  args: {
    client: "Jhon Doe", 
    cuoteNumber: 20,
    mora: 20,
    pay: 100,
    date: new Date()?.toString(),
    comment: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
    pending: 500,
    telephone: "+53 555-555-555",
    ssn: "999 999 999",
    phone: "+32 55-555-555",
  }
}

export const _PendingCreditById: StoryObj< typeof PendingCreditById > = {
  name: 'Credit By Id | Pending',
  render: PendingCreditById,
}

export const _ErrorCreditById: StoryObj< typeof ErrorCreditById > = {
  name: 'Credit By Id | Error',
  render: ErrorCreditById,
  parameters: {
    layout: "centered"
  }
}
