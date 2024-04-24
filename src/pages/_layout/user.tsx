import { type TUSER_GET_ALL, getUsersList } from '@/api/users'
import { type TROLES } from '@/lib/type/rol'
import { type TUSER_GET } from '@/api/users'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { createContext, useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  UserCog as UserUpdate,
  UserX as UserDelete,
  Users as UsersList,
  Annoyed,
} from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useStatus } from '@/lib/context/layout'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@tanstack/react-router'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { queryClient } from '@/pages/__root'
import { useToken } from '@/lib/context/login'

export const getUsersListOpt = {
  queryKey: ['list-users'],
  queryFn: getUsersList,
}

export const Route = createFileRoute('/_layout/user')({
  pendingComponent: Pending,
  errorComponent: Error,
  component: Users,
  loader: () => queryClient.ensureQueryData(queryOptions(getUsersListOpt)),
  beforeLoad: () => {
    const { rol, userId } = useToken.getState()
    if (!userId || rol?.rolName !== 'Administrador') throw redirect({ to: '/' })
  },
})

/* eslint-disable-next-line */
export interface TUsersState extends TUSER_GET {
  selected: boolean
  menu: boolean
  active?: boolean
}

/* eslint-disable-next-line */
type TOrderType = 'Nombre' | 'Fecha de creacion' | 'Rol'

const STEP = 3
const LENGTH = 9
const ORDER: Record<keyof Omit<TUSER_GET, 'clientes'>, TOrderType> = {
  id: 'Fecha de creacion',
  nombre: 'Nombre',
  rol: 'Rol',
}
export const _selectUsers = createContext<TUsersState[]>([])
export const usePagination = create<{
  start: number
  end: number
  setPagination: (params: { start: number; end: number }) => void
}>()(
  persist(
    (set) => ({
      start: 0,
      end: STEP,
      setPagination: ({ start, end }) => set(() => ({ start, end })),
    }),
    { name: 'users-pagination' }
  )
)
export const useOrder = create<{
  order: keyof typeof ORDER
  setOrder: (value: keyof typeof ORDER) => void
}>()(
  persist(
    (set) => ({
      order: 'id',
      setOrder: (order) => set(() => ({ order })),
    }),
    { name: 'user-order' }
  )
)

/* eslint-disable-next-line */
export function Users() {
  const { order, setOrder } = useOrder()
  const { userId } = useToken()
  const select: (data: TUSER_GET_ALL) => TUsersState[] = (data) =>
    sortUsers(
      order,
      data
        ?.map<TUsersState>((items) => ({
          ...items,
          selected: false,
          menu: false,
        }))
        ?.filter(({ id }) => userId !== id)
    )
  const { data: usersRes, isRefetching } = useSuspenseQuery(
    queryOptions({ ...getUsersListOpt, select })
  )
  const [users, setUsers] = useState<TUsersState[]>([])
  const navigate = useNavigate()
  const { value } = useStatus()
  const { open, setOpen } = useStatus()
  const { setPagination, ...pagination } = usePagination()

  useEffect(() => {
    if (!usersRes) return () => {}
    setUsers(usersRes)
  }, [usersRes, isRefetching])

  const onSelectOrder: (value: string) => void = (value) => {
    if (order !== 'rol' && order !== 'nombre' && order !== 'id') return
    setOrder(value as keyof typeof ORDER)
    setUsers(sortUsers(value as keyof typeof ORDER, usersRes))
  }

  const onPagnation: (params: {
    prev?: boolean
    next?: boolean
    index?: number
  }) => React.MouseEventHandler<React.ComponentRef<typeof Button>> =
    ({ next, prev, index }) =>
    () => {
      if (
        prev &&
        pagination?.end - pagination?.start >= STEP &&
        pagination?.start > 1
      ) {
        setPagination({
          ...pagination,
          start: pagination?.start - 1,
          end: pagination?.end - STEP,
        })
      } else if (
        prev &&
        pagination?.start > 0 &&
        pagination?.start < pagination?.end
      ) {
        setPagination({ ...pagination, start: pagination?.start - 1 })
      } else if (
        next &&
        pagination?.start < pagination?.end - 1 &&
        pagination?.start < users?.length / LENGTH - 1
      ) {
        setPagination({ ...pagination, start: pagination?.start + 1 })
      } else if (
        next &&
        pagination?.start === pagination?.end - 1 &&
        pagination?.start < users?.length / LENGTH - 1
      ) {
        setPagination({
          ...pagination,
          start: pagination?.start + 1,
          end: pagination?.end + STEP,
        })
      }

      if (typeof index === 'undefined') return
      setPagination({ ...pagination, start: index })
    }

  useEffect(() => {
    document.title = import.meta.env.VITE_NAME + ' | ' + text.browser
  }, [])

  const onCheckChanged =
    (
      index: number,
      prop: keyof Omit<TUsersState, 'id' | 'rol' | 'clientes' | 'nombre'>
    ) =>
    (checked: boolean) => {
      const list = users?.map((user, i) => {
        if (i === index && prop === 'selected') {
          return { ...user, selected: checked }
        } else if (i === index && prop === 'active') {
          return { ...user, active: checked }
        } else if (i === index && prop === 'menu') {
          return { ...user, menu: checked }
        }
        return user
      })
      setUsers(list)
    }

  const onClick: (
    index: number
  ) => React.MouseEventHandler<React.ComponentRef<typeof Card>> =
    (index) => () => {
      const user = users?.[index]
      if (!user || !user.id) return

      const { selected } = user
      onCheckChanged(index, 'selected')(!selected)
    }

  const onClickStop: React.MouseEventHandler = (ev) => {
    ev.stopPropagation()
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const onOpenChangeById: (
    index: number
  ) => React.MouseEventHandler<React.ComponentRef<typeof DropdownMenuItem>> =
    (index) => (ev) => {
      const user = users?.[index]
      if (!user || !user?.id) return
      const { menu } = user

      onOpenChange(!open)
      onCheckChanged(index, 'menu')(!menu)

      ev.stopPropagation()
    }

  useEffect(() => {
    if (value) {
      setUsers(
        usersRes?.filter(({ nombre }) =>
          nombre.toLowerCase().includes(value?.toLowerCase() ?? '')
        )
      )
      setPagination({ ...pagination, start: 0, end: STEP })
    }
    return () => {
      setUsers(usersRes)
    }
  }, [value])

  return (
    <_selectUsers.Provider value={users?.filter(({ selected }) => selected)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">{text.title}</h1>
          {!!users?.length && (
            <Badge className="text-lg md:text-xl">{users?.length}</Badge>
          )}
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild className="ms-auto">
              <Link to={'./new'}>
                <Button variant="default" className="ms-auto">
                  {text.button.create}
                </Button>
              </Link>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Link
                to={'./delete'}
                disabled={!users?.some(({ selected }) => selected)}
              >
                <Button
                  disabled={!users?.some(({ selected }) => selected)}
                  className={clsx({
                    'bg-destructive hover:bg-destructive': users?.some(
                      ({ selected }) => selected
                    ),
                  })}
                >
                  {text.button.delete}
                </Button>
              </Link>
            </DialogTrigger>
            <Outlet />
          </Dialog>
        </div>
        <Separator />
        {!!users?.length && (
          <div className="flex items-center">
            <p className="hidden text-sm text-muted-foreground xl:block">
              {text.select({
                select: users?.filter(({ selected }) => selected)?.length,
                total: usersRes?.length,
              })}
            </p>
            <Select required defaultValue={order} onValueChange={onSelectOrder}>
              <SelectTrigger className="!border-1 w-44 !border-ring xl:ms-auto xl:w-48">
                <SelectValue placeholder={'Orden'} />
              </SelectTrigger>
              <SelectContent className="[&_*]:cursor-pointer">
                {Object.entries(ORDER)?.map(([key, value], index) => (
                  <SelectItem key={index} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!users?.length && <p>{text.notFound}</p>}
        <div
          className={clsx(
            'md:[&>*]:baisis-3/5 flex flex-wrap content-start justify-center gap-3 xl:gap-4 [&>*]:flex-auto',
            { '!justify-start': users?.length - pagination?.start * LENGTH < 3 }
          )}
        >
          {!!users?.length &&
            users
              ?.slice(
                pagination?.start * LENGTH,
                (pagination?.start + 1) * LENGTH
              )
              ?.map(
                (
                  { id: userId, rol, nombre, selected, active, menu },
                  index
                ) => (
                  <Card
                    key={userId}
                    className={clsx(
                      'group cursor-pointer py-4 shadow-lg transition delay-150 duration-500 hover:scale-105'
                    )}
                    onClick={onClick(index + pagination?.start * LENGTH)}
                  >
                    <div className="flex items-center justify-end gap-2 px-4">
                      <Dialog open={open} onOpenChange={onOpenChange}>
                        <DropdownMenu
                          open={menu}
                          onOpenChange={onCheckChanged(
                            index + pagination?.start * LENGTH,
                            'menu'
                          )}
                        >
                          <DropdownMenuTrigger asChild onClick={onClickStop}>
                            <Button
                              variant="ghost"
                              className="h-4 w-8 p-0 hover:ring hover:ring-primary xl:h-8 xl:w-8"
                            >
                              <span className="sr-only">{text.menu.aria}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            onClick={onClickStop}
                            align="center"
                            className="mx-4 w-56 xl:mx-0 [&>*:not(:is([role=separator],:first-child))]:h-16 [&>*]:flex [&>*]:cursor-pointer [&>*]:justify-between [&>*]:gap-2"
                          >
                            <DropdownMenuLabel className="text-base">
                              {text.menu.title}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link
                                className="flex h-full w-full items-center justify-between gap-2"
                                to={'/client'}
                                search={{ userId }}
                              >
                                {text.menu.client} <UsersList />
                              </Link>
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onClick={onOpenChangeById(
                                  index + pagination?.start * LENGTH
                                )}
                              >
                                <Link
                                  className="flex h-full w-full items-center justify-between gap-2"
                                  to={'./$userId/update'}
                                  params={{ userId }}
                                >
                                  {text.menu.update} <UserUpdate />
                                </Link>
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onClick={onOpenChangeById(
                                  index + pagination?.start * LENGTH
                                )}
                              >
                                <Link
                                  className="flex h-full w-full items-center justify-between gap-2"
                                  to={'./$userId/delete'}
                                  params={{ userId: userId }}
                                  search={{ name: nombre }}
                                >
                                  {text.menu.delete} <UserDelete />
                                </Link>
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Dialog>
                      <Checkbox
                        name={'selected' as keyof TUsersState}
                        checked={selected}
                        onCheckedChange={onCheckChanged(
                          index + pagination?.start * LENGTH,
                          'selected'
                        )}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Avatar className="grid h-16 w-16 place-items-center ring-2 ring-ring ">
                          <AvatarFallback className="text-2xl uppercase">
                            {nombre
                              .split(' ')
                              .map((val) => val.at(0))
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {nombre}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between [&>*]:flex [&>*]:cursor-pointer [&>*]:items-center [&>*]:gap-2">
                      <Badge
                        className={clsx('hover:bg-[auto]', {
                          'bg-red-500': rol === ('Administrador' as TROLES),
                          'bg-blue-500': rol === ('Cobrador' as TROLES),
                          'bg-green-500': rol === ('Usuario' as TROLES),
                        })}
                      >
                        {rol}
                      </Badge>
                      {active && (
                        <Switch
                          checked={active}
                          onCheckedChange={onCheckChanged(
                            index + pagination?.start * LENGTH,
                            'active'
                          )}
                          onClick={onClickStop}
                        ></Switch>
                      )}
                    </CardContent>
                  </Card>
                )
              )}
        </div>
      </div>
      {users?.length > LENGTH && (
        <Pagination className="relative z-10">
          <PaginationContent className="rounded-md bg-background ring-1 ring-border">
            <PaginationItem>
              <Button
                disabled={pagination?.start <= 0}
                onClick={onPagnation({ prev: true })}
                className="delay-0 duration-100"
                variant={'outline'}
              >
                {text.pagination.back}
              </Button>
            </PaginationItem>
            {pagination?.end - STEP > 0 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {Array.from({ length: STEP })?.map((_, index) => {
              if (pagination?.end + index - STEP > (users?.length - 1) / LENGTH)
                return null
              return (
                <PaginationItem key={index}>
                  <Button
                    className={clsx('delay-0 duration-100 hover:text-muted', {
                      'text-muted-foreground hover:text-muted-foreground':
                        pagination?.start === pagination?.end + index - STEP,
                    })}
                    variant={
                      pagination?.start === pagination?.end + index - STEP
                        ? 'secondary'
                        : 'ghost'
                    }
                    onClick={onPagnation({
                      index: pagination?.end - STEP + index,
                    })}
                  >
                    {pagination?.end - STEP + index + 1}
                  </Button>
                </PaginationItem>
              )
            })}

            {pagination?.end < users?.length / LENGTH && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <Button
                disabled={pagination?.start >= users?.length / LENGTH - 1}
                className="delay-0 duration-100"
                variant={'outline'}
                onClick={onPagnation({ next: true })}
              >
                {text.pagination.next}
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </_selectUsers.Provider>
  )
}

/* eslint-disable-next-line */
export function Pending() {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 md:w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="ms-auto h-10 w-20 md:w-24" />
          <Skeleton className="h-10 w-20 md:w-24" />
        </div>
        <Separator />
        <div className="flex items-center">
          <Skeleton className="hidden h-6 md:w-56 xl:block" />
          <Skeleton className="h-8 w-40 xl:ms-auto" />
        </div>
        <div className="flex flex-wrap gap-4 px-2 [&>*]:flex-1">
          {Array.from({ length: LENGTH })?.map((_, index) => (
            <Card
              key={index}
              className={clsx(
                'justify-streetch inline-grid items-end shadow-lg'
              )}
            >
              <CardHeader>
                <Skeleton className="ms-auto h-8 w-8 rounded-md" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-2">
                <Skeleton className="h-6 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Skeleton className="mx-auto h-10 w-80" />
    </>
  )
}

/* eslint-disable-next-line */
export function Error() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }
  return (
    <div className="flex h-full flex-col items-center items-center justify-center gap-4 md:flex-row [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{text.error}</h1>
        <p className="italic">{text.errorDescription}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.back + '.'}{' '}
        </Button>
      </div>
    </div>
  )
}

const sortUsers = (order: keyof typeof ORDER, users: TUsersState[]) => {
  return users?.sort((a, b) => {
    const valueA = a?.[order]
    const valueB = b?.[order]
    if (typeof valueA === 'string' && typeof valueB === 'string')
      return valueA.charCodeAt(0) - valueB.charCodeAt(0)
    else if (typeof valueA === 'number' && typeof valueB === 'number')
      return valueA - valueB
    return 0
  })
}

Users.dispalyname = 'UsersList'
Error.dispalyname = 'UserListError'
Pending.dispalyname = 'UserListPending'

const text = {
  title: 'Usuarios:',
  error: 'Ups!!! ha ocurrido un error',
  select: ({ select, total }: { select: number; total: number }) =>
    `${select} de ${total} usuario(s) seleccionados.`,
  errorDescription: 'El listado de usuarios ha fallado.',
  back: 'Intente volver a la pestaña anterior',
  pagination: {
    back: 'Anterior',
    next: 'Siguiente',
  },
  browser: 'Usuarios',
  notFound: 'No se encontraron usuarios',
  button: {
    create: 'Nuevo',
    delete: 'Eliminar',
    deactivate: 'Desactivar',
  },
  menu: {
    aria: 'Mas Opciones',
    title: 'Acciones:',
    client: 'Ver clientes disponibles',
    update: 'Actualizar datos del usuario',
    delete: 'Eliminar usuario',
  },
}
