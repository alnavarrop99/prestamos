import { HttpResponse, http } from 'msw'
import _users from '@/mocks/__mock__/USERS.json'
import { TRoles, getRolId } from "@/api/rol"
import { TUser, TUserPostBody } from '@/api/users'

type TUserDB = typeof _users[0]
const users = new Map<number, TUserDB>( _users?.map( ( { id }, i, list ) => [ id, (list?.[i]) ] ) )

const listUsers = http.all(import.meta.env.VITE_API + '/users/list', async () => {
  return HttpResponse.json<TUser[]>(
    Array.from(users?.values())?.map(({ rol: _rol, clientes: _clientes, ...items }) => {
      const rol = getRolId({ rolId: _rol?.id })?.name ?? 'Usuario'
      const clientes = _clientes?.map(({ id }) => id)
      return { ...items, rol, clientes } as TUser
    })
  )
})

const createUser = http.post( import.meta.env.VITE_API + '/users/create', async ({ request }) => {
  const newUser = (await request.json()) as TUserPostBody
  if( !newUser ) {
    throw new Error("Fail Body request")
  }
  const { rol_id, ...items } = newUser
  users?.set( users?.size + 1 , { ...items, rol: { id: rol_id }, id: (users.get(users?.size)?.id ?? 0) + 1, clientes: [] } )

  return HttpResponse.json<TUser>( { 
    id: (users?.get(users.size)?.id ?? 0),
    rol: getRolId({ rolId: rol_id })?.name as TRoles ?? "Usuario",
    nombre: newUser?.nombre,
  }, { status: 201 } )
} )

const updateUserById = http.patch( import.meta.env.VITE_API + '/users/:usuario_id', async ({params, request }) => {
  const currentUser = (await request.json()) as TUserPostBody
  const { usuario_id } = params as { usuario_id?: string }
  if( !currentUser || !usuario_id ) {
    throw new Error("Fail update request")
  }
  const userId = Number.parseInt( usuario_id )
  const { rol_id, nombre } = currentUser

  users?.set( userId, { ...(users?.get(userId) ?? {} as TUserDB), nombre, rol: { id: rol_id }  } )

  return HttpResponse.json<TUser>( { 
    id: users.get( userId )?.id ?? 0,
    rol: getRolId({ rolId: rol_id })?.name as TRoles ?? "Usuario",
    nombre: users.get( userId )?.nombre ?? "",
  })
})

const userById = http.get( import.meta.env.VITE_API + '/users/by_id/:id_usuario', async ({params}) => {
  const { id_usuario } = params as { id_usuario: string }
  if( !id_usuario || !users?.has( Number.parseInt(id_usuario) )) {
    throw new Error("Fail get request")
  }
  const userId = Number.parseInt(id_usuario)
  const { id, nombre, rol: { id: rolId } } = users?.get( userId ) ?? {} as TUserDB
  return HttpResponse.json<TUser>({ id, rol: getRolId({ rolId })?.name, nombre }) 
} )

const currentUser = http.get( import.meta.env.VITE_API + '/users/get_current', async () => {
  const user = Array.from(users?.values())?.[0]
  if( !user ) {
    throw new Error("Fail get request")
  }
  const { id, nombre, rol: { id: rolId } } = user
  return HttpResponse.json<TUser>({ id, rol: getRolId({ rolId })?.name, nombre }) 
} )

export default [listUsers, createUser, updateUserById, userById, currentUser]
