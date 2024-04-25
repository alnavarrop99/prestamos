import { Navigate } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Home,
})

/* eslint-disable-next-line */
export function Home() {
  return <Navigate to="/credit" />
}

Home.dispalyname = 'Home'
