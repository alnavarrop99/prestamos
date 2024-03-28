import { HttpResponse, http } from 'msw'
import _clients from '@/mocks/__mock__/CLIENTS.json'
import { type TClientPostBody, type TClientList } from '@/api/clients'

type TClIENT_DB = typeof _clients[0]
export const clients = new Map<number, TClIENT_DB>( _clients?.map( ( { id }, i, list ) => ([ id, (list?.[i] ?? {} as TClIENT_DB) ]) ) )

const allClients = http.all(import.meta.env.VITE_API + '/clientes/list', async () => {
  return HttpResponse.json<TClientList[]>(
    Array.from(clients?.values())?.map(({ owner: { id: ownerId }, ...items }) => ({ owner_id: ownerId, ...items }))
  )
})

const createClient = http.post( import.meta.env.VITE_API + '/clientes/create', async ({ request }) => {
  const newClient = (await request.json()) as TClientPostBody
  if( !newClient ) {
    throw new Error("Fail post request")
  }
  const { referencia_id, ...items } = newClient
  clients?.set( clients?.size + 1, {  ...items, owner: { id: 0 }, id: (clients?.get(clients?.size)?.id ?? 0) + 1, referencia_id: referencia_id ?? 0 } )

  return HttpResponse.json<TClientList>( {
    id: (clients?.get(clients?.size)?.id ?? 0),
    ...newClient
  }, { status: 201 } )
} )

const updateClientById = http.patch( import.meta.env.VITE_API + '/clientes/:cliente_id', async ({params, request }) => {
  const currentClient = (await request.json()) as TClientPostBody
  const { cliente_id: cliente_id } = params as { cliente_id?: string }
  if( !currentClient || !cliente_id ) {
    throw new Error("Fail update request")
  }
  const clientId = Number.parseInt(cliente_id)
  clients?.set( clientId, { ...(clients?.get(clientId) ?? {} as TClIENT_DB), ...currentClient } )

  return HttpResponse.json<TClientList>({
    ...currentClient,
    id: Number.parseInt(cliente_id),
  })
} )

const getClientById = http.get( import.meta.env.VITE_API + '/clientes/by_id/:cliente_id', async ({params}) => {
  const { cliente_id } = params as { cliente_id: string }
  if( !cliente_id || !clients?.has( Number.parseInt(cliente_id) ) ) {
    throw new Error("Fail get request")
  }
  const clientId = Number.parseInt(cliente_id)

  const { owner: { id: ownerId }, ...items } = clients?.get(clientId) ?? {} as TClIENT_DB
  return HttpResponse.json<TClientList>({ ...items, owner_id: ownerId }) 
} )

const deleteClientById = http.delete( import.meta.env.VITE_API + '/clientes/delete/:cliente_id', async ( { params } ) => {
  const { cliente_id } = params as { cliente_id: string }
  if( !cliente_id || !clients?.has( Number.parseInt(cliente_id) ) ) {
    throw new Error("Fail delete request")
  }
  const clientId = Number.parseInt(cliente_id)
  const deleteClient = clients?.get( clientId ) ?? {} as TClIENT_DB
  clients?.delete( clientId )

  const { owner: { id: ownerId }, ...items } = deleteClient
  return HttpResponse.json<TClientList>({ ...items, owner_id: ownerId }) 
})

export default [
  allClients,
  createClient,
  updateClientById,
  getClientById,
  deleteClientById
]
