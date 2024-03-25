import { HttpResponse, http } from 'msw'
import _users from '@/mocks/__mock__/USERS.json'
import roles from '@/mocks/__mock__/ROLES.json'

const users = _users

const list = http.all(import.meta.env.VITE_API + '/users/list', () => {
  return HttpResponse.json(
    users?.map(({ rol: _rol, clientes: _clientes, ...items }) => {
      const rol =
        roles?.find(({ id: rolId }) => rolId === _rol.id)?.name ?? 'Usuario'
      const clientes = _clientes?.map(({ id }) => id)
      return { ...items, rol, clientes }
    })
  )
})

export default [list]
