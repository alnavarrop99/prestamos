import { HttpResponse, http } from 'msw'
import { TRoles, getRolById } from "@/lib/type/rol"
import { TUSER_LOGIN, TUSER_LOGIN_BODY, TUser, TUserPostBody } from '@/api/users'
import { type TUSER_DB, users, token } from './data'

const loginUser = http.post(import.meta.env.VITE_API + '/users/login', async ({ request }) => {
  const { username, password } = (await request.json()) as TUSER_LOGIN_BODY

  if( !username || !password ){
    throw new Error("Fail request params")
  }

  if( username !== "admin" || password !== "app2002" ){
    throw new Error("Fail request value")
  }

  return HttpResponse.json<TUSER_LOGIN>({
    access_token: token
  })
})

const listUsers = http.all(import.meta.env.VITE_API + '/users/list', async ( { request } ) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  return HttpResponse.json<TUser[]>(
    Array.from(users?.values())?.map(({ rol: _rol, clientes: _clientes, ...items }) => {
      const rol = getRolById({ rolId: _rol?.id })?.nombre ?? 'Usuario'
      const clientes = _clientes?.map(({ id }) => id)
      return { ...items, rol, clientes } as TUser
    })
  )
})

const createUser = http.post( import.meta.env.VITE_API + '/users/create', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const newUser = (await request.json()) as TUserPostBody
  if( !newUser ) {
    throw new Error("Fail Body request")
  }
  const { rol_id, ...items } = newUser
  users?.set( users?.size + 1 , { ...items, rol: { id: rol_id }, id: (users.get(users?.size)?.id ?? 0) + 1, clientes: [] } )

  return HttpResponse.json<TUser>( { 
    id: (users?.get(users.size)?.id ?? 0),
    rol: getRolById({ rolId: rol_id })?.nombre as TRoles ?? "Usuario",
    nombre: newUser?.nombre,
  }, { status: 201 } )
} )

const updateUserById = http.patch( import.meta.env.VITE_API + '/users/:usuario_id', async ({params, request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const currentUser = (await request.json()) as TUserPostBody
  const { usuario_id } = params as { usuario_id?: string }
  if( !currentUser || !usuario_id ) {
    throw new Error("Fail update request")
  }
  const userId = Number.parseInt( usuario_id )
  const { rol_id, nombre } = currentUser

  users?.set( userId, { ...(users?.get(userId) ?? {} as TUSER_DB), nombre, rol: { id: rol_id }  } )

  return HttpResponse.json<TUser>( { 
    id: users.get( userId )?.id ?? 0,
    rol: getRolById({ rolId: rol_id })?.nombre as TRoles ?? "Usuario",
    nombre: users.get( userId )?.nombre ?? "",
  })
})

const userById = http.get( import.meta.env.VITE_API + '/users/by_id/:id_usuario', async ({params, request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { id_usuario } = params as { id_usuario: string }
  if( !id_usuario || !users?.has( Number.parseInt(id_usuario) )) {
    throw new Error("Fail get request")
  }
  const userId = Number.parseInt(id_usuario)
  const { id, nombre, rol: { id: rolId } } = users?.get( userId ) ?? {} as TUSER_DB
  return HttpResponse.json<TUser>({ id, rol: getRolById({ rolId })?.nombre, nombre }) 
} )

const currentUser = http.get( import.meta.env.VITE_API + '/users/get_current', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const user = Array.from(users?.values())?.[0]
  if( !user ) {
    throw new Error("Fail get request")
  }
  const { id, nombre, rol: { id: rolId } } = user
  return HttpResponse.json<TUser>({ id, rol: getRolById({ rolId })?.nombre, nombre }) 
} )

export default [listUsers, createUser, updateUserById, userById, currentUser, loginUser]
