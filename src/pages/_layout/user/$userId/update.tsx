import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/user/$userId/update')({
  component: () => <div>Hello /_layout/user/$userId/update!</div>
})