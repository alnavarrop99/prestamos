import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: Navigation,
})

export function Navigation({ children }: React.PropsWithChildren) {
  return <div className="container m-auto">{children ?? <Outlet />}</div>
}

Navigation.dispalyname = 'Navigation'
