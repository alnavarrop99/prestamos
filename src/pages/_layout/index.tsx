import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Home,
})

/* eslint-disable-next-line */
interface THomeProps {}

/* eslint-disable-next-line */
export function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">{text.title}</h1>
    </div>
  )
}

Home.dispalyname = 'Home'

const text = {
  title: 'Dashboard:',
}
