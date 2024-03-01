import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/credit')({
  component: Credit,
})

export function Credit() {
  return <div>Hello Credit</div>
}

Credit.dispalyname = 'Credit'
