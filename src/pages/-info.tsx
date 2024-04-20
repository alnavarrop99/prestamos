import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import clsx from 'clsx'
import { ComponentRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { type TUSER_GET } from '@/api/users'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { type TROLES, getRolByName, listRols } from '@/lib/type/rol'
import { Skeleton } from '@/components/ui/skeleton'
import { SpinLoader } from '@/components/ui/loader'
import { Link } from '@tanstack/react-router'
import { getCurrentUserOpt } from '@/pages/_layout'
import { updateUserByIdOpt } from '@/pages/_layout/user/$userId/update'
import { useToken } from '@/lib/context/login'

/* eslint-disable-next-line */
interface TPassowordVisibilityState {
  password?: boolean
  confirmation?: boolean
}

interface TPassowordValueState {
  password?: string
  confirmation?: string
}

type TFormName = 'firstName' | 'lastName' | 'rol' | 'password' | 'newPassword'

/* eslint-disable-next-line */
export const MyUserInfo = memo(function () {
  const [visibility, setVisibility] = useState<TPassowordVisibilityState>({})
  const [password, setPassword] = useState<TPassowordValueState | undefined>(
    undefined
  )
  const form = useRef<HTMLFormElement>(null)
  const { pushNotification } = useNotifications()
  const { open, setOpen } = useStatus()
  const { data: userRes, isSuccess } = useQuery(queryOptions(getCurrentUserOpt))
  const [user, setUser] = useState<
    (TUSER_GET & { password: string }) | undefined
  >(undefined)
  const { rol, userId } = useToken()
  const init = useRef(user)

  const onSuccess = () => {
    if (!init?.current?.nombre) return

    const description = text.notification.decription({
      username: init?.current?.nombre,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: 'PATH',
      description,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })
  }

  const onError = () => {
    if (!init?.current?.nombre) return

    const description = text.notification.error({
      username: init?.current?.nombre,
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

  const { mutate: updateUser, isPending } = useMutation({
    ...updateUserByIdOpt,
    onError,
    onSuccess,
  })

  useEffect(() => {
    if (!userRes) return
    init.current = { ...userRes, password: '' }
    setUser({ ...userRes, password: '' })
    return () => {
      // setUser()
    }
  }, [userRes])

  const active = useMemo(
    () =>
      Object.values(init?.current ?? {})?.every(
        (value, i) => value === Object.values(user ?? {})?.[i]
      ),
    [user]
  )

  const onClick: (
    prop: keyof TPassowordVisibilityState
  ) => React.MouseEventHandler<ComponentRef<typeof Button>> = (prop) => () => {
    setVisibility({ ...visibility, [prop]: !visibility?.[prop] })
  }

  const onChangePassword: React.ChangeEventHandler<
    ComponentRef<typeof Input>
  > = (ev) => {
    const name = ev?.target.name
    const value = ev.target.value
    if (!name || !value) return
    setPassword({ ...password, [name]: value })
  }

  const onChange: React.ChangeEventHandler<HTMLFormElement> = (ev) => {
    if (!user) return
    const { name, value } = ev.target

    if (
      name === ('firstName' as TFormName) ||
      name === ('lastName' as TFormName)
    ) {
      return
    }

    setUser({ ...user, [name]: value })
  }

  const onChangeName: (
    filed: 'firstName' | 'lastName'
  ) => React.ChangeEventHandler<React.ComponentRef<typeof Input>> =
    (field) => (ev) => {
      if (!user) return
      const { value } = ev.target

      if (field === 'firstName') {
        setUser({ ...user, nombre: value + user?.nombre.split(' ')?.[1] })
      } else if (field === 'lastName') {
        setUser({ ...user, nombre: user?.nombre.split(' ')?.[0] + value })
      }

      ev.stopPropagation()
    }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current || !userId) return

    const items = Object.fromEntries(
      Array.from(new FormData(form.current)?.entries())?.map(
        ([key, value], i, list) => {
          if (value === '') return [key, undefined]
          return list?.[i]
        }
      )
    ) as Record<TFormName, string>

    if (items.password !== items.newPassword) return

    updateUser({
      userId: userId,
      params: {
        rol_id: +items.rol,
        password: items?.newPassword,
        nombre: items?.firstName + ' ' + items?.lastName,
      },
    })

    setOpen({ open: !open })
    form.current.reset()
    ev.preventDefault()
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-start text-xl md:text-2xl">
          {text.title}
        </DialogTitle>
        <Separator />
        <DialogDescription className="text-start text-xs text-muted-foreground md:text-base">
          {text.descriiption}
        </DialogDescription>
      </DialogHeader>
      <form
        autoFocus={false}
        autoComplete="off"
        ref={form}
        onSubmit={onSubmit}
        onChange={onChange}
        id="user-info"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-none gap-3 gap-y-4 px-1 md:grid-cols-2 [&>*]:col-span-full [&>:is(label,div)]:space-y-2 [&_label>span]:font-bold',
          {
            '[&_*:disabled]:opacity-100':
              !!userId && rol?.rolName !== 'Administrador',
          }
        )}
      >
        <Label className="!col-span-1">
          <span>{text.form.firstName.label}</span>
          {!isSuccess ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              required
              name={'firstName' as TFormName}
              type="text"
              placeholder={text.form.firstName.placeholder}
              defaultValue={userRes?.nombre.split(' ')?.at(0)}
              onChange={onChangeName('firstName')}
              disabled={!!userId && rol?.rolName !== 'Administrador'}
              pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
            />
          )}
        </Label>
        <Label className="!col-span-1">
          <span>{text.form.lastName.label} </span>
          {!isSuccess ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              required
              name={'lastName' as TFormName}
              type="text"
              placeholder={text.form.lastName.placeholder}
              defaultValue={userRes?.nombre.split(' ')?.at(1)}
              onChange={onChangeName('lastName')}
              disabled={!!userId && rol?.rolName !== 'Administrador'}
              pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
            />
          )}
        </Label>
        <Label>
          <span>{text.form.rol.label} </span>
          {!isSuccess ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              required
              name={'rol' as TFormName}
              defaultValue={
                '' + getRolByName({ rolName: userRes?.rol as TROLES })?.id
              }
              disabled={!!userId && rol?.rolName !== 'Administrador'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={text.form.rol.placeholder} />
              </SelectTrigger>
              <SelectContent className="[&_*]:cursor-pointer">
                {listRols()?.map(({ id, nombre }) => (
                  <SelectItem key={id} value={'' + id}>
                    {nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Label>
        <div>
          <Label htmlFor="user-password">
            <span>{text.form.password.current.label} </span>
          </Label>
          <div className="flex flex-row-reverse items-center gap-x-2">
            {!isSuccess ? (
              <>
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="w-fit p-1.5"
                  onClick={onClick('password')}
                  variant={!visibility.password ? 'outline' : 'default'}
                >
                  {!visibility.password ? <Eye /> : <EyeOff />}
                </Button>
                <Input
                  id="user-password"
                  name={'password' as TFormName}
                  type={!visibility.password ? 'password' : 'text'}
                  placeholder={text.form.password.current.placeholder}
                  defaultValue={password?.password}
                  onChange={onChangePassword}
                  pattern="^.{6,}$"
                />
              </>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="user-new">
            <span>{text.form.password.new.label} </span>
          </Label>
          <div className="flex flex-row-reverse items-center gap-x-2">
            {!isSuccess ? (
              <>
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="w-fit p-1.5"
                  onClick={onClick('confirmation')}
                  variant={!visibility.confirmation ? 'outline' : 'default'}
                >
                  {!visibility.confirmation ? <Eye /> : <EyeOff />}
                </Button>
                <Input
                  id="user-new"
                  name={'newPassword' as TFormName}
                  required={!!password?.password}
                  type={!visibility.confirmation ? 'password' : 'text'}
                  placeholder={text.form.password.new.placeholder}
                  defaultValue={password?.confirmation}
                  onChange={onChangePassword}
                  pattern={password?.password}
                />
              </>
            )}
          </div>
        </div>
      </form>
      <DialogFooter className="flex-col justify-start gap-2 gap-2 md:flex-row">
        {!isSuccess ? (
          <>
            <Skeleton className="me-auto h-12 w-40" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
          </>
        ) : (
          <>
            {!!userId && rol?.rolName === 'Administrador' && (
              <Link
                to={'/user/$userId/delete'}
                params={{ userId }}
                search={{ name: userRes.nombre }}
                className="me-auto"
              >
                <Button variant="destructive" form="delete-user" type="submit">
                  {text.button.delete}
                </Button>
              </Link>
            )}
            <Button
              disabled={active || isPending}
              variant="default"
              form="user-info"
              type="submit"
            >
              {text.button.update}
              {isPending && <SpinLoader />}
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
          </>
        )}
      </DialogFooter>
    </DialogContent>
  )
})

MyUserInfo.displayName = 'UpdateMyUser'

const text = {
  title: 'Actualizar Usuario:',
  error: {
    title: 'Obtencion de datos de usuario',
    descriiption: 'Ha ocurrido un error inesperado',
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
      'La actualizacion del usuario' + username + 'ha fallado',
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
      },
    },
    rol: {
      label: 'Tipo de rol:',
      placeholder: 'Seleccione el rol del usuario',
      items: {
        user: 'Usuario',
        admin: 'Administrador',
        client: 'Cliente',
      },
    },
  },
}
