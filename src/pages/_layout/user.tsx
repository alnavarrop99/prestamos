import { type TUserResponse, getUsers } from '@/api/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import styles from "@/styles/global.module.css";
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {  MoreHorizontal, UserCog2, UserX2, Users } from 'lucide-react';
import { useRootStatus } from '@/lib/context/layout';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

export const Route = createFileRoute('/_layout/user')({
  component: User,
  loader: getUsers
})

interface TUserProps {
  open?: boolean
  users?: TUserResponse[]
}
export function User({children, open: _open=false, users: _users=[] as TUserResponse[] }: React.PropsWithChildren<TUserProps>) {
  const usersDB = (Route.useLoaderData()  ?? _users).map( (items) => ({...items, selected: false }))
  const [users, setUsers] = useState( usersDB )
  const { value } = useRootStatus()

  const onCheckChanged = ( { id: index, prop }: { id: number, prop: keyof typeof users[0] } ) => ( checked: boolean ) => {
    const list = users.map( ( { ...user } ) => {
      const { id, ...items } = user
      if( id === index && prop === "selected" ){
        return { id, ...items, selected: checked }
      } 
      else if( id === index && prop === "active" ){
        return { id, ...items, active: checked }
      } 

      return user
    }  )
    setUsers(list)
  }

  useEffect(() => {
    setUsers( usersDB.filter(( { nombre } ) => nombre.includes(value ?? "")) ) 
  }, [value])

  return (
    <div className='space-y-4'>
      <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <Badge className="px-3 text-xl">
            {usersDB.length}
          </Badge>
          <Dialog open={_open}>
            <DialogTrigger asChild className='ms-auto'>
              <Link to={'./new'}>
                <Button className='ms-auto'>{text.button.create}</Button>
              </Link>
            </DialogTrigger>
            {children ?? <Outlet />}
          </Dialog>
          <Button disabled={!users.some(({ selected }) => selected )} className={clsx({"bg-destructive": users.some(({ selected }) => selected )})}>{text.button.delete}</Button>
        </div>
      <div className='flex flex-wrap gap-4 [&>*]:flex-auto'>
      { users?.map( ({id, rol, nombre: name, clientes: clients, selected, active }) =>
          <Card key={id} className={clsx("group shadow-lg max-w-sm z-0 py-4 cursor-pointer", styles?.["scale-users"])}>
            <div className='gap-2 flex items-center justify-end px-4'>
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{text.menu.aria}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-56 [&>*:not(:is([role=separator],:first-child))]:h-16 [&>*]:flex [&>*]:cursor-pointer [&>*]:justify-between [&>*]:gap-2"
              >
                <DropdownMenuLabel className="text-md">
                  {text.menu.title}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {text.menu.client} <Users />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {text.menu.update} <UserCog2 />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {text.menu.delete} <UserX2 />
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
                  <Switch checked={active} onCheckedChange={onCheckChanged({id, prop: "active"})} > </Switch>
              </CardContent>
            </Card>
      ) }
      </div>
      
    </div>
  )
}

User.dispalyname = 'User'
export type TRole = "Administrador" | "Cliente" | "Usuario"

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


