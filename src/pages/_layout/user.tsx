import { getUsersRes } from '@/api/users'
import type { TUser } from '@types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Link,
  Outlet,
  createFileRoute,
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
} from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useStatus } from '@/lib/context/layout'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_layout/user')({
  component: Users,
  loader: getUsersRes,
})

/* eslint-disable-next-line */
interface TUsersProps {
  open?: boolean
  users?: TUser[]
}

/* eslint-disable-next-line */
interface TUsersState extends TUser {
  selected: boolean
  menu: boolean
  active?: boolean
}

/* eslint-disable-next-line */
export type TRole = 'Administrador' | 'Cliente' | 'Usuario'

export const _selectUsers = createContext<TUsersState[] | undefined>(undefined)

/* eslint-disable-next-line */
export function Users({
  children,
  open: _open,
  users: _users = [] as TUser[],
}: React.PropsWithChildren<TUsersProps>) {
  const usersDB = (Route.useLoaderData() ?? _users)?.map<TUsersState>(
    (items) => ({ ...items, selected: false, menu: false })
  )
  const [users, setUsers] = useState<TUsersState[]>(usersDB)
  const navigate = useNavigate()
  const { value } = useStatus()
  const { open = _open, setOpen } = useStatus()

  const onCheckChanged =
    ({
      id: index,
      prop,
    }: {
      id: number
      prop: keyof Omit<(typeof users)[0], 'id' | 'rol' | 'clientes' | 'nombre'>
    }) =>
    (checked: boolean) => {
      const list = users?.map(({ ...user }) => {
        const { id, ...items } = user
        if (id === index && prop === 'selected') {
          return { id, ...items, selected: checked }
        } else if (id === index && prop === 'active') {
          return { id, ...items, active: checked }
        } else if (id === index && prop === 'menu') {
          return { id, ...items, menu: checked }
        }
        return user
      })
      setUsers(list)
    }

  const onClick: ({
    id,
  }: {
    id: number
  }) => React.MouseEventHandler<React.ComponentRef<typeof Card>> =
    ({ id }) =>
    () => {
      const user = users?.find(({ id: userId }) => id === userId)
      if (!user) return

      const { selected } = user
      onCheckChanged({ id, prop: 'selected' })(!selected)
    }

  const onClickStop: React.MouseEventHandler = (ev) => {
    ev.stopPropagation()
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      !children && navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const onOpenChangeById: ({
    id,
  }: {
    id: number
  }) => React.MouseEventHandler<React.ComponentRef<typeof DropdownMenuItem>> =
    ({ id }) =>
    (ev) => {
      ev.stopPropagation()

      const user = users?.find(({ id: userId }) => id === userId)
      if (!user) return
      const { menu } = user

      onOpenChange(!open)
      onCheckChanged({ id, prop: 'menu' })(!menu)
    }

  useEffect(() => {
    if (value) {
      setUsers(
        usersDB?.filter(({ nombre }) =>
          nombre.toLowerCase().includes(value?.toLowerCase() ?? '')
        )
      )
    }
    return () => {
      setUsers(usersDB)
    }
  }, [value])

  return (
    <_selectUsers.Provider value={users?.filter(({ selected }) => selected)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          {users?.length && (
            <Badge className="px-3 text-xl">{users?.length}</Badge>
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
            {children ?? <Outlet />}
          </Dialog>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-4 [&>*]:flex-auto">
          {users?.length &&
            users?.map(
              ({ id, rol, nombre, clientes, selected, active, menu }) => (
                <Card
                  key={id}
                  className={clsx(
                    'group max-w-sm cursor-pointer py-4 shadow-lg transition delay-150 duration-500 hover:scale-105'
                  )}
                  onClick={onClick({ id })}
                >
                  <div className="flex items-center justify-end gap-2 px-4">
                    <Dialog open={open} onOpenChange={onOpenChange}>
                      <DropdownMenu
                        open={menu}
                        onOpenChange={onCheckChanged({ id, prop: 'menu' })}
                      >
                        <DropdownMenuTrigger asChild onClick={onClickStop}>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:ring hover:ring-primary"
                          >
                            <span className="sr-only">{text.menu.aria}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          onClick={onClickStop}
                          align="center"
                          className="w-56 [&>*:not(:is([role=separator],:first-child))]:h-16 [&>*]:flex [&>*]:cursor-pointer [&>*]:justify-between [&>*]:gap-2"
                        >
                          <DropdownMenuLabel className="text-md">
                            {text.menu.title}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!clientes || !clientes.length}
                          >
                            <Link
                              className="flex h-full w-full items-center justify-between gap-2"
                              to={'/client'}
                              search={{
                                clients: clientes,
                              }}
                            >
                              {text.menu.client} <UsersList />
                            </Link>
                          </DropdownMenuItem>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={onOpenChangeById({ id })}
                            >
                              <Link
                                className="flex h-full w-full items-center justify-between gap-2"
                                to={'./$userId/update'}
                                params={{ userId: id }}
                              >
                                {text.menu.update} <UserUpdate />
                              </Link>
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={onOpenChangeById({ id })}
                            >
                              <Link
                                className="flex h-full w-full items-center justify-between gap-2"
                                to={'./$userId/delete'}
                                params={{ userId: id }}
                              >
                                {text.menu.delete} <UserDelete />
                              </Link>
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Dialog>
                    <Checkbox
                      name={'selected' as keyof (typeof users)[0]}
                      checked={selected}
                      onCheckedChange={onCheckChanged({ id, prop: 'selected' })}
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
                        'bg-red-500': rol === ('Administrador' as TRole),
                        'bg-blue-500': rol === ('Cliente' as TRole),
                        'bg-green-500': rol === ('Usuario' as TRole),
                      })}
                    >
                      {' '}
                      {rol}{' '}
                    </Badge>
                    {active && (
                      <Switch
                        checked={active}
                        onCheckedChange={onCheckChanged({ id, prop: 'active' })}
                        onClick={onClickStop}
                      >
                        {' '}
                      </Switch>
                    )}
                  </CardContent>
                </Card>
              )
            )}
        </div>
      </div>
    </_selectUsers.Provider>
  )
}

Users.dispalyname = 'UsersList'

const text = {
  title: 'Usuarios:',
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
