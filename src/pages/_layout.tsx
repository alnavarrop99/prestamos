import {
    Await,
  createFileRoute,
  defer,
  Outlet,
  redirect,
  useChildMatches,
  useRouter,
} from '@tanstack/react-router'
import styles from '@/styles/global.module.css'
import clsx from 'clsx'
import {
  ArrowLeftCircle,
  Calendar as CalendarIcon,
  icons,
  LogOut,
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
import React, { Suspense, useEffect, useReducer, useState } from 'react'
import { User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useStatus } from '@/lib/context/layout'
import { getClientsList, type TCLIENT_GET_ALL } from '@/api/clients'
import { Theme, useTheme } from '@/components/theme-provider'
import { Switch } from '@/components/ui/switch'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { getCurrentUser, type TUSER_GET } from '@/api/users'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getRoute, getSearch, TSearch } from '@/lib/route'
import { useToken } from '@/lib/context/login'
import { useIsFetching, useIsMutating, useQuery } from '@tanstack/react-query'
import { SpinLoader } from '@/components/ui/loader'
import brand from "@/assets/menu-brand.avif"
import brandOff from "@/assets/menu-off-brand.avif"
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_layout')({
  component: Layout,
  loader: async () => ({ user: defer(getCurrentUser()) }),
  beforeLoad: async (  ) => {
    const { token } = useToken.getState()
    if( !token ){
      throw redirect({
        to: "/login",
      })
    }
  }
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
  clients?: TCLIENT_GET_ALL
  user?: TUSER_GET
  theme?: Theme
  open?: boolean
}

const reducer: React.Reducer<TStatus, TStatus> = (prev, state) => {
  return { ...prev, ...state }
}

/* eslint-disable-next-line */
export function Layout({ children }: React.PropsWithChildren<TNavigationProps>) {
  const { data: clientsDB, isSuccess } = useQuery({
    queryKey: [getClientsList.name],
    queryFn: getClientsList,
  })
  const [{ offline, open, calendar }, setStatus] = useReducer(reducer, { offline: navigator.onLine, open: false })
  const { setValue, setSearch, search, value } = useStatus()
  const  { user } = Route.useLoaderData()
  const [clients, setClients] = useState(clientsDB)
  const { theme, setTheme } = useTheme()
  const rchild = useChildMatches()
  const { deleteToken, setUserId, userId, name } = useToken()
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const { history } = useRouter()

  useEffect( () => {
    if( !userId ) {
       return () => { setUserId( undefined ) }
    }
    user?.then( ( { id } ) => setUserId( id ) )
  }, [ user ] )

  useEffect(() => {
    setClients(clientsDB) 
  }, [isSuccess])


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
  > = (ev) => {
    const { value } = ev.currentTarget
    setValue({ value })

    const query = clientsDB?.filter(({ ...props }) =>
      Object.values(props).join(' ').toLowerCase().includes(value.toLowerCase())
    )

    setClients(query)
  }

  const onKeyDown: React.KeyboardEventHandler<
    React.ComponentRef<typeof Input>
  > = (ev) => {
    const { key } = ev

    if (!clients || !clients?.length) return;
    const { pathname } = rchild?.[0]

    if (key === 'Enter' && pathname !== "/user" as TSearch && pathname !== "/client" as TSearch) {
      setSearch({ search: !search })
    }
  }

  const onSelect: ( { clientId }: {clientId: number} ) =>  React.MouseEventHandler< HTMLLIElement > = ({ clientId }) => () => {
    const client = clients?.find( ({ id }) => id === clientId )
    if(!client) return;

    const { nombres, apellidos } = client
    setValue({value: nombres + " " + apellidos})
    setSearch({ search: !search })
    setClients([client])
  }

  const onSearchChange = () => {
    if (!clients || !clients?.length) return;
    setSearch({ search: !search })
  }

  const onSwitch = (checked: boolean) => {
    if (checked) {
      setTheme('dark')
      return
    }
    setTheme('light')
  }

  const onBack: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }

  const onLogut: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    deleteToken() 
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
        <Link to={"/"}>
          <img alt='brand' src={ !open ? brand : brandOff} className='aspect-contain min-h-24' />
        </Link>
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
                          className={clsx('delay-50 font-bold duration-300', {
                            'p-2': open,
                          })}
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
            <Calendar key={'calendar'} className="rounded-xl bg-secondary-foreground text-muted-foreground ring-1 ring-secondary [&_*]:font-bold" />
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
              <PopoverContent className="w-76 rounded-xl">
                <Calendar key={'calendar'} className='rounded-xl bg-secondary-foreground text-muted-foreground ring-1 ring-secondary [&_*]:font-bold' />
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
            { (!!isFetching || !!isMutating) && <SpinLoader />}
          </div>
          <div>
            <Label className="flex cursor-pointer items-center gap-2">
              {theme === 'dark' ? <Moon /> : <Sun />}
              <Switch checked={theme === 'dark'} onCheckedChange={onSwitch} />
            </Label>
            <Label className="flex items-center justify-center rounded-lg border border-border">
              { !!clients?.length && <Popover
                open={search}
                onOpenChange={onSearchChange}
              >
                <PopoverTrigger>
                  <Button
                    className={clsx('rounded-br-none rounded-tr-none p-2')}
                    variant={ !search ? 'ghost' : 'default' }
                  >
                    <User />
                    <Badge
                      className={clsx(
                        {
                          '!hidden': search,
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
                      <Badge variant="default"> {clients?.length} </Badge>
                    </h3>
                    <Separator />
                    <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto [&_a]:flex [&_a]:flex-row [&_a]:items-center [&_a]:gap-4">
                      {clients?.map(
                        ({
                          apellidos,
                          nombres,
                          id: clientId,
                          numero_de_identificacion,
                        }) => clientId &&
                          <li key={clientId} className="group cursor-pointer" onClick={onSelect({ clientId })}>
                            <Link to={'/client'}>
                              <Avatar>
                                <AvatarFallback>
                                  {nombres?.at(0) ??
                                    'N' + apellidos?.at(0) ??
                                    'A'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p
                                  className={clsx("font-bold group-hover:after:content-['#']")}
                                >
                                  {nombres + ' ' + apellidos}
                                </p>
                                <p className="italic">
                                  {numero_de_identificacion.slice(0, 4) +
                                    '...' +
                                    numero_de_identificacion.slice(-4, numero_de_identificacion.length)}
                                </p>
                              </div>
                            </Link>
                          </li>
                      )}
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>}
              <Input
                className="rounded-bl-none rounded-tl-none border-none"
                type="search"
                placeholder={text.search.placeholder({ pathname: rchild?.at(0)?.pathname })}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={value}
              />
            </Label>
               
                   <HoverCard>
                    <HoverCardTrigger>
                      <Badge className="cursor-pointer text-sm" variant="outline">
                        {(name ?? "User")
                          .split(' ')
                          .map((char) => char.at(0))
                          .join('')}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <Suspense fallback={
                        <div className='p-2'>
                          <Skeleton className='ring-1 ring-ring w-10 h-10 rounded-full'/>
                          <ul className="space-y-2 [&>li]:w-fit">
                            <li> <Skeleton className="w-32 h-5" /> </li>
                            <li> <Skeleton className="w-16 h-4" /> </li>
                          </ul>
                        </div>
                      }>
                        <Await promise={user}>
                          {(user) => (
                        <div className='p-2'>
                          <Avatar className='ring-1 ring-ring'>
                            <AvatarFallback>{name?.split(" ")?.map( (items) => (items?.[0]) )}</AvatarFallback>
                          </Avatar>
                          <ul className="space-y-2 [&>li]:w-fit">
                            <li> <span className="font-bold">{user.nombre}</span> </li>
                            <li> <Badge> {user?.rol} </Badge> </li>
                          </ul>
                        </div>
                          )}
                        </Await>
                      </Suspense>
                  </HoverCardContent>
                  </HoverCard>
            <Link to={"/"}>
              <Button
                variant={"ghost"} 
                className='p-2 [&>svg]:p-1 [&>svg]:transition [&>svg]:delay-150 [&>svg]:duration-300 group'
                onClick={onLogut}
              >
                <LogOut className='group-hover:stroke-destructive' />
              </Button>
            </Link>
              {!offline && (
                <Network
                  className={clsx('ms-auto animate-bounce', {
                    'stroke-success': offline,
                    'stroke-destructive': !offline,
                  })}
                />
              )}
            </div>
          </div>
      </header>
      <main className="space-y-2 [&>:first-child]:flex [&>:first-child]:items-center [&>:first-child]:gap-2">
        <div>
          <Button
            onClick={onBack}
            variant="ghost"
            className="p-2 text-sm [&>svg]:h-5 [&>svg]:w-5"
          >
            <ArrowLeftCircle />
          </Button>
          <Breadcrumb>
            <BreadcrumbList>
              {getRoute({ pathname: rchild?.[0]?.pathname })?.map(
                ({ name, route }, i, list) => {
                  if (!route) {
                    return (
                      <React.Fragment key={i}>
                        <BreadcrumbItem>
                          <span className="font-bold"> {name} </span>
                        </BreadcrumbItem>
                        {i !== list?.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    )
                  }
                  return (
                    <React.Fragment key={i}>
                      <BreadcrumbItem>
                        <Link to={route}>
                          <span className={'font-bold hover:underline'}>
                            
                            {name}
                          </span>
                        </Link>
                      </BreadcrumbItem>
                      {i !== list?.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  )
                }
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-8">{children ?? <Outlet />}</div>
      </main>
      <footer className="py-4">
        <Separator className="my-4" />
          <h3 className='ms-auto w-fit space-x-2'>
            <span className="italic">{text.footer.copyright}</span>
            <Badge> &copy; {new Date().getFullYear()} </Badge>
          </h3>
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
    placeholder: ({ pathname }: { pathname?: string }) =>
      'Buscar ' + getSearch({ pathname }),
    title: 'Clientes:',
    current: 'actual',
  },
  footer: {
    copyright: 'Todos los derechos reservados',
    description: 'Compañia de creditos comerciales independiente',
  },
}
