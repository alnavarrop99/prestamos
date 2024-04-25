import {
  createFileRoute,
  defer,
  ErrorComponentProps,
  Outlet,
  redirect,
  useChildMatches,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import styles from '@/styles/global.module.css'
import clsx from 'clsx'
import {
  ArrowLeftCircle,
  Calendar as CalendarIcon,
  LogOut,
  MenuSquare,
  Moon,
  Network,
  NotepadText,
  Sun,
  X as ErrorIcon,
  Search,
  Annoyed,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Calendar, TData, TDaysProps } from '@/components/ui/calendar'
import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'
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
import { type TCLIENT_GET_ALL } from '@/api/clients'
import { useTheme } from '@/components/theme-provider'
import { Switch } from '@/components/ui/switch'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { getCurrentUser } from '@/api/users'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getRoute, TSearch } from '@/lib/route'
import { useToken } from '@/lib/context/login'
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { BoundleLoader } from '@/components/ui/loader'
import brand from '@/assets/menu-brand.avif'
import brandOff from '@/assets/menu-off-brand.avif'
import { Skeleton } from '@/components/ui/skeleton'
import {
  usePagination as userPagination,
  useOrder as userOrder,
} from '@/pages/_layout/user.lazy'
import {
  getClientListOpt,
  useFilter as clientFilter,
} from '@/pages/_layout/client.lazy'
import {
  useOrder as creditOrder,
  usePagination as creditPagination,
  getCreditsListOpt,
} from '@/pages/_layout/credit.lazy'
import { queryClient } from '@/pages/__root'
import { getRolByName, type TROLES } from '@/lib/type/rol'
import { translate } from '@/lib/route'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { MyUserInfo } from '@/pages/-info'
import { format } from 'date-fns'
import { type TCREDIT_GET_FILTER_ALL } from '@/api/credit'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { listPayments } from '@/api/payment'
import SpinLoader from '@/pages/-spinloader'
import { main as text } from "@/locale/layout";

export const getCurrentUserOpt = {
  queryKey: ['login-user', { userId: useToken.getState().userId }],
  queryFn: getCurrentUser,
}

export const getPaymentListOpt = {
  queryKey: ['list-payment'],
  queryFn: listPayments,
}

export const Route = createFileRoute('/_layout')({
  component: Layout,
  pendingComponent: () => <></>,
  errorComponent: Error,
  loader: async () => ({
    user: defer(queryClient.ensureQueryData(queryOptions(getCurrentUserOpt))),
    clients: defer(queryClient.ensureQueryData(queryOptions(getClientListOpt))),
    credits: defer(
      queryClient.ensureQueryData(queryOptions(getCreditsListOpt))
    ),
    payment: defer(
      queryClient.ensureQueryData(queryOptions(getPaymentListOpt))
    ),
  }),
  onLeave: () => {
    useToken.setState({
      token: undefined,
      rol: undefined,
      name: undefined,
      userId: undefined,
    })
    userOrder.setState({ order: 'id' })
    creditOrder.setState({ order: 'id' })
    userPagination.setState({ start: 0, end: 3 })
    creditPagination.setState({ start: 0, end: 3 })
    clientFilter.setState({ filter: 'fullName' })
    queryClient.clear()
  },
  beforeLoad: async () => {
    const { token } = useToken.getState()
    if (!token) {
      throw redirect({
        to: '/login',
      })
    }
  },
})

/* eslint-disable-next-line */
interface TStatus {
  offline?: boolean
  navmenu?: boolean
  usermenu?: boolean
  calendar?: boolean
  search?: boolean
}

const reducer: React.Reducer<TStatus, TStatus> = (prev, state) => {
  return { ...prev, ...state }
}

/* eslint-disable-next-line */
export function Layout() {
  const { deleteToken, setUserId, userId, name, setRol, rol } = useToken()
  const [{ offline, navmenu, calendar, usermenu }, setStatus] = useReducer(
    reducer,
    {
      offline: navigator.onLine,
      navmenu: false,
    }
  )
  const { open, setOpen } = useStatus()
  const { setValue, setSearch, search, value } = useStatus()
  const {
    data: currentUserRes,
    isSuccess: okCurrentUser,
    isError: errorCurrentUser,
    refetch,
  } = useSuspenseQuery(queryOptions(getCurrentUserOpt))

  const {
    isError: errorPayments,
    isSuccess: okPayments,
    isPending: pendingPayments,
    data: payments,
  } = useQuery(queryOptions(getPaymentListOpt))

  const selectClients: (data: TCLIENT_GET_ALL) => TCLIENT_GET_ALL = (data) => {
    const clients = data
    if (userId && rol?.rolName !== 'Administrador')
      return clients?.filter(({ owner_id }) => owner_id === userId)
    return clients
  }

  const {
    data: clientsRes,
    isSuccess: okClients,
    error: errorClients,
    isPending: _pendingClients,
  } = useQuery(queryOptions({ ...getClientListOpt, select: selectClients }))

  const selectCredits: (data: TCREDIT_GET_FILTER_ALL) => TDaysProps = (
    data
  ) => {
    let credits: TCREDIT_GET_FILTER_ALL = data
    if (userId && rol?.rolName !== 'Administrador')
      credits = data?.filter(({ cobrador_id }) => cobrador_id === userId)

    return Object.fromEntries(
      credits?.map<[string, TData]>(
        ({
          fecha_de_cuota,
          id: creditId,
          nombre_del_cliente,
          valor_de_la_mora,
          numero_de_cuota,
        }) => [
          format(fecha_de_cuota, 'dd-MM-yyyy'),
          {
            type: valor_de_la_mora > 0 ? 'mora' : 'warning',
            creditId,
            client: nombre_del_cliente,
            cuete: numero_de_cuota,
          },
        ]
      )
    )
  }

  const { data: creditsRes } = useQuery(
    queryOptions({ ...getCreditsListOpt, select: selectCredits })
  )

  const [clients, setClients] = useState<TCLIENT_GET_ALL | undefined>(undefined)
  const { theme, setTheme } = useTheme()
  const rchild = useChildMatches()
  const { history } = useRouter()
  const [pendingClients, setPendingClients] = useState<boolean>(_pendingClients)

  useEffect(() => {
    refetch({
      cancelRefetch: !userId,
    })?.then(({ data, isPending }) => {
      if (!data) return
      const { nombre, id } = getRolByName({ rolName: data.rol as TROLES })
      setRol({ rolId: id, rolName: nombre })

      setUserId(data.id)
      setPendingClients(_pendingClients || isPending)
    })
  }, [userId])

  useEffect(() => {
    if (userId) {
      return () => {
        setUserId(undefined)
      }
    }
    if (!currentUserRes || !okCurrentUser || errorCurrentUser) return

    setUserId(currentUserRes.id)

    const { nombre, id } = getRolByName({
      rolName: currentUserRes.rol as TROLES,
    })
    setRol({ rolId: id, rolName: nombre })
  }, [currentUserRes, okCurrentUser, errorCurrentUser, userId])

  useEffect(() => {
    if (!clientsRes || !okClients || errorClients) return
    setClients(clientsRes)
  }, [clientsRes, okClients, errorClients])

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

  const onChange = useCallback<
    React.ChangeEventHandler<React.ComponentRef<typeof Input>>
  >(
    (ev) => {
      const { value } = ev.currentTarget
      setValue({ value })

      if (clientsRes) {
        const query = clientsRes?.filter((items) =>
          Object.values(items)
            .join(' ')
            .toLowerCase()
            .includes(value.toLowerCase())
        )
        setClients(query)
      }
    },
    [clientsRes]
  )

  const onKeyDown: React.KeyboardEventHandler<
    React.ComponentRef<typeof Input>
  > = (ev) => {
    const { key } = ev

    if (!clients || !clients?.length) return

    const child = rchild?.[0]
    if (!child) return
    const { pathname } = child

    if (
      key === 'Enter' &&
      pathname !== ('/user' as TSearch) &&
      pathname !== ('/client' as TSearch) &&
      pathname !== ('/credit' as TSearch)
    ) {
      setSearch({ search: !search })
    }
  }

  const onSelect: (index: number) => React.MouseEventHandler<HTMLLIElement> =
    (index) => () => {
      const client = clients?.[index]
      if (!client) return

      // setValue({value: client?.nombres + " " + client?.apellidos})
      setOpen({ open: !open })
    }

  const onSearchChange = () => {
    if (!clients || !clients?.length) return
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

  const onLogut: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    deleteToken()
  }

  const onOpenChange: (open: boolean) => void = (open) => {
    setOpen({ open })
  }

  return (
    <div
      className={clsx(
        'grid auto-rows-min auto-rows-min gap-2 space-y-4 md:landscape:container xl:grid-cols-2 xl:grid-rows-3',
        styles?.['grid-layout']
      )}
    >
      <nav
        className={clsx(
          'row-span-full hidden rounded-lg bg-primary-foreground p-4 text-primary shadow-lg hover:shadow-xl xl:block xl:h-[100dvh]',
          {
            [styles?.['menu-animation']]: !navmenu,
            [styles?.['menu-animation-reverse']]: navmenu,
          }
        )}
      >
        <Link to={'/'}>
          <img
            alt="brand"
            src={!navmenu ? brand : brandOff}
            className={clsx('aspect-contain', {
              'h-24': !navmenu,
              'h-16': navmenu,
            })}
          />
        </Link>
        <Separator className="my-4" />
        <div className="p-4 px-6 text-xl">
          <ul className="space-y-3 [&_button]:w-full">
            {Object.entries(translate())
              ?.filter(([, { validation }]) => validation)
              ?.map(([url, { name: title, icon: Icon }], index) => {
                return (
                  <li key={index}>
                    <Link to={url}>
                      {({ isActive }) => (
                        <Button
                          variant={!isActive ? 'link' : 'default'}
                          className={clsx('delay-50 font-bold duration-300', {
                            'p-2': navmenu,
                          })}
                        >
                          {!navmenu ? title : <Icon />}
                        </Button>
                      )}
                    </Link>
                  </li>
                )
              })}
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid place-items-center">
          {!navmenu ? (
            <Calendar
              key={'calendar'}
              className="rounded-xl bg-secondary-foreground text-muted-foreground ring-1 ring-secondary"
              days={creditsRes}
            />
          ) : (
            <Popover onOpenChange={onclick(setStatus, { calendar: !calendar })}>
              <PopoverTrigger>
                <Button
                  className={clsx({ 'p-2': navmenu })}
                  variant={!calendar ? 'outline' : 'default'}
                >
                  <CalendarIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-76 rounded-xl">
                <Calendar
                  key={'calendar'}
                  className="rounded-xl bg-secondary-foreground text-muted-foreground ring-1 ring-secondary [&_*]:font-bold"
                  days={creditsRes}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </nav>
      <header className="sticky top-0 z-20 !my-0 px-0 md:px-2 xl:block [&_div]:flex [&_div]:items-center [&_div]:gap-4">
        <div className="h-16 justify-between rounded-lg bg-primary-foreground px-2 px-2 py-2 shadow-lg max-sm:rounded-t-none md:px-4 md:px-4">
          <div className="[&>button]:px-2">
            <Button
              className="hidden xl:block"
              variant={!navmenu ? 'default' : 'outline'}
              onClick={onclick(setStatus, { navmenu: !navmenu })}
            >
              <MenuSquare />
            </Button>
            <Button onClick={onBack} variant="ghost" className="p-1 xl:hidden">
              <ArrowLeftCircle />
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
            <SpinLoader
              value={value}
              onChange={onChange}
              rchild={rchild?.at(0)?.pathname}
            />
          </div>
          <div>
            <Label className="group hidden items-center justify-center gap-2 rounded-lg md:flex md:gap-1 xl:flex-row-reverse">
              <Input
                className="origin-right scale-x-[0%] transition delay-150 duration-300 placeholder:invisible group-hover:visible group-hover:scale-x-[100%] group-hover:placeholder:visible xl:scale-x-[100%] xl:placeholder:visible"
                type="search"
                placeholder={text.search.placeholder({
                  pathname: rchild?.at(0)?.pathname,
                })}
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={value}
              />
              <Button
                variant="ghost"
                className="duration-450 px-2 opacity-100 transition delay-300 group-hover:invisible group-hover:opacity-0 xl:hidden"
              >
                <Search />
              </Button>
              <Popover open={search} onOpenChange={onSearchChange}>
                <PopoverTrigger>
                  <Button
                    className={clsx('p-2')}
                    variant={!search ? 'ghost' : 'default'}
                  >
                    <User />
                    {pendingClients && !clientsRes && (
                      <BoundleLoader> </BoundleLoader>
                    )}
                    {errorClients && <ErrorStates searchList />}
                    {okClients && (
                      <Badge
                        className={clsx(
                          { '!hidden': search },
                          styles?.['search-badge-animation']
                        )}
                        variant={!search ? 'default' : 'secondary'}
                      >
                        {clients?.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="absolute -start-48 top-2 w-80 xl:-start-16"
                  hidden={!clients?.length}
                >
                  <div className="space-y-4 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2">
                    <h3 className="text-xl [&>span]:underline">
                      <span>{text.search.title}</span>
                      <Badge variant="default"> {clients?.length} </Badge>
                    </h3>
                    <Separator />
                    <ScrollArea className="h-56">
                      <ScrollBar orientation="vertical" />
                      <ul className="flex flex-col gap-2 [&_a]:flex [&_a]:flex-row [&_a]:items-center [&_a]:gap-4">
                        {clients?.map(
                          (
                            {
                              apellidos,
                              nombres,
                              id: clientId,
                              numero_de_identificacion,
                            },
                            index
                          ) =>
                            clientId && (
                              <li
                                key={index}
                                className="group cursor-pointer"
                                onClick={onSelect(index)}
                              >
                                <Link
                                  to={'/client/$clientId/update'}
                                  params={{ clientId }}
                                >
                                  <Avatar>
                                    <AvatarFallback className="!ring-2 ring-ring">
                                      {nombres?.[0] + apellidos?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p
                                      className={clsx(
                                        "font-bold group-hover:after:content-['#']"
                                      )}
                                    >
                                      {nombres + ' ' + apellidos}
                                    </p>
                                    <p className="italic">
                                      {numero_de_identificacion.slice(0, 4) +
                                        '...' +
                                        numero_de_identificacion.slice(
                                          -4,
                                          numero_de_identificacion.length
                                        )}
                                    </p>
                                  </div>
                                </Link>
                              </li>
                            )
                        )}
                      </ul>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>
            </Label>
            <Label className="!hidden cursor-pointer flex-row items-center gap-2 md:landscape:!flex">
              {theme === 'dark' ? <Moon /> : <Sun />}
              <Switch checked={theme === 'dark'} onCheckedChange={onSwitch} />
            </Label>
            <HoverCard
              open={usermenu}
              onOpenChange={(value) =>
                onclick(setStatus, { usermenu: value })()
              }
            >
              <HoverCardTrigger
                onClick={onclick(setStatus, { usermenu: !usermenu })}
              >
                <Badge className="cursor-pointer text-sm" variant="outline">
                  {(name ?? 'User')
                    .split(' ')
                    .map((char) => char.at(0))
                    .join('')}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="mx-4 xl:mx-0">
                {pendingPayments && (
                  <div className="p-2">
                    <Skeleton className="h-10 w-10 rounded-full ring-1 ring-ring" />
                    <ul className="space-y-2 [&>li]:w-fit">
                      <li>
                        {' '}
                        <Skeleton className="h-5 w-32" />{' '}
                      </li>
                      <li>
                        {' '}
                        <Skeleton className="h-4 w-20" />{' '}
                      </li>
                      <li>
                        {' '}
                        <Skeleton className="h-4 w-16" />{' '}
                      </li>
                    </ul>
                  </div>
                )}
                {errorCurrentUser ||
                  (errorPayments && <ErrorStates currentUser />)}
                {okCurrentUser && okPayments && (
                  <div className="w=full flex flex-col [&>*]:w-full">
                    <div className="">
                      <Avatar className="ring-1 ring-ring">
                        <AvatarFallback>
                          {name?.split(' ')?.map((items) => items?.[0])}
                        </AvatarFallback>
                      </Avatar>
                      <ul className="w-full space-y-2 p-2 [&>li]:w-fit">
                        <li>
                          <Dialog open={open} onOpenChange={onOpenChange}>
                            <DialogTrigger asChild>
                              <span
                                title="Modificar mi usuario"
                                className="cursor-pointer font-bold after:opacity-0 after:transition after:transition after:delay-150 after:duration-300 hover:after:opacity-100 hover:after:content-['#']"
                              >
                                {currentUserRes?.nombre}
                              </span>
                            </DialogTrigger>
                            <MyUserInfo />
                          </Dialog>
                        </li>
                        <li>
                          {' '}
                          <Badge> {currentUserRes?.rol} </Badge>{' '}
                        </li>
                        {rol?.rolName === 'Administrador' && (
                          <li>
                            {' '}
                            <Badge variant={'outline'}>
                              {' '}
                              ${' '}
                              {Math.ceil(
                                payments?.reduce((prev, acc) => ({
                                  ...acc,
                                  valor_del_pago:
                                    acc.valor_del_pago + prev?.valor_del_pago,
                                }))?.valor_del_pago
                              )}{' '}
                            </Badge>{' '}
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <Label className="flex cursor-pointer items-center gap-2 md:landscape:hidden">
                        {theme === 'dark' ? <Moon /> : <Sun />}
                        <Switch
                          checked={theme === 'dark'}
                          onCheckedChange={onSwitch}
                        />
                      </Label>
                    </div>
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
            <Link to={'/'}>
              <Button
                variant={'ghost'}
                className="group p-2 [&>svg]:p-1 [&>svg]:transition [&>svg]:delay-150 [&>svg]:duration-300"
                onClick={onLogut}
              >
                <LogOut className="group-hover:stroke-destructive" />
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
      <main className="space-y-2 px-4 [&>:first-child]:items-center [&>:first-child]:gap-2 xl:[&>:first-child]:flex">
        <div className="hidden">
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
        <div className="flex flex-col justify-between space-y-4 xl:h-full xl:px-8 xl:py-4">
          <Outlet />
        </div>
      </main>
      <footer className="py-2 xl:py-4">
        <Separator className="my-2 xl:my-4" />
        <h3 className="max-xl:m-auto w-fit space-x-2 xl:ms-auto">
          <span className="italic">{text.footer.copyright}</span>
          <Badge> &copy; {new Date().getFullYear()} </Badge>
        </h3>
      </footer>
    </div>
  )
}

/* eslint-disable-next-line */
export const ErrorStates = ({
  searchList,
}: {
  currentUser?: boolean
  searchList?: boolean
}) => {
  if (searchList) {
    return <ErrorIcon className="stroke-destructive p-1" />
  }
  return (
    <div className="!flex-row">
      <h2 className="text-2xl font-bold text-destructive">:&nbsp;(</h2>
      <p className="text-sm italic"> {text.error} </p>
    </div>
  )
}

/* eslint-disable-next-line */
export function Error({ error }: ErrorComponentProps) {
  const [ errorMsg, setMsg ] = useState<{ type: number | string; msg?: string } | undefined>( undefined )
  useEffect( () => {
    try{
      setMsg(JSON?.parse((error as Error)?.message))
    }
    catch{
      setMsg({ type: "Error", msg: (error as Error).message })
    }
  }, [error] )
  const navigate = useNavigate()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    useToken.setState({
      token: undefined,
      rol: undefined,
      name: undefined,
      userId: undefined,
    })
    userOrder.setState({ order: 'id' })
    creditOrder.setState({ order: 'id' })
    userPagination.setState({ start: 0, end: 3 })
    creditPagination.setState({ start: 0, end: 3 })
    clientFilter.setState({ filter: 'fullName' })
    navigate({ to: '/' })
  }
  return (
    <div className="flex h-[100dvh] flex-col  items-center items-center justify-center gap-4 md:flex-row [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{errorMsg?.type}</h1>
        <p className="italic">{errorMsg?.msg}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.retry + '.'}{' '}
        </Button>
      </div>
    </div>
  )
}

Layout.dispalyname = 'Layout'
ErrorStates.dispalyname = 'LayoutErrorStates'
Error.dispalyname = 'LayoutError'
