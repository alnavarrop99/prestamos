import { type TUser, getUsersRes } from '@/api/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link, Navigate, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import styles from "@/styles/global.module.css";
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { createContext, useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserCog as UserUpdate, UserX as UserDelete, Users as UsersList } from 'lucide-react';
import { useRootStatus } from '@/lib/context/layout';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useClientStatus } from '@/lib/context/client';

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
  selected: boolean;
  menu: boolean;
  active: boolean;
}

/* eslint-disable-next-line */
export type TRole = "Administrador" | "Cliente" | "Usuario"

export const _selectUsers = createContext<TUsersState[] | undefined>(undefined)

/* eslint-disable-next-line */
export function Users({children, open: _open, users: _users=[] as TUser[] }: React.PropsWithChildren<TUsersProps>) {
  const _usersDB = (Route.useLoaderData()  ?? _users)
  const usersDB = _usersDB.map<TUsersState>( (items) => ({...items, selected: false, menu: false }))
  const [users, setUsers] = useState<TUsersState[]>( usersDB )
  const navigate = useNavigate()
  const { value } = useRootStatus()
  const { open, setStatus } = useClientStatus( ({ open, setStatus }) => ({ open: open ?? _open, setStatus  }) ) 

  const onCheckChanged = ( { id: index, prop }: { id: number, prop: keyof Omit<typeof users[0], "id" | "rol" | "clientes" | "nombre"> } ) => ( checked: boolean ) => {
    const list = users.map( ( { ...user } ) => {
      const { id, ...items } = user
      if( id === index && prop === "selected" ){
        return { id, ...items, selected: checked }
      } 
      else if( id === index && prop === "active" ){
        return { id, ...items, active: checked }
      } 
      else if( id === index && prop === "menu" ){
        return { id, ...items, menu: checked }
      } 
      return user
    }  )
    setUsers(list)
  }

  const onClick: ({ id }: {id: number}) => React.MouseEventHandler< React.ComponentRef < typeof Card > > = ({id}) => () => {
    const user = users?.find( ({ id: userId }) => id === userId  )
    if(!user) return;

    const { selected } = user
    onCheckChanged( { id, prop: "selected" } )( !selected )
  }

  const onClickStop: React.MouseEventHandler = (ev) => {
    ev.stopPropagation()
  }

  const onOpenChange = ( open: boolean ) => {
    if (!open) {
      !children && navigate({ to: './' })
    }
    setStatus({ open })
  }

  const onOpenLink: ({id}: {id: number}) => React.MouseEventHandler< React.ComponentRef< typeof Link > > = ({id}) => (ev) => {
    ev.stopPropagation()

    const user = users.find( ({ id: userId }) => id === userId )
    if( !user ) return;
    const { menu } = user

    onOpenChange( !open )
    onCheckChanged({id, prop: "menu"})( !menu )
  }

  const onDeleteUsers: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    setStatus({open: !open})
  }

  useEffect(() => {
    setUsers( usersDB.filter(( { nombre } ) => nombre.toLowerCase().includes(value?.toLowerCase() ?? "")) ) 
  }, [value])

  return (
    <_selectUsers.Provider value={users.filter( ({ selected }) => selected  )}>
    {!children && < Navigate to={"/user"} />}
    <div className='space-y-4'>
      <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <Badge className="px-3 text-xl">
            {users.length}
          </Badge>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild className='ms-auto'>
              <Link to={'./new'}>
                <Button className='ms-auto'>{text.button.create}</Button>
              </Link>
            </DialogTrigger>
            {children ?? <Outlet />}
          </Dialog>
        <Link to={"./delete"} disabled={!users.some(({ selected }) => selected )} >
          <Button disabled={!users.some(({ selected }) => selected )} className={clsx({"bg-destructive": users.some(({ selected }) => selected )})} onClick={onDeleteUsers}>{text.button.delete}</Button>
          </Link>
        </div>
      <div className='flex flex-wrap gap-4 [&>*]:flex-auto'>
      { users?.map( ({id, rol, nombre: name, clientes: clients, selected, active, menu }) =>
          <Card key={id} className={clsx("group shadow-lg max-w-sm py-4 cursor-pointer", styles?.["scale-users"])} onClick={onClick({id})}>
            <div className='gap-2 flex items-center justify-end px-4'>
            <DropdownMenu open={menu} onOpenChange={onCheckChanged({ id, prop: "menu" })}  >
              <DropdownMenuTrigger asChild onClick={onClickStop}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{text.menu.aria}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onClick={onClickStop}
                align="center"
                className="w-56 [&>*:not(:is([role=separator],:first-child))]:h-16 [&>*]:flex [&>*]:cursor-pointer [&>*]:justify-between [&>*]:gap-2"
              >
                <DropdownMenuLabel className="text-md">
                  {text.menu.title}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  {text.menu.client} <UsersList />
                </DropdownMenuItem>
                <DropdownMenuItem  >
                  <Link
                      onClick={onOpenLink({ id })}
                      className="flex h-full w-full items-center justify-between gap-2"
                      to={"./$userId/update"}
                      params={{ userId: id }} >
                    {text.menu.update} <UserUpdate />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem  >
                  <Link
                    onClick={onOpenLink({ id })}
                    className="flex h-full w-full items-center justify-between gap-2"
                    to={"./$userId/delete"} 
                    params={{ userId: id }}>
                    {text.menu.delete} <UserDelete />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
              <Checkbox name={"selected" as keyof typeof users[0]} checked={selected} onCheckedChange={onCheckChanged({id, prop: "selected"})} />
            </div>
              <CardHeader>
                 <CardTitle className='flex items-center gap-2'>
                  <Avatar className='grid place-items-center w-16 h-16 border border-primary '> 
                    <AvatarFallback className='uppercase text-2xl'>
                      {name.split(" ").map( val => val.at(0) ).join("")}
                    </AvatarFallback>
                  </Avatar>
                    {name}
                </CardTitle>
              </CardHeader>
              <CardContent className='[&>*]:flex [&>*]:items-center [&>*]:gap-2 [&>*]:cursor-pointer flex justify-between'>
                  <Badge className={clsx("hover:bg-[auto]",{
                    "bg-red-500": rol === "Administrador" as TRole,
                    "bg-blue-500": rol === "Cliente" as TRole,
                    "bg-green-500": rol === "Usuario" as TRole,
                  })}> {rol} </Badge>
                  <Switch checked={active} onCheckedChange={onCheckChanged({id, prop: "active"})} onClick={onClickStop}> </Switch>
              </CardContent>
            </Card>
      ) }
      </div>
      
    </div>
    </_selectUsers.Provider>
  )
}

Users.dispalyname = 'UsersList'

const text = {
  title: 'Usuarios:',
  button: {
    create: "Nuevo",
    delete: "Eliminar",
    deactivate: "Desactivar",
  },
  menu: {
    aria: 'Mas Opciones',
    title: 'Acciones:',
    client: "Ver clientes disponibles",
    update: 'Actualizar datos del usuario',
    delete: 'Eliminar usuario',
  },
}


