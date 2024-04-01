import { getUsersList, type TUSER_GET } from "@/api/users"
import { useToken } from "@/lib/context/login"

interface TClientBase  {
  nombres: string
  apellidos: string
  tipo_de_identificacion: number
  numero_de_identificacion: string
  celular: string
  telefono: string
  email: string
  direccion: string
  estado: number
  referencia_id?: number
  comentarios: string
}

export type TClientPostBody = TClientBase

export interface TClient extends TClientBase {
  id: number
  owner?: TUSER_GET 
}

export interface TClientList extends TClientBase {
  id: number
  owner_id?: number 
}

type TGetClientIdRes = ({params}: { params: { clientId: string } }) => Promise<TClient>
type TGetClientsListRes = () => Promise<TClientList[]>
type TGetClientsRes = () => Promise<TClient[]>
type TPostClientIdRes = ( params: TClientPostBody ) => Promise<TClientList> 
type TDeleteClientIdRes = ( params: { clientId: number } ) => Promise<TClientList> 
type TPatchClientIdRes = ( { params, clientId }: { params: TClientPostBody, clientId: number } ) => Promise<TClientList> 

export const getClientIdRes: TGetClientIdRes = async ({params: {clientId} }) =>{
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const res = await fetch(import.meta.env.VITE_API + "/clientes/by_id/" + clientId, {
    method: "GET",
    headers
  })
  return await res.json()
} 

export const getClientsListRes: TGetClientsListRes =  async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const res = await fetch(import.meta.env.VITE_API + "/clientes/list", {
    method: "GET",
    headers
  })
  return await res.json()
}

export const getClientsRes: TGetClientsRes =  async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const users = await getUsersList()
  const clients = await getClientsListRes()
  return clients?.map( ( { owner_id, ...items } ) => {
    const owner = users?.find( ({ id }) => owner_id === id )
    return ({ owner, ...items })
  } )
}

export const postClientsRes: TPostClientIdRes =  async ( params ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization", "Bearer " + token)

  const res = await fetch(import.meta.env.VITE_API + "/clientes/create", {
    method: "POST",
    body: JSON.stringify(params),
    headers
  })
  return res.json()
}

export const deleteClientsIdRes: TDeleteClientIdRes =  async ( { clientId } ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const res = await fetch(import.meta.env.VITE_API + "/clientes/delete/" + clientId, {
    method: "DELETE",
    headers,
  })
  return res.json()
}

export const pathClientsIdRes: TPatchClientIdRes =  async ( { clientId, params } ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const res = await fetch(import.meta.env.VITE_API + "/clientes/" + clientId, {
    method: "PATCH",
    body: JSON.stringify(params),
    headers
  })
  return res.json()
}
