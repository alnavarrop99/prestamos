import { useToken } from "@/lib/context/login";
import { TRoles } from "@/lib/type/rol";

export interface TUser {
  id: number
  nombre: string
  rol: TRoles
  clientes?: number[]
}

export interface TUSER_LOGIN {
  access_token: string
}

export interface TUSER_LOGIN_BODY {
 username: string
 password: string
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

type TGetUserLogin = (params: TUSER_LOGIN_BODY ) => Promise<TUSER_LOGIN>
type TGetUserIdRes = ( params: { params: { userId: string } }) => Promise<TUser>
type TGetUsersRes = () => Promise<TUser[]>
type TGetCurrentUserRes = () => Promise<TUser>
type TPostUserIdRes = (params: TUserPostBody) => Promise<TUser>
type TPathUserIdRes = (params: { userId: number, params: TUserPatchBody } ) => Promise<TUser>

export const loginUser: TGetUserLogin = async ( params ) => {
  const data = await fetch(import.meta.env.VITE_API + '/users/login', {
    method: "POST",
    body: JSON.stringify(params)
  })
  return data.json()
}

export const getUserIdRes: TGetUserIdRes = async ( { params: { userId } } ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const data = await fetch(import.meta.env.VITE_API + '/users/by_id/' + userId, {
    method: "GET",
    headers
  })
  return data.json()
}

export const getUsersRes: TGetUsersRes = async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const data = await fetch(import.meta.env.VITE_API + '/users/list', {
    method: "GET",
    headers
  })
  return data.json()
}

export const postUsersRes: TPostUserIdRes = async ( params ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const data = await fetch(import.meta.env.VITE_API + '/users/create', { 
    method: "POST",
    body: JSON.stringify(params),
    headers
  })
  return data.json()
}

export const pathUsersRes: TPathUserIdRes = async ( { userId, params } ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const data = await fetch(import.meta.env.VITE_API + '/users/' + userId, { 
    method: "PATCH",
    body: JSON.stringify(params),
    headers
  })
  return data.json()
}

export const getCurrentUserRes: TGetCurrentUserRes = async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const data = await fetch(import.meta.env.VITE_API + '/users/get_current', {
    method: "GET",
    headers
  })
  return data.json()
}
