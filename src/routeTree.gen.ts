/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './pages/__root'
import { Route as LayoutImport } from './pages/_layout'
import { Route as R404Import } from './pages/__404'
import { Route as LayoutUserNewImport } from './pages/_layout/user/new'
import { Route as LayoutUserDeleteImport } from './pages/_layout/user/delete'
import { Route as LayoutCreditPrintImport } from './pages/_layout/credit/print'
import { Route as LayoutCreditPayImport } from './pages/_layout/credit/pay'
import { Route as LayoutCreditNewImport } from './pages/_layout/credit/new'
import { Route as LayoutClientNewImport } from './pages/_layout/client/new'
import { Route as LayoutClientDeleteImport } from './pages/_layout/client/delete'
import { Route as LayoutUserUserIdUpdateImport } from './pages/_layout/user/$userId/update'
import { Route as LayoutUserUserIdDeleteImport } from './pages/_layout/user/$userId/delete'
import { Route as LayoutCreditCreditIdPrintImport } from './pages/_layout/credit_/$creditId/print'
import { Route as LayoutCreditCreditIdPayImport } from './pages/_layout/credit_/$creditId/pay'
import { Route as LayoutCreditCreditIdDeleteImport } from './pages/_layout/credit_/$creditId/delete'
import { Route as LayoutClientClientIdUpdateImport } from './pages/_layout/client/$clientId/update'
import { Route as LayoutClientClientIdDeleteImport } from './pages/_layout/client/$clientId/delete'
import { Route as LayoutCreditCreditIdUpdateConfirmImport } from './pages/_layout/credit_/$creditId_/update.confirm'

// Create Virtual Routes

const LoginLazyImport = createFileRoute('/login')()
const LayoutIndexLazyImport = createFileRoute('/_layout/')()
const LayoutUserLazyImport = createFileRoute('/_layout/user')()
const LayoutReportLazyImport = createFileRoute('/_layout/report')()
const LayoutNotificationLazyImport = createFileRoute('/_layout/notification')()
const LayoutCreditLazyImport = createFileRoute('/_layout/credit')()
const LayoutClientLazyImport = createFileRoute('/_layout/client')()
const LayoutCreditCreditIdLazyImport = createFileRoute(
  '/_layout/credit/$creditId',
)()
const LayoutCreditCreditIdUpdateLazyImport = createFileRoute(
  '/_layout/credit/$creditId/update',
)()

// Create/Update Routes

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./pages/login.lazy').then((d) => d.Route))

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const R404Route = R404Import.update({
  id: '/__404',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexLazyRoute = LayoutIndexLazyImport.update({
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() => import('./pages/_layout/index.lazy').then((d) => d.Route))

const LayoutUserLazyRoute = LayoutUserLazyImport.update({
  path: '/user',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() => import('./pages/_layout/user.lazy').then((d) => d.Route))

const LayoutReportLazyRoute = LayoutReportLazyImport.update({
  path: '/report',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() => import('./pages/_layout/report.lazy').then((d) => d.Route))

const LayoutNotificationLazyRoute = LayoutNotificationLazyImport.update({
  path: '/notification',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() =>
  import('./pages/_layout/notification.lazy').then((d) => d.Route),
)

const LayoutCreditLazyRoute = LayoutCreditLazyImport.update({
  path: '/credit',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() => import('./pages/_layout/credit.lazy').then((d) => d.Route))

const LayoutClientLazyRoute = LayoutClientLazyImport.update({
  path: '/client',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() => import('./pages/_layout/client.lazy').then((d) => d.Route))

const LayoutCreditCreditIdLazyRoute = LayoutCreditCreditIdLazyImport.update({
  path: '/credit/$creditId',
  getParentRoute: () => LayoutRoute,
} as any).lazy(() =>
  import('./pages/_layout/credit_/$creditId.lazy').then((d) => d.Route),
)

const LayoutUserNewRoute = LayoutUserNewImport.update({
  path: '/new',
  getParentRoute: () => LayoutUserLazyRoute,
} as any)

const LayoutUserDeleteRoute = LayoutUserDeleteImport.update({
  path: '/delete',
  getParentRoute: () => LayoutUserLazyRoute,
} as any)

const LayoutCreditPrintRoute = LayoutCreditPrintImport.update({
  path: '/print',
  getParentRoute: () => LayoutCreditLazyRoute,
} as any)

const LayoutCreditPayRoute = LayoutCreditPayImport.update({
  path: '/pay',
  getParentRoute: () => LayoutCreditLazyRoute,
} as any)

const LayoutCreditNewRoute = LayoutCreditNewImport.update({
  path: '/new',
  getParentRoute: () => LayoutCreditLazyRoute,
} as any)

const LayoutClientNewRoute = LayoutClientNewImport.update({
  path: '/new',
  getParentRoute: () => LayoutClientLazyRoute,
} as any)

const LayoutClientDeleteRoute = LayoutClientDeleteImport.update({
  path: '/delete',
  getParentRoute: () => LayoutClientLazyRoute,
} as any)

const LayoutCreditCreditIdUpdateLazyRoute =
  LayoutCreditCreditIdUpdateLazyImport.update({
    path: '/credit/$creditId/update',
    getParentRoute: () => LayoutRoute,
  } as any).lazy(() =>
    import('./pages/_layout/credit_/$creditId_/update.lazy').then(
      (d) => d.Route,
    ),
  )

const LayoutUserUserIdUpdateRoute = LayoutUserUserIdUpdateImport.update({
  path: '/$userId/update',
  getParentRoute: () => LayoutUserLazyRoute,
} as any)

const LayoutUserUserIdDeleteRoute = LayoutUserUserIdDeleteImport.update({
  path: '/$userId/delete',
  getParentRoute: () => LayoutUserLazyRoute,
} as any)

const LayoutCreditCreditIdPrintRoute = LayoutCreditCreditIdPrintImport.update({
  path: '/print',
  getParentRoute: () => LayoutCreditCreditIdLazyRoute,
} as any)

const LayoutCreditCreditIdPayRoute = LayoutCreditCreditIdPayImport.update({
  path: '/pay',
  getParentRoute: () => LayoutCreditCreditIdLazyRoute,
} as any)

const LayoutCreditCreditIdDeleteRoute = LayoutCreditCreditIdDeleteImport.update(
  {
    path: '/delete',
    getParentRoute: () => LayoutCreditCreditIdLazyRoute,
  } as any,
)

const LayoutClientClientIdUpdateRoute = LayoutClientClientIdUpdateImport.update(
  {
    path: '/$clientId/update',
    getParentRoute: () => LayoutClientLazyRoute,
  } as any,
)

const LayoutClientClientIdDeleteRoute = LayoutClientClientIdDeleteImport.update(
  {
    path: '/$clientId/delete',
    getParentRoute: () => LayoutClientLazyRoute,
  } as any,
)

const LayoutCreditCreditIdUpdateConfirmRoute =
  LayoutCreditCreditIdUpdateConfirmImport.update({
    path: '/confirm',
    getParentRoute: () => LayoutCreditCreditIdUpdateLazyRoute,
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
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/_layout/client': {
      preLoaderRoute: typeof LayoutClientLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/credit': {
      preLoaderRoute: typeof LayoutCreditLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/notification': {
      preLoaderRoute: typeof LayoutNotificationLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/report': {
      preLoaderRoute: typeof LayoutReportLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user': {
      preLoaderRoute: typeof LayoutUserLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      preLoaderRoute: typeof LayoutIndexLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/client/delete': {
      preLoaderRoute: typeof LayoutClientDeleteImport
      parentRoute: typeof LayoutClientLazyImport
    }
    '/_layout/client/new': {
      preLoaderRoute: typeof LayoutClientNewImport
      parentRoute: typeof LayoutClientLazyImport
    }
    '/_layout/credit/new': {
      preLoaderRoute: typeof LayoutCreditNewImport
      parentRoute: typeof LayoutCreditLazyImport
    }
    '/_layout/credit/pay': {
      preLoaderRoute: typeof LayoutCreditPayImport
      parentRoute: typeof LayoutCreditLazyImport
    }
    '/_layout/credit/print': {
      preLoaderRoute: typeof LayoutCreditPrintImport
      parentRoute: typeof LayoutCreditLazyImport
    }
    '/_layout/user/delete': {
      preLoaderRoute: typeof LayoutUserDeleteImport
      parentRoute: typeof LayoutUserLazyImport
    }
    '/_layout/user/new': {
      preLoaderRoute: typeof LayoutUserNewImport
      parentRoute: typeof LayoutUserLazyImport
    }
    '/_layout/credit/$creditId': {
      preLoaderRoute: typeof LayoutCreditCreditIdLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/client/$clientId/delete': {
      preLoaderRoute: typeof LayoutClientClientIdDeleteImport
      parentRoute: typeof LayoutClientLazyImport
    }
    '/_layout/client/$clientId/update': {
      preLoaderRoute: typeof LayoutClientClientIdUpdateImport
      parentRoute: typeof LayoutClientLazyImport
    }
    '/_layout/credit/$creditId/delete': {
      preLoaderRoute: typeof LayoutCreditCreditIdDeleteImport
      parentRoute: typeof LayoutCreditCreditIdLazyImport
    }
    '/_layout/credit/$creditId/pay': {
      preLoaderRoute: typeof LayoutCreditCreditIdPayImport
      parentRoute: typeof LayoutCreditCreditIdLazyImport
    }
    '/_layout/credit/$creditId/print': {
      preLoaderRoute: typeof LayoutCreditCreditIdPrintImport
      parentRoute: typeof LayoutCreditCreditIdLazyImport
    }
    '/_layout/user/$userId/delete': {
      preLoaderRoute: typeof LayoutUserUserIdDeleteImport
      parentRoute: typeof LayoutUserLazyImport
    }
    '/_layout/user/$userId/update': {
      preLoaderRoute: typeof LayoutUserUserIdUpdateImport
      parentRoute: typeof LayoutUserLazyImport
    }
    '/_layout/credit/$creditId/update': {
      preLoaderRoute: typeof LayoutCreditCreditIdUpdateLazyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/credit/$creditId/update/confirm': {
      preLoaderRoute: typeof LayoutCreditCreditIdUpdateConfirmImport
      parentRoute: typeof LayoutCreditCreditIdUpdateLazyImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  R404Route,
  LayoutRoute.addChildren([
    LayoutClientLazyRoute.addChildren([
      LayoutClientDeleteRoute,
      LayoutClientNewRoute,
      LayoutClientClientIdDeleteRoute,
      LayoutClientClientIdUpdateRoute,
    ]),
    LayoutCreditLazyRoute.addChildren([
      LayoutCreditNewRoute,
      LayoutCreditPayRoute,
      LayoutCreditPrintRoute,
    ]),
    LayoutNotificationLazyRoute,
    LayoutReportLazyRoute,
    LayoutUserLazyRoute.addChildren([
      LayoutUserDeleteRoute,
      LayoutUserNewRoute,
      LayoutUserUserIdDeleteRoute,
      LayoutUserUserIdUpdateRoute,
    ]),
    LayoutIndexLazyRoute,
    LayoutCreditCreditIdLazyRoute.addChildren([
      LayoutCreditCreditIdDeleteRoute,
      LayoutCreditCreditIdPayRoute,
      LayoutCreditCreditIdPrintRoute,
    ]),
    LayoutCreditCreditIdUpdateLazyRoute.addChildren([
      LayoutCreditCreditIdUpdateConfirmRoute,
    ]),
  ]),
  LoginLazyRoute,
])

/* prettier-ignore-end */
