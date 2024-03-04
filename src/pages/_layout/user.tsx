import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user')({
  component: User,
})

export function User() {
  return (
    <div>
      <h1 className="text-3xl font-bold">{text.title}</h1>
    </div>
  )
}

User.dispalyname = 'User'

const text = {
  title: 'Usuarios:',
}
