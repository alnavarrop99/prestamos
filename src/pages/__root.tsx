import { Toaster } from '@/components/ui/toaster'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: Root,
})

export function Root() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}
