/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './pages/__root'
import { Route as LoginImport } from './pages/login'
import { Route as LayoutImport } from './pages/_layout'
import { Route as R404Import } from './pages/__404'
import { Route as LayoutIndexImport } from './pages/_layout/index'
import { Route as LayoutUserImport } from './pages/_layout/user'
import { Route as LayoutCreditImport } from './pages/_layout/credit'
import { Route as LayoutClientImport } from './pages/_layout/client'
import { Route as LayoutUserUserIdImport } from './pages/_layout/user/$userId'
import { Route as LayoutClientNewImport } from './pages/_layout/client/new'
import { Route as LayoutClientDeleteImport } from './pages/_layout/client/delete'
import { Route as LayoutClientClientIdUpdateImport } from './pages/_layout/client/$clientId.update'
import { Route as LayoutClientClientIdDeleteImport } from './pages/_layout/client/$clientId.delete'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const R404Route = R404Import.update({
  id: '/__404',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUserRoute = LayoutUserImport.update({
  path: '/user',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutCreditRoute = LayoutCreditImport.update({
  path: '/credit',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutClientRoute = LayoutClientImport.update({
  path: '/client',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUserUserIdRoute = LayoutUserUserIdImport.update({
  path: '/$userId',
  getParentRoute: () => LayoutUserRoute,
} as any)

const LayoutClientNewRoute = LayoutClientNewImport.update({
  path: '/new',
  getParentRoute: () => LayoutClientRoute,
} as any)

const LayoutClientDeleteRoute = LayoutClientDeleteImport.update({
  path: '/delete',
  getParentRoute: () => LayoutClientRoute,
} as any)

const LayoutClientClientIdUpdateRoute = LayoutClientClientIdUpdateImport.update(
  {
    path: '/$clientId/update',
    getParentRoute: () => LayoutClientRoute,
  } as any
)

const LayoutClientClientIdDeleteRoute = LayoutClientClientIdDeleteImport.update(
  {
    path: '/$clientId/delete',
    getParentRoute: () => LayoutClientRoute,
  } as any
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/__404': {
      preLoaderRoute: typeof R404Import
      parentRoute: typeof rootRoute
    }
    '/_layout': {
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_layout/client': {
      preLoaderRoute: typeof LayoutClientImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/credit': {
      preLoaderRoute: typeof LayoutCreditImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user': {
      preLoaderRoute: typeof LayoutUserImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/client/delete': {
      preLoaderRoute: typeof LayoutClientDeleteImport
      parentRoute: typeof LayoutClientImport
    }
    '/_layout/client/new': {
      preLoaderRoute: typeof LayoutClientNewImport
      parentRoute: typeof LayoutClientImport
    }
    '/_layout/user/$userId': {
      preLoaderRoute: typeof LayoutUserUserIdImport
      parentRoute: typeof LayoutUserImport
    }
    '/_layout/client/$clientId/delete': {
      preLoaderRoute: typeof LayoutClientClientIdDeleteImport
      parentRoute: typeof LayoutClientImport
    }
    '/_layout/client/$clientId/update': {
      preLoaderRoute: typeof LayoutClientClientIdUpdateImport
      parentRoute: typeof LayoutClientImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  R404Route,
  LayoutRoute.addChildren([
    LayoutClientRoute.addChildren([
      LayoutClientDeleteRoute,
      LayoutClientNewRoute,
      LayoutClientClientIdDeleteRoute,
      LayoutClientClientIdUpdateRoute,
    ]),
    LayoutCreditRoute,
    LayoutUserRoute.addChildren([LayoutUserUserIdRoute]),
    LayoutIndexRoute,
  ]),
  LoginRoute,
])

/* prettier-ignore-end */
