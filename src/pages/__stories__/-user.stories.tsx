import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import $ from '@/lib/render'
import { Users } from '@/pages/_layout/user'
import { Layout } from '@/pages/_layout'
import { Fragment } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { TUser, getUserId, getUsers } from '@/api/users'
import { NewUser } from '@/pages/_layout/user/new'
import { DeleteUserById } from '@/pages/_layout/user/$userId/delete'
import { UpdateUserById } from '@/pages/_layout/user/$userId/update'
import { DeleteSelectedUsers } from '@/pages/_layout/user/delete'

function _Layout(Story: StoryFn) {
  return (
    <Layout>
      <Story />
    </Layout>
  )
}

function _UsersLayout( users: TUser[] ){
 return (Story: StoryFn) =>
    <Users users={users} open >
      <Story />
    </Users>
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

function _UserBasic( prop: React.ComponentProps< typeof Users >  ) {
  return <Users {...prop}> <></>  </Users>
}

const meta: Meta = {
  title: '@pages/users',
  component: Fragment,
  decorators: [_Layout, _Router, _ToastProvider],
}
export default meta

export const _User: StoryObj< React.ComponentProps< typeof _UserBasic > > = {
  name: '/user',
  render: _UserBasic,
  args: {
    users: getUsers()
  }
}

export const _NewUser: StoryObj< React.ComponentProps< typeof NewUser > > = {
  name: '/user/new',
  render: NewUser,
  args: {
    users: getUsers()
  },
  decorators: [_UsersLayout(getUsers())]
}

export const _DeleteUsers: StoryObj< React.ComponentProps< typeof DeleteSelectedUsers > > = {
  name: '/user/delete',
  render: DeleteSelectedUsers,
  args: {
    users: getUsers().slice(0,5)
  },
  decorators: [_UsersLayout(getUsers())]
}

export const _UpdateUserById: StoryObj< React.ComponentProps< typeof UpdateUserById > > = {
  name: '/user/$userId/update',
  render: UpdateUserById,
  args: {
    user: getUserId( { userId: 4 } )
  },
  decorators: [_UsersLayout(getUsers())]
}

export const _DeleteUserById: StoryObj< React.ComponentProps< typeof DeleteUserById > > = {
  name: '/user/$userId/delete',
  render: DeleteUserById,
  args: {
    user: getUserId({ userId: 4 })
  },
  decorators: [_UsersLayout(getUsers())]
}