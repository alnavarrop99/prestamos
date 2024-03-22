import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'
import { ComponentRef, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { type TUser, getUserIdRes } from '@/api/users'
import { useClientStatus } from '@/lib/context/client'
import { useNotifications } from '@/lib/context/notification'

export const Route = createFileRoute('/_layout/user/$userId/update')({
  component: UpdateUserById,
  loader: getUserIdRes
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
  user?: TUser
}

/* eslint-disable-next-line */
export function UpdateUserById({ user: _user = {} as TUser }: TUpdateUserById) {
  const [ visibility, setVisibility ] = useState<TPassowordVisibilityState>({})
  const [ password, setPassword ] = useState<TPassowordValueState | undefined>(undefined)
  const form = useRef<HTMLFormElement>(null)
  const { rol, nombre } = Route.useLoaderData() ?? _user
  const { setNotification } = useNotifications()
  const { open, setStatus } = useClientStatus()

  const onClick: ( {prop}:{ prop: keyof TPassowordVisibilityState } ) => React.MouseEventHandler< ComponentRef< typeof Button > > = ( { prop } ) => () => {
    setVisibility( { ...visibility, [ prop ]: !visibility?.[prop]  } )
  }

  const onChange: React.ChangeEventHandler< ComponentRef< typeof Input > > = (ev) => {
    const { name, value } = ev?.target
    setPassword( { ...password, [ name ]: value  } )
    console.log( { [ name ]: value  } )
  }


  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return;

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof TUser | "firstName" | "lastName", string>

    const { firstName, lastName } = items
    const description = text.notification.decription({
      username: firstName + ' ' + lastName,
    })

    const action =
      ({ ...props }: Record<string, string>) =>
      () => {
        console.table(props)
        setNotification({
          notification: {
            date: new Date(),
            action: "PATH",
            description,
          }
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setStatus({ open: !open })

    const onClick = () => {
      clearTimeout(timer)
    }

    if (true) {
      toast({
        title: text.notification.titile,
        description,
        variant: 'default',
        action: (
          <ToastAction altText="action from new user">
            <Button variant="default" onClick={onClick}>
              {text.notification.undo}
            </Button>
          </ToastAction>
        ),
      })
    }

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>{text.descriiption}</DialogDescription>
      </DialogHeader>
      <form
        autoComplete="on"
        ref={form}
        onSubmit={onSubmit}
        id="update-user"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>:is(label,div)]:space-y-2 [&>*]:col-span-full [&_label>span]:font-bold',
        )}
      >
        <Label className='!col-span-1' >
          <span>{text.form.firstName.label}</span>{' '}
          <Input
            required
            name={'firstName' as keyof typeof text.form}
            type="text"
            placeholder={text.form.firstName.placeholder}
            defaultValue={nombre.split(" ")?.at(0)}
          />
        </Label>
        <Label className='!col-span-1' >
          <span>{text.form.lastName.label} </span>
          <Input
            required
            name={'lastName'}
            type="text"
            placeholder={text.form.lastName.placeholder}
            defaultValue={nombre.split(" ")?.at(1)}
          />
        </Label>
        <Label>
          <span>{text.form.rol.label} </span>
          <Select required name={'rol' as keyof TUser} defaultValue={rol}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={text.form.rol.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              <SelectItem value={text.form.rol.items.admin}>{text.form.rol.items.admin}</SelectItem>
              <SelectItem value={text.form.rol.items.user}>{text.form.rol.items.user}</SelectItem>
            </SelectContent>
          </Select>
        </Label>
        <div>
          <Label htmlFor='user-password'>
            <span>{text.form.password.current.label} </span>
          </Label>
          <div className="flex flex-row-reverse items-center gap-x-2">
            <Button
              type="button"
              className="w-fit p-1.5"
              onClick={onClick({ prop: "password" })}
              variant={!password ? 'outline' : 'default'}
            >
              {!password ? <Eye /> : <EyeOff />}
            </Button>
            <Input
              id='user-password'
              name={'password'}
              type={!password ? "password" : "text"}
              placeholder={text.form.password.current.placeholder}
              value={password?.password}
              onChange={onChange}
            />
          </div>
        </div>
        <div>
          <Label htmlFor='user-new'>
            <span>{text.form.password.new.label} </span>
          </Label>
          <div className="flex flex-row-reverse items-center gap-x-2">
            <Button
              type="button"
              className="w-fit p-1.5"
              onClick={onClick({ prop: "confirmation" })}
              variant={!visibility.confirmation ? 'outline' : 'default'}
            >
              {!visibility.confirmation ? <Eye /> : <EyeOff />}
            </Button>
            <Input
              id='user-new'
              name={'new'}
              required={!!password?.password}
              type={!visibility.confirmation ? "password" : "text"}
              placeholder={text.form.password.new.placeholder}
              value={password?.confirmation}
              onChange={onChange}
            />
          </div>
        </div>
      </form>
      <DialogFooter className="justify-end">
        <Button 
          variant="default" 
          form="update-user" 
          type="submit">
            {text.button.update}
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="font-bold hover:ring hover:ring-primary"
          >
            {text.button.close}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

UpdateUserById.dispalyname = 'UpdateUserById'

const text = {
  title: 'Actualizar Usuario:',
  descriiption:
    'Modifique los campos para actualizar los datos del usuario en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
  },
  notification: {
    titile: 'Actualizacion de usuario',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizacion el usuario ' + username + ' con exito.',
    error: 'Error: la actualizacion del usuario ha fallado',
    undo: 'Deshacer',
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
        label: 'Contraseña actual:',
        placeholder: 'Escriba la cantraseña actual del usuario',
      },
      new: {
        label: 'Nueva contraseña:',
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

