import { default as _users } from '@/__mock__/USERS.json'
import { getId, gets } from './base'
import { type TRoles } from '@/api/rol'
import { getRolId } from './rol'

const users = _users.map(({ rol: { id: rolId }, ...items }) => ({
  rol: getRolId({ rolId })?.name ?? 'Usuario',
  active: false,
  ...items,
}))

export interface TUser {
  id: number
  nombre: string
  rol: TRoles
  clientes?: number[]
}

export interface TUserPostBody {
  nombre: string
  password: string 
  rol_id: number
}

export interface TUserPatchBody {
  nombre?: string
  password?: string 
  rol_id?: number
}

type TGetUserId = (params: { params: { userId: number } }) => TUser
type TGetUsers = () => TUser[]

type TGetUserIdRes = ( params: { params: { userId: string } }) => Promise<TUser>
type TGetUsersRes = () => Promise<TUser[]>
type TGetCurrentUserRes = () => Promise<TUser>

type TPostUserIdRes = (params: TUserPostBody) => Promise<TUser>
type TPathUserIdRes = (params: { userId: number, params: TUserPatchBody } ) => Promise<TUser>

export const getUserId: TGetUserId = ({ params: { userId } }) =>
  getId(users, { id: userId })

export const getUsers: TGetUsers = () => gets(users)

export const getUserIdRes: TGetUserIdRes = async ( { params: { userId } } ) => {
  const data = await fetch(import.meta.env.VITE_API + '/users/by_id/' + userId, {
    method: "GET"
  })
  if (!data.ok) throw new Error('Failed get users')
  return data.json()
}

export const getUsersRes: TGetUsersRes = async () => {
  const data = await fetch(import.meta.env.VITE_API + '/users/list', {
    method: "GET",
  })
  if (!data.ok) throw new Error('Failed all users')
  return data.json()
}

export const postUsersRes: TPostUserIdRes = async ( params ) => {
  const data = await fetch(import.meta.env.VITE_API + '/users/create', { 
    method: "POST",
    body: JSON.stringify(params)
  })
  if (!data.ok) throw new Error('Failed post users')
  return data.json()
}

export const pathUsersRes: TPathUserIdRes = async ( { userId, params } ) => {
  const data = await fetch(import.meta.env.VITE_API + '/users/' + userId, { 
    method: "PATCH",
    body: JSON.stringify(params)
  })
  if (!data.ok) throw new Error('Failed path users')
  return data.json()
}

export const getCurrentUserRes: TGetCurrentUserRes = async () => {
  const data = await fetch(import.meta.env.VITE_API + '/users/get_current', {
    method: "GET",
  })
  if (!data.ok) throw new Error('Failed get current users')
  return data.json()
}
