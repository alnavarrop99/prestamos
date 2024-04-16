import { HttpResponse, http } from 'msw'
import { getRolById } from "@/lib/type/rol"
import type { TUSER_LOGIN, TUSER_LOGIN_BODY, TUSER_GET, TUSER_POST_BODY } from '@/api/users'
import { users, token } from '@/mocks/data'

const loginUser = http.post(import.meta.env.VITE_API + '/users/login', async ({ request }) => {
  const { username, password } =  Object.fromEntries( (await request.formData())?.entries() ) as TUSER_LOGIN_BODY

  if( !username || !password ) throw new Error("Fail request params")
  if( username !== "admin" || password !== "app2002" ) throw new Error("username and password are be incorrect")

  return HttpResponse.json<TUSER_LOGIN>({
    access_token: token
  })
})

const listUsers = http.all(import.meta.env.VITE_API + '/users/list', async ( { request } ) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")
  return HttpResponse.json<TUSER_GET[]>( Array.from(users?.values()))
})

const createUser = http.post( import.meta.env.VITE_API + '/users/create', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const newUser = (await request.json()) as TUSER_POST_BODY
  if( !newUser ) throw new Error("Fail Body request")

  const { rol_id, ...items } = newUser
  users?.set( users?.size + 1 , { ...items, rol: getRolById({ rolId: rol_id })?.nombre , id: (users.get(users?.size)?.id ?? 0) + 1, clientes: [] } )
  return HttpResponse.json<TUSER_GET>( users?.get( users?.size ), { status: 201 } )
} )

const updateUserById = http.patch( import.meta.env.VITE_API + '/users/:usuario_id', async ({params, request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const currentUser = (await request.json()) as TUSER_POST_BODY
  const { usuario_id } = params as { usuario_id?: string }

  if( !currentUser || !usuario_id ) throw new Error("Fail update request")

  const userId = +usuario_id
  const user = users?.get(userId)
  const { rol_id, nombre } = currentUser

  if(!user) throw new Error("User not found")
  users?.set( userId, { ...user, nombre, rol: getRolById({ rolId: rol_id })?.nombre } )

  return HttpResponse.json<TUSER_GET>( users?.get(userId) )
})

const userById = http.get( import.meta.env.VITE_API + '/users/by_id/:id_usuario', async ({params, request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { id_usuario } = params as { id_usuario: string }
  if( !id_usuario || !users?.has( Number.parseInt(id_usuario) )) {
    throw new Error("Fail get request")
  }
  const userId = +id_usuario
  const user = users?.get( userId )

  if(!user) throw new Error("User not found")

  return HttpResponse.json<TUSER_GET>(user) 
} )

const currentUser = http.get( import.meta.env.VITE_API + '/users/get_current', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const user = Array.from(users?.values())?.[0]

  if(!user) throw new Error("User not found")

  return HttpResponse.json<TUSER_GET>(user) 
} )

export default [listUsers, createUser, updateUserById, userById, currentUser, loginUser]
