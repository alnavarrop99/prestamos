import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { User } from '@/pages/_layout/user'
import { Navigation } from '@/pages/_layout'
import { Fragment } from 'react'
import users from "@/__mock__/USERS.json";
import roles from "@/__mock__/ROLES.json";

function Layout(Story: StoryFn) {
  return (
    <Navigation>
      <Story />
    </Navigation>
  )
}

function Router(Story: StoryFn) {
  return $.customRenderStorie(() => <Story />)
}

const meta: Meta = {
  title: '@pages/users',
  component: Fragment,
  decorators: [Layout, Router],
}
export default meta

export const _User: StoryObj< React.ComponentProps< typeof User > > = {
  name: '/user',
  render: User,
  args: {
    users: users.map( ({ rol: { id: rolId }, ...items  }) => ({
        rol: roles.find( ( { id } ) => id === rolId  )?.name ?? "Usuario",
        ...items
    }) ) 
  }
}
