import { HttpResponse, http } from 'msw'
import { type TCLIENT_POST_BODY, type TCLIENT_GET_ALL, TCLIENT_GET, TCLIENT_POST, TCLIENT_PATCH_BODY, TCLIENT_PATCH, TCLIENT_DELETE } from '@/api/clients'
import { clients, token, users } from './data'
import { TROLES, getRolById, getRolByName } from '@/lib/type/rol'

const allClients = http.all(import.meta.env.VITE_API + '/clientes/list', async ({request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  return HttpResponse.json<TCLIENT_GET_ALL>( Array.from(clients?.values()))
})

const createClient = http.post( import.meta.env.VITE_API + '/clientes/create', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const newClient = (await request.json()) as TCLIENT_POST_BODY
  if( !newClient ) throw new Error("Fail post request")

  clients?.set( clients?.size + 1, { ...newClient, id: (clients?.get(clients?.size)?.id ?? 0) + 1 } )

  return HttpResponse.json<TCLIENT_POST>( clients?.get(clients?.size) , { status: 201 } )
} )

const updateClientById = http.patch( import.meta.env.VITE_API + '/clientes/:cliente_id', async ({params, request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const currentClient = (await request.json()) as TCLIENT_PATCH_BODY
  const { cliente_id: cliente_id } = params as { cliente_id?: string }
  if( !currentClient || !cliente_id ) throw new Error("Fail update request")

  const clientId = +cliente_id
  const client = clients?.get(clientId)
  if(!client) throw new Error("Client not found")

  clients?.set( clientId, { ...client, ...currentClient } )

  return HttpResponse.json<TCLIENT_PATCH>( clients?.get(clientId) )
} )

const getClientById = http.get( import.meta.env.VITE_API + '/clientes/by_id/:cliente_id', async ({params, request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { cliente_id } = params as { cliente_id: string }
  if( !cliente_id || !clients?.has( +cliente_id ) ) throw new Error("Fail get request")

  const clientId = +cliente_id
  const client = clients?.get(clientId)
  if(!client) throw new Error("Client not found")

  const { owner_id, ...items } = client

  if( !client.owner_id ) throw new Error("not's defined a owner id field")
  const user = users?.get( client.owner_id )

  if( !user ) throw new Error("not exist a user owner in the data base")

  return HttpResponse.json<TCLIENT_GET>({
    ...items,
    id: items?.id ?? client.id ?? 0,
    owner: {
      id: client.owner_id,
      rol_id: getRolByName({ rolName: users?.get( client.owner_id )?.nombre as TROLES })?.id,
      nombre: getRolByName({ rolName: users?.get( client.owner_id )?.nombre as TROLES })?.nombre,
    },
  }) 
} )

const deleteClientById = http.delete( import.meta.env.VITE_API + '/clientes/delete/:cliente_id', async ( { params, request } ) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { cliente_id } = params as { cliente_id: string }
  if( !cliente_id || !clients?.has( +cliente_id ) ) throw new Error("fail delete request")

  const clientId = +cliente_id
  const client = clients?.get( clientId )
  if(!client) throw new Error("client not found")

  clients?.delete( clientId )

  return HttpResponse.json<TCLIENT_DELETE>(client) 
})

export default [
  allClients,
  createClient,
  updateClientById,
  getClientById,
  deleteClientById
]
