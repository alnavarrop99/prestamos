import { Toaster } from '@/components/ui/toaster'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { _404 } from '@/pages/__404'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: _404,
})

export function Root() {
  return (
    <>
      <Toaster />
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>
    </>
  )
}
