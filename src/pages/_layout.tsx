import {
    Await,
  CatchBoundary,
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
  X as Error,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import React, { memo, Suspense, useEffect, useReducer, useState } from 'react'
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
import { getCurrentUser, getUserById, type TUSER_GET } from '@/api/users'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getRoute, getSearch, TSearch } from '@/lib/route'
import { useToken } from '@/lib/context/login'
import { useIsFetching, useIsMutating, useMutationState } from '@tanstack/react-query'
import { SpinLoader } from '@/components/ui/loader'
import brand from "@/assets/menu-brand.avif"
import brandOff from "@/assets/menu-off-brand.avif"
import { Skeleton } from '@/components/ui/skeleton'
import { getUsersListOpt, Users } from './_layout/user'
import { getUserByIdOpt, updateUserByIdOpt } from './_layout/user/$userId/update'
import { postUserOpt } from './_layout/user/new'

export const Route = createFileRoute('/_layout')({
  component,
  pendingComponent,
  loader: async () => ({ 
    user: defer(getCurrentUser()), 
    clients: defer(getClientsList()) 
  }),
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
  menu?: boolean
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
export function component({}: React.PropsWithChildren<TNavigationProps>) {
  const [{ offline, menu, calendar }, setStatus] = useReducer(reducer, { offline: navigator.onLine, menu: false })
  const { open, setOpen } = useStatus()
  const { setValue, setSearch, search, value } = useStatus()
  const  { user, clients: clientsDB } = Route.useLoaderData()
  const [clients, setClients] = useState<TCLIENT_GET_ALL | undefined>(undefined)
  const { theme, setTheme } = useTheme()
  const rchild = useChildMatches()
  const { deleteToken, setUserId, userId, name } = useToken()
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const { history } = useRouter()

  useEffect( () => {
    if( !!userId ) {
       return () => { setUserId( undefined ) }
    }
    user?.then( ( { id } ) => setUserId( id ) )
  }, [ user ] )

  useEffect(() => {
    clientsDB?.then( ( clients => setClients(clients) ) )
    return () => setClients([])
  }, [ clientsDB ])

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

    clientsDB?.then( ( clients ) =>{ 
      const query = clients?.filter((props) => Object.values(props).join(' ').toLowerCase().includes(value.toLowerCase()))
      setClients(query)
    }) 

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

  const onSelect: ( index: number ) =>  React.MouseEventHandler< HTMLLIElement > = ( index ) => () => {
    const client = clients?.[index]
    if(!client) return;

    // setValue({value: client?.nombres + " " + client?.apellidos})
    setOpen({ open: !open })
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
            [styles?.['menu-animation']]: !menu,
            [styles?.['menu-animation-reverse']]: menu,
          }
        )}
      >
        <Link to={"/"}>
          <img alt='brand' src={ !menu ? brand : brandOff} className='aspect-contain min-h-24' />
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
                            'p-2': menu,
                          })}
                        >
                          {!menu ? title : <Icon />}
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
          {!menu ? (
            <Calendar key={'calendar'} className="rounded-xl bg-secondary-foreground text-muted-foreground ring-1 ring-secondary [&_*]:font-bold" />
          ) : (
            <Popover onOpenChange={onclick(setStatus, { calendar: !calendar })}>
              <PopoverTrigger>
                <Button
                  className={clsx({ 'p-2': menu })}
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
              variant={!menu ? 'default' : 'outline'}
              onClick={onclick(setStatus, { menu: !menu })}
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
            <UsersSpinLoader />
          </div>
          <div>
            <Label className="flex cursor-pointer items-center gap-2">
              {theme === 'dark' ? <Moon /> : <Sun />}
              <Switch checked={theme === 'dark'} onCheckedChange={onSwitch} />
            </Label>
            <Label className="flex items-center justify-center rounded-lg border border-border">
                <Popover
                  open={search}
                  onOpenChange={onSearchChange}
                >
                  <PopoverTrigger>
                    <Button
                      className={clsx('rounded-br-none rounded-tr-none p-2')}
                      variant={ !search ? 'ghost' : 'default' }
                    >
                      <User />
                        <Suspense fallback={< SpinLoader />} >
                          <CatchBoundary getResetKey={() => "clients-loader"} errorComponent={errorComponent({ searchList: true })}>
                            <Await promise={clientsDB}>
                              { () => 
                                <Badge
                                  className={clsx( { '!hidden': search, }, styles?.['search-badge-animation'])}
                                  variant={!search ? 'default' : 'secondary'}
                                >
                                  {clients?.length}
                                </Badge>
                             }
                           </Await>
                        </CatchBoundary>
                      </Suspense>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="absolute -start-16 top-2 w-80" hidden={!clients?.length}>
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
                          }, index) => clientId &&
                            <li key={index} className="group cursor-pointer" onClick={onSelect(index)}>
                              <Link to={'/client/$clientId/update'} params={{clientId}}>
                                <Avatar>
                                  <AvatarFallback className='!ring-2 ring-ring'>
                                    {nombres?.[0] + apellidos?.[0]}
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
                </Popover>
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
                        <CatchBoundary getResetKey={() => "reset"} errorComponent={ errorComponent({ currentUser: true }) } >
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
                        </CatchBoundary>
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
        <div className="px-8 h-full flex flex-col justify-between py-4"><Outlet /></div>
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

const UsersSpinLoader = memo(function () {
   const get = useIsFetching({
    type: "inactive",
    fetchStatus: "fetching",
    queryKey: ([] as string[]).concat( getUsersListOpt.queryKey ),
  })

  const id = useIsFetching({
    type: "inactive",
    fetchStatus: "fetching",
    queryKey: ([] as string[]).concat( getUserByIdOpt({ userId: "" }).queryKey[0] ),
  })

  const post = useIsMutating({
    status: "pending",
    mutationKey: ([] as string[]).concat( postUserOpt.mutationKey ),
  })

  const update = useIsMutating({
    status: "pending",
    mutationKey: ([] as string[]).concat( updateUserByIdOpt?.mutationKey ),
  })

  const className = 'text-muted-foreground italic text-xs flex items-center gap-2'

  if( !!get || !!id ) {
    return <span className={className}><SpinLoader /> {text.loader.user.get}</span>
  }
  else if( !!post ) {
    return <span className={className}><SpinLoader /> {text.loader.user.new} </span>
  }
  else if( !!update ) {
    return <span className={className}><SpinLoader /> {text.loader.user.update} </span>
  }

})


function pendingComponent() {
  return <>Lodaing</>
}

export const errorComponent = ({ searchList }:{ currentUser?: boolean, searchList?: boolean }) =>{
  if( searchList ) {
    return  () => <Error className='p-1 stroke-destructive' />
  }
  return () => <div className='!flex-row'>
      <h2 className='font-bold text-destructive text-2xl'>:&nbsp;(</h2>
      <p className='italic text-sm'>  {text.error} </p> 
    </div>
} 

component.dispalyname = 'Layout'
pendingComponent.dispalyname = 'Layout'
errorComponent.dispalyname = 'Layout'

const text = {
  title: 'Matcor',
  error: 'Ups!!! ha ocurrido un error inesperado',
  loader: {
    user: {
      new: "Creando usuario",
      update: "Actualizando usuario",
      delete: "Eliminando usuario(s)",
      get: "Cargando usuario(s)"
    }
  },
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
    placeholder: ({ pathname }: { pathname?: string }) => 'Buscar ' + getSearch({ pathname }),
    title: 'Clientes:',
    current: 'actual', 
  },
  footer: {
    copyright: 'Todos los derechos reservados',
    description: 'Compañia de creditos comerciales independiente',
  },
}
