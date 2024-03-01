import { createFileRoute, Outlet } from '@tanstack/react-router'
import styles from '@/styles/global.module.css'
import clsx from 'clsx'
import {
  BadgeCent,
  BadgeDollarSign,
  MenuSquare,
  Network,
  NotepadText,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { useEffect, useReducer } from 'react'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/_layout')({
  component: Navigation,
})

type TStatus = { readonly offline?: boolean }
const reducer: React.Reducer<TStatus, TStatus> = (prev, state) => {
  return { ...prev, ...state }
}

const username = 'Admin99'
export function Navigation({ children }: React.PropsWithChildren) {
  const [{ offline }, setStatus] = useReducer(reducer, {
    offline: navigator.onLine,
  })
  const onNotwork = () => {
    setStatus({ offline: !offline })
  }

  useEffect(() => {
    addEventListener('online', onNotwork)
    addEventListener('offline', onNotwork)
    return () => {
      removeEventListener('online', onNotwork)
      removeEventListener('offline', onNotwork)
    }
  })

  return (
    <div
      className={clsx(
        'container m-auto grid auto-rows-min grid-cols-2 grid-rows-3 space-y-4 [&>*]:px-2',
        styles?.['grid-layout']
      )}
    >
      <nav className="row-span-full h-[100dvh] rounded-lg bg-primary-foreground p-4 text-primary shadow-lg hover:shadow-xl">
        <div className="grid place-items-center">
          <h2 className="flex items-center gap-2 text-xl">
            {' '}
            <BadgeDollarSign /> {text.title} <BadgeCent />{' '}
          </h2>
        </div>
        <Separator className="my-4" />
        <div className="p-4 px-6 text-xl">
          <ul className="space-y-3 [&_button]:w-full">
            {Object.entries(text.navegation).map(([name, nav]) => (
              <li key={name}>
                <Link to={nav.url}>
                  {({ isActive }) => (
                    <Button variant={!isActive ? 'link' : 'default'}>
                      {nav.title}
                    </Button>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid place-items-center">
          <Calendar className="rounded-xl bg-secondary" />
        </div>
      </nav>
      <header className="!my-0 [&_div]:flex [&_div]:items-center [&_div]:gap-4">
        <div className="h-16 justify-between rounded-lg bg-primary-foreground px-2 shadow-lg ">
          <div className="[&>button]:px-2">
            <Button variant="outline">
              {' '}
              <MenuSquare />{' '}
            </Button>
            <Button variant="outline">
              {' '}
              <NotepadText />{' '}
            </Button>
          </div>
          <div>
            <Label className="flex items-center justify-center gap-2 rounded-lg border border-border bg-primary pl-2">
              <User className="stroke-secondary" />{' '}
              <Input
                className="rounded-bl-none rounded-tl-none border-none"
                type="search"
                placeholder={text.search.placeholder}
              />
            </Label>
            <div>
              <Avatar className="border border-primary">
                <AvatarImage src={text.avatar.src} alt="user-img" />
                <AvatarFallback>{text.avatar.name}</AvatarFallback>
              </Avatar>
              <Badge className="text-sm" variant="outline">
                {text.avatar.description({ username })}
              </Badge>
            </div>
          </div>
        </div>
      </header>
      <main>
        {' '}
        <div className="h-full border border-primary">
          {children ?? <Outlet />}
        </div>{' '}
      </main>
      <footer className="py-4">
        <Separator className="my-4" />
        <div className="flex items-center">
          <h3>
            <span className="italic">{text.copyright}</span>{' '}
            <Badge> &copy; {new Date().getFullYear()} </Badge>{' '}
          </h3>
          <Network
            className={clsx('ms-auto', {
              'stroke-green-500': offline,
              'stroke-red-500': !offline,
            })}
          />
        </div>
      </footer>
    </div>
  )
}

Navigation.dispalyname = 'Navigation'

const text = {
  title: 'Pretamos App',
  navegation: {
    home: { title: 'Dashboard', url: '/' },
    client: { title: 'Clientes', url: '/client' },
    credit: { title: 'Creditos', url: '/credit' },
    user: { title: 'Usuarios', url: '/user' },
  },
  avatar: {
    src: 'https://placehold.co/50x50?text=Hello+World',
    name: 'Admin99',
    description: ({ username }: { username: string }) => username,
  },
  search: {
    placeholder: 'Buscar cliente ....',
  },
  copyright: 'Todos los derechos reservados',
}
