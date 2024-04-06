import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  createMemoryHistory,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'

const createCustomRoute = (component: () => JSX.Element) => {
  const rootRoute = new RootRoute({
    component: Outlet,
  })

  const route = new Route({
    component: component,
    getParentRoute: () => rootRoute,
    path: '/',
  })

  const router = new Router({
    routeTree: rootRoute.addChildren([route]),
    history: createMemoryHistory(),
  })

  return router
}

function customRenderRoute(router: Router) {
  return <RouterProvider router={router} />
}

function customRenderStorie(component?: () => JSX.Element) {
  return customRenderRoute(createCustomRoute(component ?? (() => <></>)))
}

function customRenderTest(component?: () => JSX.Element) {
  return render(
    customRenderRoute(createCustomRoute(component ?? (() => <></>)))
  )
}

export default {
  customRenderTest,
  customRenderStorie,
}
