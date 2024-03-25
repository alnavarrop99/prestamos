import { HttpResponse, http } from 'msw'
import _users from '@/mocks/__mock__/USERS.json'
import roles from '@/mocks/__mock__/ROLES.json'
import { TRoles, getRolId } from "@/api/rol"
import { TUser, TUserPostBody } from '@/api/users'

let users = _users

const list = http.all(import.meta.env.VITE_API + '/users/list', async () => {
  return HttpResponse.json<TUser[]>(
    users?.map(({ rol: _rol, clientes: _clientes, ...items }) => {
      const rol = getRolId({ rolId: _rol?.id })?.name ?? 'Usuario'
      const clientes = _clientes?.map(({ id }) => id)
      return { ...items, rol, clientes } as TUser
    })
  )
})

const create = http.post( import.meta.env.VITE_API + '/users/create', async ({ request }) => {
  const newUser = (await request.json()) as TUserPostBody
  if( !newUser ) {
    throw new Error("Fail Body request")
  }
  const { rol_id, ...items } = newUser
  users?.push( { ...items, rol: { id: rol_id }, id: (users?.at(-1)?.id ?? 0) + 1, clientes: [] } )

  return HttpResponse.json<TUser>( { 
    id: (roles?.at(-1)?.id ?? 0) + 1,
    rol: getRolId({ rolId: rol_id })?.name as TRoles ?? "Usuario",
    nombre: newUser?.nombre,
  }, { status: 201 } )
} )

const update = http.patch( import.meta.env.VITE_API + '/users/:usuario_id', async ({params, request }) => {
  const currentUser = (await request.json()) as TUserPostBody
  const { usuario_id } = params as { usuario_id?: string }
  if( !currentUser || !usuario_id ) {
    throw new Error("Fail update request")
  }
  const { rol_id, nombre } = currentUser

  users = users?.map( ({ id, ...items  }) => {
    if( id === Number?.parseInt(usuario_id) ) return ({
      nombre: nombre, 
      clientes: items?.clientes,
      id,
      rol: {
        id: rol_id
      }
    })
    return ({ id, ...items })
  } )

  return HttpResponse.json<TUser>( { 
    id: Number.parseInt(usuario_id),
    rol: getRolId({ rolId: rol_id })?.name as TRoles ?? "Usuario",
    nombre: currentUser?.nombre,
  }, { status: 201 } )
} )

const userId = http.get( import.meta.env.VITE_API + '/users/by_id/:id_usuario', async ({params}) => {
  const { id_usuario } = params as { id_usuario: string }
  const user = users?.find( ({ id }) => id === Number.parseInt(id_usuario) )
  if( !id_usuario || !user ) {
    throw new Error("Fail get request")
  }
  const { id, nombre, rol: { id: rolId } } = user
  return HttpResponse.json<TUser>({ id, rol: getRolId({ rolId })?.name, nombre }) 
} )

const currentUser = http.get( import.meta.env.VITE_API + '/users/get_current', async () => {
  const user = users?.[0]
  if( !user ) {
    throw new Error("Fail get request")
  }
  const { id, nombre, rol: { id: rolId } } = user
  return HttpResponse.json<TUser>({ id, rol: getRolId({ rolId })?.name, nombre }) 
} )

export default [list, create, update, userId, currentUser]
