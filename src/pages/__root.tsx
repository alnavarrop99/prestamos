import { Toaster } from '@/components/ui/toaster'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { _404 } from '@/pages/__404'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

export const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: _404,
})

export function Root() {
   return ( <div className={clsx("md:py-2 min-h-screen xl:h-auto",
        "bg-background bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]",
        "dark:bg-[radial-gradient(#bbabab1f_1px,#00091d_1px)] dark:bg-[size:20px_20px]",
    )}> 
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Outlet />
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  )
}
