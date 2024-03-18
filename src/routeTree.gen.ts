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
import { Route as LayoutUserNewImport } from './pages/_layout/user/new'
import { Route as LayoutUserDeleteImport } from './pages/_layout/user/delete'
import { Route as LayoutCreditCreditIdImport } from './pages/_layout/credit_/$creditId'
import { Route as LayoutCreditPrintImport } from './pages/_layout/credit/print'
import { Route as LayoutCreditPayImport } from './pages/_layout/credit/pay'
import { Route as LayoutCreditNewImport } from './pages/_layout/credit/new'
import { Route as LayoutClientNewImport } from './pages/_layout/client/new'
import { Route as LayoutClientDeleteImport } from './pages/_layout/client/delete'
import { Route as LayoutUserUserIdUpdateImport } from './pages/_layout/user/$userId/update'
import { Route as LayoutUserUserIdDeleteImport } from './pages/_layout/user/$userId/delete'
import { Route as LayoutCreditCreditIdUpdateImport } from './pages/_layout/credit_/$creditId_/update'
import { Route as LayoutCreditCreditIdPrintImport } from './pages/_layout/credit_/$creditId/print'
import { Route as LayoutCreditCreditIdPayImport } from './pages/_layout/credit_/$creditId/pay'
import { Route as LayoutCreditCreditIdDeleteImport } from './pages/_layout/credit_/$creditId/delete'
import { Route as LayoutClientClientIdUpdateImport } from './pages/_layout/client/$clientId/update'
import { Route as LayoutClientClientIdDeleteImport } from './pages/_layout/client/$clientId/delete'
import { Route as LayoutCreditCreditIdUpdateConfirmImport } from './pages/_layout/credit_/$creditId_/update.confirm'

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

const LayoutUserNewRoute = LayoutUserNewImport.update({
  path: '/new',
  getParentRoute: () => LayoutUserRoute,
} as any)

const LayoutUserDeleteRoute = LayoutUserDeleteImport.update({
  path: '/delete',
  getParentRoute: () => LayoutUserRoute,
} as any)

const LayoutCreditCreditIdRoute = LayoutCreditCreditIdImport.update({
  path: '/credit/$creditId',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutCreditPrintRoute = LayoutCreditPrintImport.update({
  path: '/print',
  getParentRoute: () => LayoutCreditRoute,
} as any)

const LayoutCreditPayRoute = LayoutCreditPayImport.update({
  path: '/pay',
  getParentRoute: () => LayoutCreditRoute,
} as any)

const LayoutCreditNewRoute = LayoutCreditNewImport.update({
  path: '/new',
  getParentRoute: () => LayoutCreditRoute,
} as any)

const LayoutClientNewRoute = LayoutClientNewImport.update({
  path: '/new',
  getParentRoute: () => LayoutClientRoute,
} as any)

const LayoutClientDeleteRoute = LayoutClientDeleteImport.update({
  path: '/delete',
  getParentRoute: () => LayoutClientRoute,
} as any)

const LayoutUserUserIdUpdateRoute = LayoutUserUserIdUpdateImport.update({
  path: '/$userId/update',
  getParentRoute: () => LayoutUserRoute,
} as any)

const LayoutUserUserIdDeleteRoute = LayoutUserUserIdDeleteImport.update({
  path: '/$userId/delete',
  getParentRoute: () => LayoutUserRoute,
} as any)

const LayoutCreditCreditIdUpdateRoute = LayoutCreditCreditIdUpdateImport.update(
  {
    path: '/credit/$creditId/update',
    getParentRoute: () => LayoutRoute,
  } as any
)

const LayoutCreditCreditIdPrintRoute = LayoutCreditCreditIdPrintImport.update({
  path: '/print',
  getParentRoute: () => LayoutCreditCreditIdRoute,
} as any)

const LayoutCreditCreditIdPayRoute = LayoutCreditCreditIdPayImport.update({
  path: '/pay',
  getParentRoute: () => LayoutCreditCreditIdRoute,
} as any)

const LayoutCreditCreditIdDeleteRoute = LayoutCreditCreditIdDeleteImport.update(
  {
    path: '/delete',
    getParentRoute: () => LayoutCreditCreditIdRoute,
  } as any
)

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

const LayoutCreditCreditIdUpdateConfirmRoute =
  LayoutCreditCreditIdUpdateConfirmImport.update({
    path: '/confirm',
    getParentRoute: () => LayoutCreditCreditIdUpdateRoute,
  } as any)

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
    '/_layout/credit/new': {
      preLoaderRoute: typeof LayoutCreditNewImport
      parentRoute: typeof LayoutCreditImport
    }
    '/_layout/credit/pay': {
      preLoaderRoute: typeof LayoutCreditPayImport
      parentRoute: typeof LayoutCreditImport
    }
    '/_layout/credit/print': {
      preLoaderRoute: typeof LayoutCreditPrintImport
      parentRoute: typeof LayoutCreditImport
    }
    '/_layout/credit/$creditId': {
      preLoaderRoute: typeof LayoutCreditCreditIdImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user/delete': {
      preLoaderRoute: typeof LayoutUserDeleteImport
      parentRoute: typeof LayoutUserImport
    }
    '/_layout/user/new': {
      preLoaderRoute: typeof LayoutUserNewImport
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
    '/_layout/credit/$creditId/delete': {
      preLoaderRoute: typeof LayoutCreditCreditIdDeleteImport
      parentRoute: typeof LayoutCreditCreditIdImport
    }
    '/_layout/credit/$creditId/pay': {
      preLoaderRoute: typeof LayoutCreditCreditIdPayImport
      parentRoute: typeof LayoutCreditCreditIdImport
    }
    '/_layout/credit/$creditId/print': {
      preLoaderRoute: typeof LayoutCreditCreditIdPrintImport
      parentRoute: typeof LayoutCreditCreditIdImport
    }
    '/_layout/credit/$creditId/update': {
      preLoaderRoute: typeof LayoutCreditCreditIdUpdateImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user/$userId/delete': {
      preLoaderRoute: typeof LayoutUserUserIdDeleteImport
      parentRoute: typeof LayoutUserImport
    }
    '/_layout/user/$userId/update': {
      preLoaderRoute: typeof LayoutUserUserIdUpdateImport
      parentRoute: typeof LayoutUserImport
    }
    '/_layout/credit/$creditId/update/confirm': {
      preLoaderRoute: typeof LayoutCreditCreditIdUpdateConfirmImport
      parentRoute: typeof LayoutCreditCreditIdUpdateImport
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
    LayoutCreditRoute.addChildren([
      LayoutCreditNewRoute,
      LayoutCreditPayRoute,
      LayoutCreditPrintRoute,
    ]),
    LayoutUserRoute.addChildren([
      LayoutUserDeleteRoute,
      LayoutUserNewRoute,
      LayoutUserUserIdDeleteRoute,
      LayoutUserUserIdUpdateRoute,
    ]),
    LayoutIndexRoute,
    LayoutCreditCreditIdRoute.addChildren([
      LayoutCreditCreditIdDeleteRoute,
      LayoutCreditCreditIdPayRoute,
      LayoutCreditCreditIdPrintRoute,
    ]),
    LayoutCreditCreditIdUpdateRoute.addChildren([
      LayoutCreditCreditIdUpdateConfirmRoute,
    ]),
  ]),
  LoginRoute,
])

/* prettier-ignore-end */
