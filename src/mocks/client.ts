import { HttpResponse, http } from 'msw'
import _clients from '@/mocks/__mock__/CLIENTS.json'
import { type TClientPostBody, type TClientList } from '@/api/clients'

let clients = _clients

const listClient = http.all(import.meta.env.VITE_API + '/clientes/list', async () => {
  return HttpResponse.json<TClientList[]>(
    clients?.map(({ owner: { id: ownerId }, ...items }) => ({ owner_id: ownerId, ...items }))
  )
})

const createClient = http.post( import.meta.env.VITE_API + '/clientes/create', async ({ request }) => {
  const newClient = (await request.json()) as TClientPostBody
  if( !newClient ) {
    throw new Error("Fail Body request")
  }
  const { referencia_id, ...items } = newClient
  clients?.push( { ...items, owner: { id: 0 }, id: (clients?.at(-1)?.id ?? 0) + 1, referencia_id: referencia_id ?? 0   } )

  return HttpResponse.json<TClientList>( {
    ...newClient,
    id: (clients?.at(-1)?.id ?? 0) + 1
  }, { status: 201 } )
} )

const updateClient = http.patch( import.meta.env.VITE_API + '/clientes/:cliente_id', async ({params, request }) => {
  const currentClient = (await request.json()) as TClientPostBody
  const { cliente_id: cliente_id } = params as { cliente_id?: string }
  if( !currentClient || !cliente_id ) {
    throw new Error("Fail update request")
  }
  clients = clients?.map( ({ id, ...items  }) => {
    if( id === Number?.parseInt(cliente_id) ) return ({
      id,
      ...items,
      ...currentClient,
    })
    return ({ id, ...items })
  } )

  return HttpResponse.json<TClientList>({
    id: Number.parseInt(cliente_id),
    ...currentClient,
  })
} )

const getClientId = http.get( import.meta.env.VITE_API + '/clientes/by_id/:cliente_id', async ({params}) => {
  const { cliente_id } = params as { cliente_id: string }
  const cliente = clients?.find( ({ id }) => id === Number.parseInt(cliente_id) )
  if( !cliente_id || !cliente ) {
    throw new Error("Fail get request")
  }
  const { owner: { id: ownerId }, ...items } = cliente
  return HttpResponse.json<TClientList>({ ...items, owner_id: ownerId }) 
} )

const deleteClientId = http.delete( import.meta.env.VITE_API + '/clientes/delete/:cliente_id', async ( { params } ) => {
  const { cliente_id } = params as { cliente_id: string }
  const deleteClient = clients?.find( ({ id }) => (id === Number.parseInt(cliente_id)) )
  if( !cliente_id || !deleteClient ) {
    throw new Error("Fail delete request")
  }
  clients = clients?.filter( ({ id }) => (id !== Number.parseInt(cliente_id)))
  const { owner: { id: ownerId }, ...items } = deleteClient
  return HttpResponse.json<TClientList>({ owner_id: ownerId, ...items   }) 
})

export default [
  listClient,
  createClient,
  updateClient,
  getClientId,
  deleteClientId
]
