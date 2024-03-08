import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { User } from '@/pages/_layout/user'
import { Navigation } from '@/pages/_layout'
import { Fragment } from 'react'
import _users from "@/__mock__/USERS.json";
import roles from "@/__mock__/ROLES.json";
import { NewUser } from './new'
import { TUserResponse } from '@/api/users'
import { DeleteUserById } from './$userId.delete'
import { UpdateUserById } from './$userId.update'
import { DeleteUsers } from './delete'
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
    users,
  },
  decorators: [UsersLayout(users)]
}

export const _UpdateUserById: StoryObj< React.ComponentProps< typeof UpdateUserById > > = {
  name: '/user/$userId/update',
  render: UpdateUserById,
  args: {
    users,
  },
  decorators: [UsersLayout(users)]
}

export const _DeleteUserById: StoryObj< React.ComponentProps< typeof DeleteUserById > > = {
  name: '/user/$userId/delete',
  render: DeleteUserById,
  args: {
    users,
  },
  decorators: [UsersLayout(users)]
}
