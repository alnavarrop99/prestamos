import { useToken } from '@/lib/context/login'

type TOWNER = {
  nombre: string
  rol_id?: number
  id?: number
}

// GET
export type TCLIENT_GET_BASE = {
  nombres: string
  apellidos: string
  tipo_de_identificacion_id: number
  numero_de_identificacion: string
  celular: string
  telefono: string
  email: string
  direccion: string
  comentarios: string
  estado: number
  referencia_id?: number | null
  id?: number
  owner_id?: number
}

export type TCLIENT_GET = {
  nombres: string
  apellidos: string
  tipo_de_identificacion_id: number
  numero_de_identificacion: string
  celular: string
  telefono: string
  email: string
  direccion: string
  comentarios: string
  estado: number
  id: number
  owner: TOWNER
  referencia_id?: number | null
}

export type TCLIENT_GET_ALL = TCLIENT_GET_BASE[]

// POST
export type TCLIENT_POST = TCLIENT_GET_BASE

export type TCLIENT_POST_BODY = {
  nombres: string
  apellidos: string
  tipo_de_identificacion_id: number
  numero_de_identificacion: string
  celular: string
  telefono: string
  email: string
  direccion: string
  comentarios: string
  estado: number
  referencia_id: number | null
}

// PATCH
export type TCLIENT_PATCH = TCLIENT_GET_BASE

export type TCLIENT_PATCH_BODY = {
  nombres?: string
  apellidos?: string
  tipo_de_identificacion_id?: number
  numero_de_identificacion?: string
  celular?: string
  telefono?: string
  email?: string
  direccion?: string
  comentarios?: string
  estado?: number
  referencia_id?: number | null
}

// DELETE
export type TCLIENT_DELETE = TCLIENT_GET_BASE

type TGetClientById = (params: {
  params: { clientId: string }
}) => Promise<TCLIENT_GET>
type TGetClientsList = () => Promise<TCLIENT_GET_ALL>
type TPostClient = (params: TCLIENT_POST_BODY) => Promise<TCLIENT_POST>
type TDeleteClientById = (params: {
  clientId: number
}) => Promise<TCLIENT_DELETE>
type TPatchClientById = (params: {
  clientId: number
  params?: TCLIENT_PATCH_BODY
}) => Promise<TCLIENT_PATCH>

export const getClientById: TGetClientById = async ({
  params: { clientId },
}) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(
    import.meta.env.VITE_API + '/clientes/by_id/' + clientId,
    {
      method: 'GET',
      headers,
    }
  )

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return await res.json()
}

export const getClientsList: TGetClientsList = async () => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(import.meta.env.VITE_API + '/clientes/list', {
    method: 'GET',
    headers,
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return await res.json()
}

export const postClient: TPostClient = async (params) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(import.meta.env.VITE_API + '/clientes/create', {
    method: 'POST',
    body: JSON.stringify(params),
    headers,
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return await res.json()
}

export const deleteClientsById: TDeleteClientById = async ({ clientId }) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(
    import.meta.env.VITE_API + '/clientes/delete/' + clientId,
    {
      method: 'DELETE',
      headers,
    }
  )

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const pathClientById: TPatchClientById = async ({
  clientId,
  params,
}) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(import.meta.env.VITE_API + '/clientes/' + clientId, {
    method: 'PATCH',
    body: JSON.stringify(params),
    headers,
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}
