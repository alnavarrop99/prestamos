import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/$id')({
  component: User,
})

import clients from '@/__mock__/mocks-clients.json'

export function User() {
  const { id } = useParams({ strict: false }) as Record<'id', string>
  const user = clients?.find(({ id: _id }) => id === _id)
  return (
    <div>
      <p>Name: {user?.firstName}</p>
      <p>LastName: {user?.firstName}</p>
      <p>Alias: {user?.alias}</p>
      <p>Phone: {user?.phone}</p>
      <p>Email: {user?.email}</p>
    </div>
  )
}

User.dispalyname = 'User'
