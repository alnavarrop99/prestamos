import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/credit')({
  component: Credit,
})

interface TCredit {

}

export function Credit({ children }: React.PropsWithChildren<TCredit>) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{text.title}</h1>
    </div>
  )
}

Credit.dispalyname = 'Credit'

const text = {
  title: 'Prestamos:',
}
