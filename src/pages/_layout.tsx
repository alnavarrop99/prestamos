import {
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
  X as ErrorIcon,
  Search,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Calendar, TData, TDaysProps } from '@/components/ui/calendar'
import React, {
  memo,
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
import { getRoute, getSearch, TSearch } from '@/lib/route'
import { useToken } from '@/lib/context/login'
import {
  queryOptions,
  useIsFetching,
  useIsMutating,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { SpinLoader as Loader, BoundleLoader } from '@/components/ui/loader'
import brand from '@/assets/menu-brand.avif'
import brandOff from '@/assets/menu-off-brand.avif'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getUsersListOpt,
  usePagination as userPagination,
  useOrder as userOrder,
} from '@/pages/_layout/user'
import {
  getUserByIdOpt,
  updateUserByIdOpt,
} from '@/pages/_layout/user/$userId/update'
import { postUserOpt } from '@/pages/_layout/user/new'
import {
  getClientListOpt,
  useFilter as clientFilter,
} from '@/pages/_layout/client'
import {
  getClientByIdOpt,
  updateClientByIdOpt,
} from '@/pages/_layout/client/$clientId/update'
import { postClientOpt } from '@/pages/_layout/client/new'
import { deleteClientByIdOpt } from '@/pages/_layout/client/$clientId/delete'
import {
  getCreditsListOpt,
  useOrder as creditOrder,
  usePagination as creditPagination,
} from '@/pages/_layout/credit'
import { getCreditByIdOpt } from '@/pages/_layout/credit_/$creditId'
import {
  deletePaymentByIdOpt,
  updateCreditByIdOpt,
  updatePaymentByIdOpt,
} from '@/pages/_layout/credit_/$creditId_/update.confirm'
import { deleteCreditByIdOpt } from '@/pages/_layout/credit_/$creditId/delete'
import { postPaymentOpt } from '@/pages/_layout/credit_/$creditId/pay'
import { postCreditOpt } from '@/pages/_layout/credit/new'
import { queryClient } from '@/pages/__root'
import { getReportsOpt, postReportOpt } from '@/pages/_layout/report'
import { getRolByName, type TROLES } from '@/lib/type/rol'
import { translate } from '@/lib/route'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { MyUserInfo } from '@/pages/-info'
import { format } from 'date-fns'
import { type TCREDIT_GET_FILTER_ALL } from '@/api/credit'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export const getCurrentUserOpt = {
  queryKey: ['login-user', { userId: useToken.getState().userId }],
  queryFn: getCurrentUser,
}

export const Route = createFileRoute('/_layout')({
  component: Layout,
  pendingComponent: () => <></>,
  loader: async () => ({
    user: queryClient.ensureQueryData(queryOptions(getCurrentUserOpt)),
    clients: defer(queryClient.ensureQueryData(queryOptions(getClientListOpt))),
    credits: defer(
      queryClient.ensureQueryData(queryOptions(getCreditsListOpt))
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
    isPending: pendingCurrentUser,
    refetch,
  } = useSuspenseQuery(queryOptions(getCurrentUserOpt))

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

  const { data: creditssRes } = useQuery(
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
              days={creditssRes}
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
                  days={creditssRes}
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
                    {errorClients && <Error searchList />}
                    {pendingClients && <BoundleLoader />}
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
                {errorCurrentUser && <Error currentUser />}
                {pendingCurrentUser && (
                  <div className="p-2">
                    <Skeleton className="h-10 w-10 rounded-full ring-1 ring-ring" />
                    <ul className="space-y-2 [&>li]:w-fit">
                      <li>
                        {' '}
                        <Skeleton className="h-5 w-32" />{' '}
                      </li>
                      <li>
                        {' '}
                        <Skeleton className="h-4 w-16" />{' '}
                      </li>
                    </ul>
                  </div>
                )}
                {okCurrentUser && (
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
      <main className=" space-y-2 px-4 [&>:first-child]:flex [&>:first-child]:items-center [&>:first-child]:gap-2">
        <div className="!hidden xl:block">
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
        <h3 className="m-auto w-fit space-x-2 xl:ms-auto">
          <span className="italic">{text.footer.copyright}</span>
          <Badge> &copy; {new Date().getFullYear()} </Badge>
        </h3>
      </footer>
    </div>
  )
}

/* eslint-disable-next-line */
type TSpinLoader = {
  rchild?: string
  value?: string
  onChange: React.ChangeEventHandler<React.ComponentRef<typeof Input>>
}

/* eslint-disable-next-line */
const SpinLoader = memo<TSpinLoader>(function ({ onChange, rchild, value }) {
  const [menu, setMenu] = useState<boolean>(false)

  const onOpenChange = (open: boolean) => {
    setMenu(open)
  }

  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    setMenu(!menu)
  }

  const onSearch: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    if (!value || value === '') return
    setMenu(!menu)
  }

  const onKeyDown: React.KeyboardEventHandler<
    React.ComponentRef<typeof Input>
  > = (ev) => {
    const key = ev.key
    if (key === 'Enter') setMenu(!menu)
  }

  const getUser = useIsFetching({
    fetchStatus: 'fetching',
    type: 'inactive',
    stale: true,
    queryKey: ([] as string[]).concat(getUsersListOpt.queryKey),
  })

  const userId = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(
      getUserByIdOpt({ userId: '' }).queryKey[0] as string
    ),
  })

  const postUser = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postUserOpt.mutationKey),
  })

  const updateUser = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updateUserByIdOpt?.mutationKey),
  })

  const getClient = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(getClientListOpt.queryKey),
  })

  const clientId = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(
      getClientByIdOpt({ clientId: '' }).queryKey[0] as string
    ),
  })

  const postClient = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postClientOpt.mutationKey),
  })

  const updateClient = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updateClientByIdOpt?.mutationKey),
  })

  const deleteClient = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(deleteClientByIdOpt?.mutationKey),
  })

  const getCredit = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(getCreditsListOpt.queryKey),
  })

  const creditId = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(
      getCreditByIdOpt({ creditId: '' }).queryKey[0] as string
    ),
  })

  const postCredit = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postCreditOpt.mutationKey),
  })

  const updateCredit = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updateCreditByIdOpt?.mutationKey),
  })

  const deleteCredit = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(deleteCreditByIdOpt?.mutationKey),
  })

  const postPayment = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(postPaymentOpt.mutationKey),
  })

  const updatePayment = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(updatePaymentByIdOpt?.mutationKey),
  })

  const deletePayment = useIsMutating({
    status: 'pending',
    mutationKey: ([] as string[]).concat(deletePaymentByIdOpt?.mutationKey),
  })

  const getReports = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(getReportsOpt.queryKey),
  })

  const postReport = useIsFetching({
    fetchStatus: 'fetching',
    stale: true,
    type: 'inactive',
    queryKey: ([] as string[]).concat(postReportOpt.mutationKey),
  })

  const className =
    'text-muted-foreground italic text-xs flex items-center gap-2'

  if (getUser || userId) {
    return (
      <span className={className}>
        <Loader /> {text.loader.user.get}
      </span>
    )
  } else if (postUser) {
    return (
      <span className={className}>
        <Loader /> {text.loader.user.new}{' '}
      </span>
    )
  } else if (updateUser) {
    return (
      <span className={className}>
        <Loader /> {text.loader.user.update}{' '}
      </span>
    )
  }

  if (getClient || clientId) {
    return (
      <span className={className}>
        <Loader /> {text.loader.client.get}
      </span>
    )
  } else if (postClient) {
    return (
      <span className={className}>
        <Loader /> {text.loader.client.new}{' '}
      </span>
    )
  } else if (updateClient) {
    return (
      <span className={className}>
        <Loader /> {text.loader.client.update}{' '}
      </span>
    )
  } else if (deleteClient) {
    return (
      <span className={className}>
        <Loader /> {text.loader.client.delete}{' '}
      </span>
    )
  }

  if (getCredit || creditId) {
    return (
      <span className={className}>
        <Loader /> {text.loader.credit.get}
      </span>
    )
  } else if (postCredit) {
    return (
      <span className={className}>
        <Loader /> {text.loader.credit.new}{' '}
      </span>
    )
  } else if (updateCredit) {
    return (
      <span className={className}>
        <Loader /> {text.loader.credit.update}{' '}
      </span>
    )
  } else if (deleteCredit) {
    return (
      <span className={className}>
        <Loader /> {text.loader.credit.delete}{' '}
      </span>
    )
  }

  if (postPayment) {
    return (
      <span className={className}>
        <Loader /> {text.loader.payment.new}{' '}
      </span>
    )
  } else if (updatePayment) {
    return (
      <span className={className}>
        <Loader /> {text.loader.payment.update}{' '}
      </span>
    )
  } else if (deletePayment) {
    return (
      <span className={className}>
        <Loader /> {text.loader.payment.delete}{' '}
      </span>
    )
  }

  if (getReports) {
    return (
      <span className={className}>
        <Loader /> {text.loader.report.get}{' '}
      </span>
    )
  } else if (postReport) {
    return (
      <span className={className}>
        <Loader /> {text.loader.report.post}{' '}
      </span>
    )
  }

  return (
    <Popover open={menu} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild className="xl:hidden">
        <img alt="brand" src={brand} className={clsx('aspect-contain h-12')} />
      </PopoverTrigger>
      <PopoverContent className="min-sm:rounded-t-none w-screen space-y-2 shadow-xl md:mx-4 md:mt-4 md:w-[96dvw]">
        <Label className="flex items-center gap-2 px-4 md:hidden">
          <Input
            type="search"
            placeholder={text.search.placeholder({
              pathname: rchild,
            })}
            onChange={onChange}
            value={value}
            onKeyDown={onKeyDown}
          />
          <Button
            variant="outline"
            className="duration-450 px-2 opacity-100 transition delay-300 group-hover:invisible group-hover:opacity-0 xl:hidden"
            onClick={onSearch}
          >
            <Search />
          </Button>
        </Label>
        <Separator className="my-2" />
        <ul className="space-y-3 px-4 md:px-20 [&_button]:w-full">
          {Object.entries(translate())
            ?.filter(([, { validation }]) => validation)
            ?.map(([url, { name: title, icon: Icon }], index) => {
              return (
                <li key={index}>
                  <Link to={url}>
                    {({ isActive }) => (
                      <Button
                        onClick={onClick}
                        variant={!isActive ? 'link' : 'default'}
                        className={clsx(
                          'delay-50 flex justify-start gap-2 font-bold  duration-300 md:justify-center',
                          {}
                        )}
                      >
                        <Icon />
                        {title}
                      </Button>
                    )}
                  </Link>
                </li>
              )
            })}
        </ul>
      </PopoverContent>
    </Popover>
  )
})

/* eslint-disable-next-line */
export const Error = ({
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

Layout.dispalyname = 'Layout'
Error.dispalyname = 'LayoutError'

const text = {
  title: 'Matcor',
  error: 'Ups!!! ha ocurrido un error inesperado',
  loader: {
    user: {
      new: 'Creando usuario',
      update: 'Actualizando usuario',
      delete: 'Eliminando usuario(s)',
      get: 'Cargando usuario(s)',
    },
    client: {
      new: 'Creando cliente',
      update: 'Actualizando cliente',
      delete: 'Eliminando cliente(s)',
      get: 'Cargando cliente(s)',
    },
    credit: {
      new: 'Creando prestamo',
      update: 'Actualizando prestamo',
      delete: 'Eliminando prestamo(s)',
      get: 'Cargando prestamo(s)',
    },
    payment: {
      new: 'Creando pago',
      update: 'Actualizando pago',
      delete: 'Eliminando pago(s)',
      get: 'Cargando pago(s)',
    },
    report: {
      get: 'Cargando reporte(s)',
      post: 'Creando reporte(s)',
    },
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
