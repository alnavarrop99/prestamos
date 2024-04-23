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
import { Navigate, createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'
import styles from '@/styles/global.module.css'
import { useRef, useState } from 'react'
import { Eye as PassOn, EyeOff as PassOff } from 'lucide-react'
import { useNotifications } from '@/lib/context/notification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  type TUSER_GET,
  type TUSER_POST_BODY,
  postUser,
  TUSER_GET_ALL,
} from '@/api/users'
import { getRolByName, listRols } from '@/lib/type/rol'
import { useStatus } from '@/lib/context/layout'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getUsersListOpt } from '../user'

export const postUserOpt = {
  mutationKey: ['create-user'],
  mutationFn: postUser,
}

export const Route = createFileRoute('/_layout/user/new')({
  component: NewUser,
})

/* eslint-disable-next-line */
interface TPassoword {
  password?: boolean
  confirmation?: boolean
}

/* eslint-disable-next-line */
type TFormName = 'firstName' | 'lastName' | 'rol' | 'password' | 'confirmation'

/* eslint-disable-next-line */
export function NewUser() {
  const [visibility, setVisibility] = useState<TPassoword>({})
  const [password, setPassword] = useState<string | undefined>(undefined)
  const form = useRef<HTMLFormElement>(null)
  const { pushNotification } = useNotifications()
  const { open } = useStatus()
  const qClient = useQueryClient()

  const onChange: React.ChangeEventHandler<React.ComponentRef<typeof Input>> = (
    ev
  ) => {
    setPassword(ev.target?.value)
  }

  const onSuccess: (
    data: TUSER_GET,
    variables: TUSER_POST_BODY,
    context: unknown
  ) => unknown = (newData, items) => {
    const description = text.notification.decription({
      username: items?.nombre,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: 'POST',
      description,
    })

    const update: (data: TUSER_GET_ALL) => TUSER_GET_ALL = (data) => {
      return [...data, newData]
    }

    qClient?.setQueryData(getUsersListOpt?.queryKey, update)
  }

  const onError: (
    error: Error,
    variables: TUSER_POST_BODY,
    context: unknown
  ) => unknown = (_, items) => {
    const description = text.notification.error({
      username: items?.nombre,
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
  }

  const { mutate: createUser } = useMutation({
    ...postUserOpt,
    onSuccess,
    onError,
  })

  const onClick: (
    prop: keyof TPassoword
  ) => React.MouseEventHandler<React.ComponentRef<typeof Button>> =
    (prop) => () => {
      setVisibility({ ...visibility, [prop]: !visibility?.[prop] })
    }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      Array.from(new FormData(form.current).entries())?.map(([key, value]) => {
        if (value === '') return [key, undefined]
        return [key, value]
      })
    ) as Record<TFormName, string>

    createUser({
      nombre: items?.firstName + ' ' + items?.lastName,
      password: items?.password,
      rol_id: +items?.rol,
    })

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <>
      {!open && <Navigate to={'../'} replace />}
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
        <ScrollArea className="h-[60dvh] overflow-y-auto md:h-full">
          <ScrollBar orientation="vertical" />
          <form
            autoFocus={false}
            autoComplete="off"
            ref={form}
            onSubmit={onSubmit}
            id="new-client-form"
            className={clsx(
              'grid-rows-subgrid grid grid-cols-none gap-3 gap-y-4 p-1 md:grid-cols-2 [&>*]:col-span-full [&>:is(label,div)]:space-y-2',
              styles?.['custom-form']
            )}
          >
            <Label className="!col-span-1">
              <span>{text.form.firstName.label}</span>
              <Input
                required
                name={'firstName' as TFormName}
                type="text"
                placeholder={text.form.firstName.placeholder}
                pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
              />
            </Label>
            <Label className="!col-span-1">
              <span>{text.form.lastName.label} </span>
              <Input
                required
                name={'lastName' as TFormName}
                type="text"
                placeholder={text.form.lastName.placeholder}
                pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
              />
            </Label>
            <Label>
              <span className="after:text-red-500 after:content-['_*_']">
                {text.form.rol.label}{' '}
              </span>
              <Select
                required
                name={'rol' as TFormName}
                defaultValue={
                  '' + getRolByName({ rolName: 'Administrador' })?.id
                }
              >
                <SelectTrigger className="!border-1 w-full !border-ring">
                  <SelectValue placeholder={text.form.rol.placeholder} />
                </SelectTrigger>
                <SelectContent className="[&_*]:cursor-pointer">
                  {listRols()?.map(({ nombre, id }, index) => (
                    <SelectItem key={index} value={'' + id}>
                      {nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>
            <div className='[&>label]:after:text-red-500 [&>label]:after:content-["_*_"]'>
              <Label htmlFor="user-password">
                <span>{text.form.password.current.label} </span>
              </Label>
              <div className="flex flex-row-reverse items-center gap-x-2">
                <Button
                  type="button"
                  className="w-fit p-1.5"
                  onClick={onClick('password')}
                  variant={!visibility.password ? 'outline' : 'default'}
                >
                  {!visibility.password ? <PassOn /> : <PassOff />}
                </Button>
                <Input
                  id="user-password"
                  required
                  name={'password' as TFormName}
                  type={!visibility.password ? 'password' : 'text'}
                  placeholder={text.form.password.current.placeholder}
                  onChange={onChange}
                  pattern="^.{6,}$"
                />
              </div>
            </div>
            <div className='[&>label]:after:text-red-500 [&>label]:after:content-["_*_"]'>
              <Label htmlFor="user-confirmation">
                <span>{text.form.password.confirmation.label} </span>
              </Label>
              <div className="flex flex-row-reverse items-center gap-x-2">
                <Button
                  type="button"
                  className="w-fit p-1.5"
                  onClick={onClick('confirmation')}
                  variant={!visibility?.confirmation ? 'outline' : 'default'}
                >
                  {!visibility?.confirmation ? <PassOn /> : <PassOff />}
                </Button>
                <Input
                  id="user-confirmation"
                  required
                  name={'confirmation' as TFormName}
                  type={!visibility?.confirmation ? 'password' : 'text'}
                  placeholder={text.form.password.confirmation.placeholder}
                  pattern={password}
                />
              </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="flex-col justify-end gap-2 md:flex-row">
          <Button variant="default" form="new-client-form" type="submit">
            {text.button.update}
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
        </DialogFooter>
      </DialogContent>
    </>
  )
}

NewUser.dispalyname = 'NewUser'

const text = {
  title: 'Crear Usuario:',
  descriiption:
    'Introdusca los datos correctamente para la creacion de un usuario nuevo en la plataforma',
  button: {
    close: 'Cerrar',
    update: 'Crear',
  },
  notification: {
    titile: 'Creacion de un nuevos usuario',
    decription: ({ username }: { username: string }) =>
      'Se ha creado el usuario ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La creacion del usuario' + username + 'ha fallado',
    retry: 'Deshacer',
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
        label: 'Contraseña:',
        placeholder: 'Escriba la cantraseña del usuario',
      },
      confirmation: {
        label: 'Confirmacion:',
        placeholder: 'Confirme la cantraseña anterior',
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
