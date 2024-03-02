import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user')({
  component: User,
})

export function User() {
  return (
    <div>
      Hello User <Outlet />
    </div>
  )
}

User.dispalyname = 'User'
