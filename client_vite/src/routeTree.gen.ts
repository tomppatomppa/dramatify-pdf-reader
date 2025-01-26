/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AboutImport } from './routes/about'
import { Route as AuthImport } from './routes/_auth'
import { Route as IndexImport } from './routes/index'
import { Route as AuthDashboardImport } from './routes/_auth.dashboard'
import { Route as AuthUserSettingsImport } from './routes/_auth.user.settings'
import { Route as AuthScriptsIdImport } from './routes/_auth.scripts.$id'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthDashboardRoute = AuthDashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => AuthRoute,
} as any)

const AuthUserSettingsRoute = AuthUserSettingsImport.update({
  path: '/user/settings',
  getParentRoute: () => AuthRoute,
} as any)

const AuthScriptsIdRoute = AuthScriptsIdImport.update({
  path: '/scripts/$id',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_auth': {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/dashboard': {
      preLoaderRoute: typeof AuthDashboardImport
      parentRoute: typeof AuthImport
    }
    '/_auth/scripts/$id': {
      preLoaderRoute: typeof AuthScriptsIdImport
      parentRoute: typeof AuthImport
    }
    '/_auth/user/settings': {
      preLoaderRoute: typeof AuthUserSettingsImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AuthRoute.addChildren([
    AuthDashboardRoute,
    AuthScriptsIdRoute,
    AuthUserSettingsRoute,
  ]),
  AboutRoute,
  LoginRoute,
])

/* prettier-ignore-end */
