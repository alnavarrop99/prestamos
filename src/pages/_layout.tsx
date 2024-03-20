import {
  createFileRoute,
  Outlet,
  useChildMatches,
} from '@tanstack/react-router'
import styles from '@/styles/global.module.css'
import clsx from 'clsx'
import {
  BadgeCent,
  BadgeDollarSign,
  Calendar as CalendarIcon,
  icons,
  MenuSquare,
  Moon,
  Network,
  NotepadText,
  Sun,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { useEffect, useReducer, useState } from 'react'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRootStatus } from '@/lib/context/layout'
import { getClientsRes, type TClient } from '@/api/clients'
import { Theme, useTheme } from '@/components/theme-provider'
import { Switch } from '@/components/ui/switch'

export const Route = createFileRoute('/_layout')({
  component: Layout,
  loader: getClientsRes,
})

/* eslint-disable-next-line */
interface TStatus {
  offline?: boolean
  open?: boolean
  calendar?: boolean
  search?: boolean
}

/* eslint-disable-next-line */
interface TNavigationProps {
  clients?: TClient[]
  theme: Theme
}

const reducer: React.Reducer<TStatus, TStatus> = (prev, state) => {
  return { ...prev, ...state }
}

const username = 'Admin99'

/* eslint-disable-next-line */
export function Layout({
  children,
  theme: _theme,
  clients: _clients = [] as TClient[],
}: React.PropsWithChildren<TNavigationProps>) {
  const [{ offline, open = false, calendar }, setStatus] = useReducer(reducer, {
    offline: navigator.onLine,
  })
  const { setValue, setSearch, search } = useRootStatus((status) => ({
    setValue: status.setValue,
    setSearch: status.setSearch,
    search: status.search,
  }))
  const clientsDB = Route.useLoaderData() ?? _clients
  const [clients, setClients] = useState(clientsDB)
  const { theme, setTheme } = useTheme()

  const route = useChildMatches()

  useEffect(() => {
    const onNotwork = () => {
      setStatus({ offline: !offline })
    }
    addEventListener('online', onNotwork)
    addEventListener('offline', onNotwork)
    return () => {
      removeEventListener('online', onNotwork)
      removeEventListener('offline', onNotwork)
    }
  }, [])

  const onclick =
    (setStatus: (status: TStatus) => void, { ...props }: TStatus) =>
    (): void => {
      setStatus(props)
    }

  const onChange: React.ChangeEventHandler<
    React.ComponentRef<typeof Input>
  > = async (ev) => {
    const { value } = ev.currentTarget
    setValue({ value })

    if (!clients || !clients?.length) return

    const query = clientsDB?.filter(({ ...props }) =>
      Object.values(props).join(' ').toLowerCase().includes(value.toLowerCase())
    )
    setClients(query)
  }

  const onKeyDown: React.KeyboardEventHandler<
    React.ComponentRef<typeof Input>
  > = (ev) => {
    const { key } = ev

    if (!clients || !clients?.length) return

    if (key === 'Enter') {
      setSearch({ search: !search })
    }
  }

  const onSearchChange = () => {
    if (!clients || !clients?.length) return
    setSearch({ search: !search })
  }

  const onSwitch = (checked: boolean) => {
    if (_theme) return

    if (checked) {
      setTheme('dark')
      return
    }
    setTheme('light')
  }

  return (
    <div
      className={clsx(
        'container m-auto grid max-w-screen-2xl auto-rows-min grid-cols-2 grid-rows-3 space-y-4 [&>*]:px-2',
        styles?.['grid-layout']
      )}
    >
      <nav
        className={clsx(
          'row-span-full h-[100dvh] rounded-lg bg-primary-foreground p-4 text-primary shadow-lg hover:shadow-xl',
          {
            [styles?.['menu-animation']]: !open,
            [styles?.['menu-animation-reverse']]: open,
          }
        )}
      >
        <div className="grid place-items-center">
          <h2 className="flex items-center gap-2 text-xl">
            <BadgeDollarSign
              className={clsx({ 'hover:animate-pulse': open })}
            />
            <span className={clsx('font-bold uppercase', { hidden: open })}>
              {text.title}{' '}
            </span>
            <BadgeCent className={clsx({ hidden: open })} />
          </h2>
        </div>
        <Separator className="my-4" />
        <div className="p-4 px-6 text-xl">
          <ul className="space-y-3 [&_button]:w-full">
            {Object.entries(text.navegation).map(
              ([name, { url, title, Icon }]) => {
                return (
                  <li key={name}>
                    <Link to={url}>
                      {({ isActive }) => (
                        <Button
                          variant={!isActive ? 'link' : 'default'}
                          className={clsx({ 'p-2': open })}
                        >
                          {!open ? title : <Icon />}
                        </Button>
                      )}
                    </Link>
                  </li>
                )
              }
            )}
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid place-items-center">
          {!open ? (
            <Calendar key={'calendar'} className="rounded-xl bg-secondary" />
          ) : (
            <Popover onOpenChange={onclick(setStatus, { calendar: !calendar })}>
              <PopoverTrigger>
                <Button
                  className={clsx({ 'p-2': open })}
                  variant={!calendar ? 'outline' : 'default'}
                >
                  <CalendarIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-76 rounded-xl bg-secondary">
                <Calendar key={'calendar'} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </nav>
      <header className="sticky top-0 z-20 !my-0 [&_div]:flex [&_div]:items-center [&_div]:gap-4">
        <div className="h-16 justify-between rounded-lg bg-primary-foreground px-2 shadow-lg">
          <div className="[&>button]:px-2">
            <Button
              variant={!open ? 'default' : 'outline'}
              onClick={onclick(setStatus, { open: !open })}
            >
              <MenuSquare />
            </Button>
            <Link to={'./notification'}>
              {({ isActive }) => (
                <Button
                  className="px-2"
                  variant={isActive ? 'default' : 'outline'}
                >
                  <NotepadText />
                </Button>
              )}
            </Link>
          </div>
          <div>
            <Label className="flex cursor-pointer items-center gap-2">
              {theme === 'dark' ? <Moon /> : <Sun />}
              <Switch checked={theme === 'dark'} onCheckedChange={onSwitch} />
            </Label>
            <Label className="flex items-center justify-center rounded-lg border border-border">
              <Popover
                open={search && !!route?.at(0)?.pathname?.match(/^\/+$/g)}
                onOpenChange={onSearchChange}
              >
                <PopoverTrigger>
                  <Button
                    className={clsx('rounded-br-none rounded-tr-none p-2')}
                    variant={
                      !search && route?.at(0)?.pathname?.match(/^\/+$/g)
                        ? 'ghost'
                        : 'default'
                    }
                  >
                    <User />
                    <Badge
                      className={clsx(
                        {
                          '!hidden':
                            search || !route?.at(0)?.pathname?.match(/^\/+$/g),
                        },
                        styles?.['search-badge-animation']
                      )}
                      variant={!search ? 'default' : 'secondary'}
                    >
                      {clients?.length}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="absolute -start-16 top-2 w-80">
                  <div className="space-y-4 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2">
                    <h3 className="text-xl [&>span]:underline">
                      <span>{text.search.title}</span>
                      <Badge variant="default"> {clients?.length} </Badge>{' '}
                    </h3>
                    <Separator />
                    <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto [&_a]:flex [&_a]:flex-row [&_a]:items-center [&_a]:gap-4">
                      {clients?.map(
                        ({
                          apellidos: lastName,
                          nombres: firstName,
                          id,
                          numero_de_identificacion: SSN,
                        }) => (
                          <li key={id} className="group cursor-pointer">
                            <Link to={'/user/$userId'} params={{ userId: id }}>
                              {({ isActive }) => (
                                <>
                                  <Avatar>
                                    <AvatarFallback>
                                      {firstName.at(0) ??
                                        'N' + lastName.at(0) ??
                                        'A'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p
                                      className={clsx('font-bold', {
                                        "group-hover:after:content-['#']":
                                          !isActive,
                                      })}
                                    >
                                      {firstName + ' ' + lastName}
                                    </p>
                                    <p className="italic">
                                      {SSN.slice(0, 4) +
                                        '...' +
                                        SSN.slice(-4, SSN.length)}
                                    </p>
                                  </div>
                                  {isActive && (
                                    <Badge> {text.search.current} </Badge>
                                  )}
                                </>
                              )}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                className="rounded-bl-none rounded-tl-none border-none"
                type="search"
                placeholder={text.search.placeholder({
                  pathname: route?.at(0)?.pathname as
                    | '/client'
                    | '/credit'
                    | '/user'
                    | '/',
                })}
                {...{
                  onChange,
                  onKeyDown,
                }}
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
              {!offline && (
                <Network
                  className={clsx('ms-auto animate-bounce', {
                    'stroke-green-500': offline,
                    'stroke-red-500': !offline,
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="!px-10 py-8">{children ?? <Outlet />}</main>
      <footer className="py-4">
        <Separator className="my-4" />
        <div className="flex justify-between">
          <h3>
            <span>{text.footer.description}</span>{' '}
          </h3>
          <h3>
            <span className="italic">{text.footer.copyright}</span>{' '}
            <Badge> &copy; {new Date().getFullYear()} </Badge>
          </h3>
        </div>
      </footer>
    </div>
  )
}

Layout.dispalyname = 'Layout'

const text = {
  title: 'Matcor',
  navegation: {
    credit: { title: 'Prestamos', url: '/credit', Icon: icons?.CreditCard },
    client: { title: 'Clientes', url: '/client', Icon: icons?.Award },
    user: { title: 'Usuarios', url: '/user', Icon: icons?.BookUser },
    report: { title: 'Reportes', url: '/report', Icon: icons?.BookA },
  },
  avatar: {
    src: 'https://placehold.co/50x50?text=Hello+World',
    name: 'Admin99',
    description: ({ username }: { username: string }) => username,
  },
  search: {
    placeholder: ({
      pathname,
    }: {
      pathname?: '/client' | '/user' | '/credit' | '/'
    }) =>
      'Buscar ' +
      (pathname
        ? {
            '/client': 'clientes',
            '/user': 'usuarios',
            '/credit': 'prestamos',
            '/': 'clientes activos',
          }[pathname]
        : '') +
      ' ...',
    title: 'Clientes:',
    current: 'actual',
  },
  footer: {
    copyright: 'Todos los derechos reservados',
    description: 'Compañia de creditos comerciales independiente',
  },
}
