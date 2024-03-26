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
  comentarios: string
  estado: number
  referencia_id?: number
  id: number
}

export interface TClient extends TClientBase {
  owner?: TUser 
}

export interface TClientList extends TClientBase {
  owner_id?: number 
}

type TGetClientId = ( params: { clientId: number } ) => TClient 
type TGetClients = () => TClient[]
type TGetClientIdRes = ({params}: { params: { clientId: string } }) => Promise<TClient>
type TGetClientsListRes = () => Promise<TClientList[]>
type TGetClientsRes = () => Promise<TClient[]>

export const getClientId: TGetClientId = ( {clientId} ) => getId( clients, { id: clientId } )
export const getClients: TGetClients = () => gets( clients )
export const getClientIdRes: TGetClientIdRes = async ({params: {clientId} }) => getClientId({ clientId: Number.parseInt(clientId) })

export const getClientsListRes: TGetClientsListRes =  async () => {
  const res = await fetch(import.meta.env.VITE_API + "/clientes/list", {
    method: "GET"
  })
  const clients: TClientList[] = await res.json()
  return clients
}

export const getClientsRes: TGetClientsRes =  async () => {
  const users = await getUsersRes()
  const clients = await getClientsListRes()
  return clients?.map( ( { owner_id, ...items } ) => {
    const owner = users?.find( ({ id }) => owner_id === id )
    return ({ owner, ...items })
  } )
}
