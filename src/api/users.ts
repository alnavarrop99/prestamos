import { useToken } from "@/lib/context/login";

// GET
export type TUSER_GET = {
  id: number
  nombre: string
  rol: string
  clientes?: number[]
}

export type TUSER_GET_ALL = TUSER_GET[]

// POST
export type TUSER_LOGIN = {
  access_token: string
}

export type TUSER_LOGIN_BODY = {
 username: string
 password: string
}

export type TUSER_POST_BODY = {
  nombre: string
  password: string 
  rol_id: number
}


export type TUSER_POST = TUSER_GET

// PATCH
export type TUSER_PATCH_BODY = {
  nombre?: string
  password?: string 
  rol_id?: number
}
export type TUSER_PATCH = TUSER_GET 

// DELETE
export type TUSER_DELETE = TUSER_GET 

type TGetUserLogin = (params: TUSER_LOGIN_BODY ) => Promise<TUSER_LOGIN>
type TGetUserById = ( params: { params: { userId: string } }) => Promise<TUSER_GET>
type TGetUsersList = () => Promise<TUSER_GET_ALL>
type TGetCurrentUser = () => Promise<TUSER_GET>
type TPostUser = (params: TUSER_POST_BODY) => Promise<TUSER_POST>
type TPathUserById = (params: { userId: number , params?: TUSER_PATCH_BODY } ) => Promise<TUSER_PATCH>
// type TDeleteUserById = (params: { userId: number } ) => Promise<TUSER_DELETE>

export const loginUser: TGetUserLogin = async ( params ) => {
  const formData = new FormData()
  for( const [ name, value ] of Object.entries(params) ){
    formData?.set(name, value)
  }

  const res = await fetch(import.meta.env.VITE_API + '/users/login', {
    method: "POST",
    body: formData
  })

  if( !res.ok ) throw Error()

  return res.json()
}

export const getUserById: TGetUserById = async ( { params: { userId } } ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + '/users/by_id/' + userId, {
    method: "GET",
    headers
  })

  if( !res.ok ) throw Error()

  return res.json()
}

export const getUsersList: TGetUsersList = async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + '/users/list', {
    method: "GET",
    headers
  })

  if( !res.ok ) throw Error()

  return res.json()
}

export const postUser: TPostUser = async ( params ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + '/users/create', { 
    method: "POST",
    body: JSON.stringify(params),
    headers
  })

  if( !res.ok ) throw Error()

  return res.json()
}

export const pathUserById: TPathUserById = async ( { userId , params } ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + '/users/' + userId, { 
    method: "PATCH",
    body: JSON.stringify(params),
    headers
  })

  if( !res.ok ) throw Error()

  return res.json()
}

export const getCurrentUser: TGetCurrentUser = async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + '/users/get_current', {
    method: "GET",
    headers
  })

  if( !res.ok ) throw Error()

  return res.json()
}

// TODO: Not Backend definition
// export const deleteUserById: TDeleteUserById = async () => {
//   const { token } = useToken.getState()
//   if( !token ) throw new Error("not auth")
//   const headers = new Headers()
//   headers.append("Authorization","Bearer " +  token)
//
//   const res = await fetch(import.meta.env.VITE_API + '/users/get_current', {
//     method: "GET",
//     headers
//   })
//
//   if( !res.ok ) throw Error()
//
//   return res.json()
// }
