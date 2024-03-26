import { gets, getId } from "@/api/base"
import clients from "@/__mock__/CLIENTS.json"
import { getUsersRes, type TUser } from "./users"

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
  owner?: TUser 
}

export interface TClientList extends TClientBase {
  id: number
  owner_id?: number 
}

type TGetClientId = ( params: { clientId: number } ) => TClient 
type TGetClients = () => TClient[]
type TGetClientIdRes = ({params}: { params: { clientId: string } }) => Promise<TClient>
type TGetClientsListRes = () => Promise<TClientList[]>
type TGetClientsRes = () => Promise<TClient[]>
type TPostClientIdRes = ( params: TClientPostBody ) => Promise<TClientList> 
type TDeleteClientIdRes = ( params: { clientId: number } ) => Promise<TClientList> 
type TPatchClientIdRes = ( { params, clientId }: { params: TClientPostBody, clientId: number } ) => Promise<TClientList> 

export const getClientId: TGetClientId = ( {clientId} ) => getId( clients, { id: clientId } )
export const getClients: TGetClients = () => gets( clients )

export const getClientIdRes: TGetClientIdRes = async ({params: {clientId} }) =>{
  const res = await fetch(import.meta.env.VITE_API + "/clientes/by_id/" + clientId, {
    method: "GET"
  })
  return await res.json()
} 

export const getClientsListRes: TGetClientsListRes =  async () => {
  const res = await fetch(import.meta.env.VITE_API + "/clientes/list", {
    method: "GET"
  })
  return await res.json()
}

export const getClientsRes: TGetClientsRes =  async () => {
  const users = await getUsersRes()
  const clients = await getClientsListRes()
  return clients?.map( ( { owner_id, ...items } ) => {
    const owner = users?.find( ({ id }) => owner_id === id )
    return ({ owner, ...items })
  } )
}

export const postClientsRes: TPostClientIdRes =  async ( params ) => {
  const res = await fetch(import.meta.env.VITE_API + "/clientes/create", {
    method: "POST",
    body: JSON.stringify(params)
  })
  return res.json()
}

export const deleteClientsIdRes: TDeleteClientIdRes =  async ( { clientId } ) => {
  const res = await fetch(import.meta.env.VITE_API + "/clientes/delete/" + clientId, {
    method: "DELETE",
  })
  return res.json()
}

export const pathClientsIdRes: TPatchClientIdRes =  async ( { clientId, params } ) => {
  const res = await fetch(import.meta.env.VITE_API + "/clientes/" + clientId, {
    method: "PATCH",
    body: JSON.stringify(params)
  })
  return res.json()
}
