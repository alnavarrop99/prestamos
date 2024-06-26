import { NotFoundRoute } from '@tanstack/react-router'
import { Route as _root } from '@/pages/__root'
import { SearchX } from 'lucide-react'
import { useEffect } from 'react';
import { main as text } from "@/locale/404";

export const Route = new NotFoundRoute({
  component: _404,
  getParentRoute: () => _root,
})

export function _404() {

  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  return (
    <section className="grid min-h-screen place-content-center place-items-center">
      <div className="subgrid grid-row-3 grid place-items-center justify-start">
        <SearchX className="row-span-2 h-24 w-24 animate-bounce" />
        <h1 className="text-4xl font-bold">{text.title}</h1>
        <h2 className="text-2xl">{text.description}</h2>
      </div>
    </section>
  )
}

_404.dispalyname = 'Not Found'
