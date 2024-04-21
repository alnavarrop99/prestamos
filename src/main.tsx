import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

async function enableMocking() {
  // if (!+import.meta.env.VITE_MSW || !import.meta.env.DEV) {
  //   return
  // }
  const { worker } = await import('@/mocks/config')
  return worker.start()
}

const history = createBrowserHistory()
export const route = createRouter({
  routeTree,
  history,
})

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={route} />
    </React.StrictMode>
  )
})
