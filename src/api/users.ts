import roles from '@/__mock__/ROLES.json'
import { default as _users } from '@/__mock__/USERS.json'
import { getId, gets } from './base'
import { TUser } from '@types'

const users = _users.map(({ rol: { id: rolId }, ...items }) => ({
  rol: roles.find(({ id }) => id === rolId)?.name ?? 'Usuario',
  active: false,
  ...items,
}))

type TGetUserId = (params: { userId: number }) => TUser
type TGetUsers = () => TUser[]
type TGetUserIdRes = ({
  params,
}: {
  params: { userId: string }
}) => Promise<TUser>
type TGetUsersRes = () => Promise<TUser[]>
type TGetCurrentUserRes = () => Promise<TUser>

export const getUserId: TGetUserId = ({ userId }) =>
  getId(users, { id: userId })
export const getUsers: TGetUsers = () => gets(users)
export const getUserIdRes: TGetUserIdRes = async ({ params: { userId } }) =>
  getUserId({ userId: Number.parseInt(userId) })

export const getUsersRes: TGetUsersRes = async () => {
  const data = await fetch(import.meta.env.VITE_API + '/users/list')
  if (!data.ok) throw new Error('Failed fetch users')
  return data.json()
}

export const getCurrentUserRes: TGetCurrentUserRes = () =>
  getId(users, { id: 4 })
