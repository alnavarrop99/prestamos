import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/client')({
  component: Client,
})

export function Client() {
  return <div>Hello Client</div>
}

Client.displayname = 'Client'
