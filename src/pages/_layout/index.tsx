import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Home,
})

export function Home() {
  return <div>Hello Home</div>
}

Home.dispalyname = 'Home'
