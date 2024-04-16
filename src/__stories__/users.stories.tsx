import type { Meta, StoryObj } from '@storybook/react'
import { Error, Pending  } from "@/pages/_layout/user"
import $ from "@/lib/render";
import React from 'react';

const meta: Meta = {
  title: '@pages/users',
  component: React.Fragment,
  decorators: [ ( Storie ) => $.customRenderStorie( () => <Storie />) ]
}
export default meta

export const _usersPending: StoryObj< typeof Pending > = {
  name: 'Users | Pending',
  render: Pending,
}

export const _usersError: StoryObj< typeof Error > = {
  name: 'Users | Error',
  render: Error,
  parameters: {
    layout: "centered"
  }
}
