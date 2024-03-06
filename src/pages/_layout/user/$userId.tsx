import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/$userId')({
  component: User,
})

export function User() {
  return (
    <div>
      UserID
    </div>
  )
}

User.dispalyname = 'User'
