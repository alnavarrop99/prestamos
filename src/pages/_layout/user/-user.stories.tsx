import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { User } from '@/pages/_layout/user'
import { Navigation } from '@/pages/_layout'
import { Fragment } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { TUserResponse } from '@/api/users'
import { NewUser } from '@/pages/_layout/user/new'
import { DeleteUserById } from '@/pages/_layout/user/$userId.delete'
import { UpdateUserById } from '@/pages/_layout/user/$userId.update'
import { DeleteUsers } from '@/pages/_layout/user/delete'
import _users from "@/__mock__/USERS.json";
import roles from "@/__mock__/ROLES.json";

const users = _users.map( ({ rol: { id: rolId }, ...items  }) => ({
        rol: roles.find( ( { id } ) => id === rolId  )?.name ?? "Usuario",
        active: false,
        ...items
    }) ) as TUserResponse[]

function Layout(Story: StoryFn) {
  return (
    <Navigation>
      <Story />
    </Navigation>
  )
}

function UsersLayout( users: TUserResponse[] ){
 return (Story: StoryFn) =>
    <User users={users} open >
      <Story />
    </User>
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

function _UserLayout( prop: React.ComponentProps< typeof User >  ) {
  return <User {...prop}> <></>  </User>
}

const meta: Meta = {
  title: '@pages/users',
  component: Fragment,
  decorators: [Layout, Router, ToastProvider],
}
export default meta

export const _User: StoryObj< React.ComponentProps< typeof _UserLayout > > = {
  name: '/user',
  render: _UserLayout,
  args: {
    users,
  }
}

export const _NewUser: StoryObj< React.ComponentProps< typeof NewUser > > = {
  name: '/user/new',
  render: NewUser,
  args: {
    users,
  },
  decorators: [UsersLayout(users)]
}

export const _DeleteUsers: StoryObj< React.ComponentProps< typeof DeleteUsers > > = {
  name: '/user/delete',
  render: DeleteUsers,
  args: {
    users: users.slice(0,5)
  },
  decorators: [UsersLayout(users)]
}

export const _UpdateUserById: StoryObj< React.ComponentProps< typeof UpdateUserById > > = {
  name: '/user/$userId/update',
  render: UpdateUserById,
  args: {
    user: users[0]
  },
  decorators: [UsersLayout(users)]
}

export const _DeleteUserById: StoryObj< React.ComponentProps< typeof DeleteUserById > > = {
  name: '/user/$userId/delete',
  render: DeleteUserById,
  args: {
    user: users[0]
  },
  decorators: [UsersLayout(users)]
}
