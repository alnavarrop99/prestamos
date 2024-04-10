import { type TUSER_GET_ALL, getUsersList } from '@/api/users'
import { type TROLES } from "@/lib/type/rol";
import { type TUSER_GET } from "@/api/users";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
  Annoyed,
} from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { useStatus } from '@/lib/context/layout'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from '@tanstack/react-router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination';

export const Route = createFileRoute('/_layout/user')({
  pendingComponent,
  errorComponent,
  component: Users,
  loader: getUsersList,
})

/* eslint-disable-next-line */
interface TUsersProps {
  open?: boolean
  users?: TUSER_GET_ALL
}

/* eslint-disable-next-line */
export interface TUsersState extends TUSER_GET {
  selected: boolean
  menu: boolean
  active?: boolean
}

const STEP = 3
const LENGTH = 9
export const _selectUsers = createContext<TUsersState[] | undefined>(undefined)
export const _usersContext = createContext<[TUsersState[], React.Dispatch<React.SetStateAction<TUsersState[]>>] | undefined>(undefined)
const usePagination = create< { start: number, end: number, setPagination: ( params: { start: number, end: number } ) => void } >()( persist( (set) => ({
  start: 0,
  end: STEP,
  setPagination: ({ start, end }) => (set( () => ({ start, end }) ))
}), { name: "users-pagination" } ) )


/* eslint-disable-next-line */
export function Users({
  children,
  open: _open,
  users: _users = [] as TUSER_GET_ALL,
}: React.PropsWithChildren<TUsersProps>) {
  const usersDB = (Route.useLoaderData() ?? _users)?.map<TUsersState>(
    (items) => ({ ...items, selected: false, menu: false })
  )
  const [users, setUsers] = useState<TUsersState[]>(usersDB)
  const navigate = useNavigate()
  const { value } = useStatus()
  const { open = _open, setOpen } = useStatus()
  const { setPagination, ...pagination } = usePagination()

  const onPagnation: (params:{ prev?: boolean, next?: boolean, index?: number }) => React.MouseEventHandler< React.ComponentRef< typeof Button > > = ({ next, prev, index }) => () => {
    if( prev && pagination?.end - pagination?.start >= STEP && pagination?.start > 1 ){
      setPagination({ ...pagination, start: pagination?.start - 1, end: pagination?.end - STEP })
    }
    else if( prev && pagination?.start > 0 && pagination?.start < pagination?.end ){
      setPagination({ ...pagination, start: pagination?.start - 1 })
    }
    else if( next && pagination?.start < pagination?.end - 1 && pagination?.start < users?.length/LENGTH -1 ){
      setPagination({ ...pagination, start: pagination?.start + 1 })
    }
    else if( next && pagination?.start === pagination?.end - 1 && pagination?.start < users?.length/LENGTH -1){
      setPagination({ ...pagination, start: pagination?.start + 1,  end: pagination?.end + STEP })
    }
    else if( index ) {

    }

    if( typeof index === "undefined" ) return;
    setPagination( { ...pagination, start: index } )
  }

  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  const onCheckChanged = (index: number, prop: keyof Omit<TUsersState, 'id' | 'rol' | 'clientes' | 'nombre'> ) => (checked: boolean) => {
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

  const onClick: ( index: number) => React.MouseEventHandler<React.ComponentRef<typeof Card>> = (index) => () => {
      const user = users?.[index]
      if (!user || !user.id) return

      const { selected } = user
      onCheckChanged(index,'selected')(!selected)
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

  const onOpenChangeById: ( index: number ) => React.MouseEventHandler<React.ComponentRef<typeof DropdownMenuItem>> = ( index ) => (ev) => {
      const user = users?.[index]
      if (!user || !user?.id ) return;
      const { menu } = user

      onOpenChange(!open)
      onCheckChanged(index, 'menu')(!menu)

      ev.stopPropagation()
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
    <_usersContext.Provider value={ [ users, setUsers ] }>
    <_selectUsers.Provider value={users?.filter(({ selected }) => selected)}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
            {!!users?.length && <Badge className="px-3 text-xl">{users?.length}</Badge>}
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
          { users?.length > LENGTH && <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                disabled={ pagination?.start <= 0 }
                onClick={onPagnation({ prev: true })}
                className='delay-0 duration-100'
                variant={"outline"}
              >
                Atras
              </Button>
            </PaginationItem>
            { pagination?.end - STEP > 0 && <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>}
            {Array.from({ length: STEP })?.map( (_, index) => {
              if( pagination?.end + index - STEP > (users?.length - 1)/LENGTH ) return null;
              return <PaginationItem key={index} >
                <Button
                  className='delay-0 duration-100'
                  variant={ pagination?.start === pagination?.end + index - STEP  ? "secondary" : "ghost"}
                  onClick={onPagnation({ index: pagination?.end - STEP + index })}
                >
                  { pagination?.end - STEP + index + 1 }
                </Button>
             </PaginationItem>
            })}
           
            { pagination?.end < (users?.length)/LENGTH && <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem> }

            <PaginationItem >
              <Button
                disabled={pagination?.start >= users?.length/LENGTH - 1}
                className='delay-0 duration-100'
                variant={"outline"} 
                onClick={onPagnation({ next: true })}> Siguiente </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>}
        { !users?.length && <p>{text.notFound}</p>}
        <div className="flex flex-wrap gap-4 [&>*]:flex-auto">
          {!!users?.length && users?.slice( pagination?.start * LENGTH, (pagination?.start + 1) * LENGTH )?.map(
              ({ id, rol, nombre, clientes, selected, active, menu }, index) => (
                <Card
                  key={id}
                  className={clsx(
                    'group max-w-sm cursor-pointer py-4 shadow-lg transition delay-150 duration-500 hover:scale-105'
                  )}
                  onClick={onClick(index + pagination?.start * LENGTH)}
                >
                  <div className="flex items-center justify-end gap-2 px-4">
                    <Dialog open={open} onOpenChange={onOpenChange}>
                      <DropdownMenu
                        open={menu}
                        onOpenChange={onCheckChanged( index + pagination?.start * LENGTH,'menu')}
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
                              onClick={onOpenChangeById(index + pagination?.start * LENGTH)}
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
                              onClick={onOpenChangeById(index + pagination?.start * LENGTH)}
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
                      name={'selected' as keyof typeof users[0]}
                      checked={selected}
                      onCheckedChange={onCheckChanged(index + pagination?.start * LENGTH, 'selected')}
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
                        onCheckedChange={onCheckChanged(index + pagination?.start * LENGTH, 'active')}
                        onClick={onClickStop}
                      >
                        
                      </Switch>
                    )}
                  </CardContent>
                </Card>
              )
            )}
        </div>
      </div>
    </_selectUsers.Provider>
    </_usersContext.Provider>
  )
}

function pendingComponent() {
  return <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton className='w-48 h-8' />
      <Skeleton className='w-8 h-8 rounded-full' />
      <Skeleton className='ms-auto w-24 h-10' />
      <Skeleton className='w-24 h-10' />
    </div>
    <Separator />
    <Skeleton className='w-80 h-10 mx-auto' />
    <div className='flex flex-wrap gap-4'>
      {Array.from( { length: LENGTH } )?.map( (_, index) => 
        <Card key={index} className={clsx("h-full shadow-lg grid justify-streetch items-end")}>
          <CardHeader>
            <Skeleton className='ms-auto w-8 h-8 rounded-md' />
        </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Skeleton className='w-20 h-20 rounded-full' /> 
              <div className='space-y-2'>
                <Skeleton className='w-48 h-6' />
                <Skeleton className='w-32 h-6' />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-2">
            <Skeleton className='w-32 h-6' /> 
          </CardFooter>
        </Card>
        )}
      </div>
  </div>
}

function errorComponent() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    history.back()
  }
  return <div className='flex h-[60vh] [&>svg]:w-32 [&>svg]:stroke-destructive [&>svg]:h-32 items-center justify-center gap-4 text-2xl'>
      <Annoyed  className='animate-bounce' />
      <div className='space-y-2'>
        <h1 className='font-bold'>{text.error}</h1>
        <Separator />
        <Button variant="ghost" onClick={onClick} className='text-sm'> {text.back + "."} </Button>
      </div>
    </div>
}

Users.dispalyname = 'UsersList'

const text = {
  title: 'Usuarios:',
  error: 'Ups!!! ha ocurrido un error inesperado',
  back: 'Intente volver a la pestaña anterior',
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
