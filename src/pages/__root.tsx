import { Toaster } from '@/components/ui/toaster'
import { Outlet, ScrollRestoration, createRootRoute } from '@tanstack/react-router'
import { _404 } from '@/pages/__404'

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: _404,
})

export function Root() {
  return (
    <>
      <Toaster />
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
