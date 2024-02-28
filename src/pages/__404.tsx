import { NotFoundRoute } from '@tanstack/react-router'
import { Route as _root } from './__root'

export const Route = new NotFoundRoute({
  component: _404,
  getParentRoute: () => _root,
})

export function _404() {
  return (
    <section className="grid min-h-screen place-content-center place-items-center">
      <p>Not Found</p>
    </section>
  )
}

_404.dispalyname = 'Not Found'
