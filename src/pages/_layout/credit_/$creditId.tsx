import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: () => <div>Hello /_layout/credit/$creditId!</div>
})