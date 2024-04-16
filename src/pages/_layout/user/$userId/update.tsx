import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { Navigate, createFileRoute, defer } from '@tanstack/react-router'
import clsx from 'clsx'
import { ComponentRef, useEffect, useMemo, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { type TUSER_GET, type TUSER_PATCH, getUserById, pathUserById } from '@/api/users'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { type TROLES, getRolByName, listRols } from '@/lib/type/rol'
import { type TUsersState } from '@/pages/_layout/user'
import { Skeleton } from '@/components/ui/skeleton'
import { SpinLoader } from '@/components/ui/loader'
import { queryClient } from '@/pages/__root'
import { useToken } from '@/lib/context/login'
import { Link } from "@tanstack/react-router";

export const updateUserByIdOpt = {
  mutationKey: ["update-user-by-id"],
  mutationFn: pathUserById,
}

export const getUserByIdOpt = ( { userId }: { userId: string }  ) => ({
  queryKey: ["get-user-by-id", { userId }],
  queryFn: () => getUserById({ params: { userId } }),
})

export const Route = createFileRoute('/_layout/user/$userId/update')({
  component: UpdateUserById,
  errorComponent: Error,
  loader: async ( { params } ) =>{
    const data = queryClient.ensureQueryData( queryOptions( getUserByIdOpt(params) ) )
    return ( { user: defer( data ) } )
  } 
})

/* eslint-disable-next-line */
interface TPassowordVisibilityState {
  password?: boolean
  confirmation?: boolean
}

interface TPassowordValueState{
  password?: string
  confirmation?: string
}

/* eslint-disable-next-line */
interface TUpdateUserById {
  user?: TUsersState
}

type TFormName = "firstName" | "lastName" | "rol" | "password" | "newPassword"

/* eslint-disable-next-line */
export function UpdateUserById({}: TUpdateUserById) {
  const [ visibility, setVisibility ] = useState<TPassowordVisibilityState>({})
  const [ password, setPassword ] = useState<TPassowordValueState | undefined>(undefined)
  const form = useRef<HTMLFormElement>(null)
  const { pushNotification } = useNotifications()
  const { open, setOpen } = useStatus()
  const { userId } = Route.useParams()
  const { data: userRes, isSuccess } = useQuery( queryOptions( getUserByIdOpt({ userId }) ) )
  const [ user, setUser ] = useState< (TUSER_GET & { password: string }) | undefined >(undefined)
  const init = useRef(user)
  const { userId: currentUserId } = useToken()

  const onSuccess = ( data: TUSER_PATCH ) => {
    if( !init?.current?.nombre ) return;

    const description = text.notification.decription({
      username: init?.current?.nombre
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: "PATH",
      description,
    })


    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })
    
    queryClient.setQueriesData( { queryKey: getUserByIdOpt({ userId }).queryKey }, data )

    // TODO: not update user with exec a path update
    // setUser( { ...data, password: "" } )
  }

  const onError = () => {
    if( !init?.current?.nombre ) return;

    const description = text.notification.error({
      username: init?.current?.nombre
    })

    const onClick = () => {}

    toast({
      title: text.notification.titile,
      description,
      variant: 'destructive',
      action: (
        <ToastAction altText="action from new user" onClick={onClick}>
            {text.notification.retry}
        </ToastAction>
      ),
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'destructive',
    })
  }

  const {mutate: updateUser, isPending} = useMutation( { ...updateUserByIdOpt, onError, onSuccess } )

  useEffect( () => {
    if(!userRes) return;
    init.current = ({ ...userRes, password: "" })
    setUser({ ...userRes, password: "" })
    return () => {
      // setUser()
    }
  }, [userRes] )

  const active = useMemo( () => Object.values(init?.current ?? {})?.every( ( value, i ) => ( value === Object.values(user ?? {})?.[i] ) ), [user] )

  const onClick: ( prop: keyof TPassowordVisibilityState ) => React.MouseEventHandler< ComponentRef< typeof Button > > = ( prop ) => () => {
    setVisibility( { ...visibility, [ prop ]: !visibility?.[prop]  } )
  }

  const onChangePassword: React.ChangeEventHandler< ComponentRef< typeof Input > > = (ev) => {
    const { name, value } = ev?.target
    if( !name || !value ) return;
    setPassword( { ...password, [ name ]: value  } )
  }

  const onChange:  React.ChangeEventHandler< HTMLFormElement > = (ev) => {
    if( !user ) return;
    const { name, value } = ev.target
    
    if( name === "firstName" as TFormName || name === "lastName" as TFormName  ){
      return;
    }

    setUser( { ...user, [ name ]: value } )
  }

  const onChangeName: ( filed: "firstName" | "lastName" ) => React.ChangeEventHandler< React.ComponentRef< typeof Input > > = (field) => (ev) => {
    if( !user ) return;
    const { value } = ev.target

    if( field === "firstName" ){
      setUser( { ...user, nombre: value + user?.nombre.split(" ")?.[1] } )
    }
    else if ( field === "lastName"  ){
      setUser( { ...user, nombre: user?.nombre.split(" ")?.[0] + value } )
    }

    ev.stopPropagation()
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current || !userId) return;

    const items =  Object.fromEntries( Array.from( new FormData(form.current)?.entries() )?.map( ([ key, value ], i, list) => {
      if( value === "" ) return [ key, undefined ]
      return list?.[i]
    })) as Record<TFormName, string>

    if( items.password !== items.newPassword ) return;

    updateUser({ 
      userId: +userId, 
      params: { 
        rol_id: +items.rol, 
        password: items?.newPassword, 
        nombre: items?.firstName + " " + items?.lastName
    }})
    
    setOpen({ open: !open })
    form.current.reset()
    ev.preventDefault()
  }

  return (
    <>
    {!open && <Navigate to={"../../"} />}
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>{text.descriiption}</DialogDescription>
      </DialogHeader>
      <form
        autoComplete="off"
        ref={form}
        onSubmit={onSubmit}
        onChange={onChange}
        id="update-user"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>:is(label,div)]:space-y-2 [&>*]:col-span-full [&_label>span]:font-bold',
        )}
      >
        <Label className='!col-span-1' >
          <span>{text.form.firstName.label}</span>
            { !isSuccess ? <Skeleton className='w-full h-10' /> :
              <Input
                required
                name={'firstName' as TFormName}
                type="text"
                placeholder={text.form.firstName.placeholder}
                defaultValue={userRes?.nombre.split(" ")?.at(0)}
                onChange={onChangeName("firstName")}
              /> }
        </Label>
        <Label className='!col-span-1' >
          <span>{text.form.lastName.label} </span>
            { !isSuccess ? <Skeleton className='w-full h-10' /> :
              <Input
                required
                name={'lastName' as TFormName}
                type="text"
                placeholder={text.form.lastName.placeholder}
                defaultValue={userRes?.nombre.split(" ")?.at(1)}
                onChange={onChangeName("lastName")}
              />
            }
          </Label>
        <Label>
          <span>{text.form.rol.label} </span>
            { !isSuccess ? <Skeleton className='w-full h-10' /> :
                <Select
                  required
                  name={'rol' as TFormName} 
                  defaultValue={ ""+getRolByName({ rolName: userRes?.rol as TROLES })?.id }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={text.form.rol.placeholder} />
                  </SelectTrigger>
                  <SelectContent className='[&_*]:cursor-pointer'>
                    { listRols()?.map( ({ id, nombre }) => <SelectItem key={id} value={""+id}>{nombre}</SelectItem>) }
                  </SelectContent>
                </Select> }
        </Label>
        <div>
          <Label htmlFor='user-password'>
            <span>{text.form.password.current.label} </span>
          </Label>
              <div className="flex flex-row-reverse items-center gap-x-2">
                { !isSuccess ? <>
                  <Skeleton className='w-10 h-10' />
                  <Skeleton className='w-full h-10' />
                </> : <>
                    <Button
                      type="button"
                      className="w-fit p-1.5"
                      onClick={onClick("password")}
                      variant={!visibility.password ? 'outline' : 'default'}
                    >
                      {!visibility.password ? <Eye /> : <EyeOff />}
                    </Button>
                    <Input
                      id='user-password'
                      name={'password' as TFormName}
                      type={!visibility.password ? "password" : "text"}
                      placeholder={text.form.password.current.placeholder}
                      value={password?.password}
                      onChange={onChangePassword}
                    />
                 </> }
            </div>
        </div>
        <div>
          <Label htmlFor='user-new'>
            <span>{text.form.password.new.label} </span>
          </Label>
          <div className="flex flex-row-reverse items-center gap-x-2">
            { !isSuccess ? <>
              <Skeleton className='w-10 h-10' />
              <Skeleton className='w-full h-10' />
            </> :
              <>
                <Button
                  type="button"
                  className="w-fit p-1.5"
                  onClick={onClick( "confirmation" )}
                  variant={!visibility.confirmation ? 'outline' : 'default'}
                >
                  {!visibility.confirmation ? <Eye /> : <EyeOff />}
                </Button>
                <Input
                  id='user-new'
                  name={'newPassword' as TFormName}
                  required={!!password?.password}
                  type={!visibility.confirmation ? "password" : "text"}
                  placeholder={text.form.password.new.placeholder}
                  value={password?.confirmation}
                  onChange={onChangePassword}
                />
             </> }
          </div>
        </div>
      </form>
      <DialogFooter className="justify-start gap-2">
        { !isSuccess ? <>
          { currentUserId === +userId && <Skeleton className='me-auto w-40 h-12' /> }
          <Skeleton className='w-24 h-12' />
          <Skeleton className='w-24 h-12' />
        </> : <>
            { currentUserId === +userId && 
                <Link 
                  to={"../delete"} 
                  search={{ name: userRes.nombre }}
                  className='me-auto'
                >
                  <Button
                    variant="destructive"
                    form="delete-user"
                    type="submit"
                  >
                      {text.button.delete}
                  </Button>
                </Link> }
            <Button 
              disabled={ active || isPending }
              variant="default" 
              form="update-user" 
              type="submit">
                {text.button.update}
                {isPending  && <SpinLoader />}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="font-bold hover:ring hover:ring-primary"
              >
                {text.button.close}
              </Button>
            </DialogClose>
         </> }
      </DialogFooter>
    </DialogContent>
    </>
  )
}

/* eslint-disable-next-line */
export function Error() {
  useEffect( () => {
    toast({
      title: text.error.title,
      description: <div className='flex flex-row gap-2 items-center'>
      <h2 className='font-bold text-2xl'>:&nbsp;(</h2>
      <p className='text-md'>  {text.error.descriiption} </p> 
    </div>,
      variant: 'destructive',
    })
  }, [] )
  return ;
}

UpdateUserById.dispalyname = 'UpdateUserById'
Error.dispalyname = 'UpdateUserByIdError'

const text = {
  title: 'Actualizar Usuario:',
  error: {
    title: "Obtencion de datos de usuario",
    descriiption: "Ha ocurrido un error inesperado"
  },
  descriiption:
    'Modifique los campos para actualizar los datos del usuario en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    delete: 'Si, eliminar mi usuario.',
  },
  notification: {
    titile: 'Actualizacion de usuario',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizacion el usuario ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      "La actualizacion del usuario" + username + "ha fallado",
    retry: 'Reintentar',
  },
  form: {
    firstName: {
      label: 'Nombre:',
      placeholder: 'Escriba el nombre del usuario',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido del usuario',
    },
    password: {
      current: {
        label: 'Nueva contraseña:',
        placeholder: 'Escriba la cantraseña actual del usuario',
      },
      new: {
        label: 'Confirmar contraseña:',
        placeholder: 'Escriba la nuva cantraseña del usuario',
      }
    },
    rol: {
      label: 'Tipo de rol:',
      placeholder: 'Seleccione el rol del usuario',
      items: {
        user: "Usuario",
        admin: "Administrador",
        client: "Cliente",
      }
    },
  },
}
