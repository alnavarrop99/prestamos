import { HttpResponse, http } from 'msw'
import users from '@/mocks/__mock__/USERS.json'
import roles from '@/mocks/__mock__/ROLES.json'

const list = http.all(import.meta.env.VITE_API + '/users/list', () => {
  return HttpResponse.json(
    users?.map(({ rol: _rol, ...items }) => {
      const rol =
        roles?.find(({ id: rolId }) => rolId === _rol.id)?.name ?? 'Usuario'
      return { ...items, rol }
    })
  )
})

export default [list]
