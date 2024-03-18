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
import styles from '@/styles/global.module.css'
import { useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export const Route = createFileRoute('/_layout/user/new')({
  component: NewUser,
})

/* eslint-disable-next-line */
interface TPassoword {
  password?: boolean
  confirmation?: boolean
}

/* eslint-disable-next-line */
interface TNewUserProps { }

/* eslint-disable-next-line */
export function NewUser() {
  const [ passItems, setPassword ] = useState<TPassoword>({  })
  const form = useRef<HTMLFormElement>(null)


  const onClick: ( {prop}:{ prop: keyof TPassoword } ) => React.MouseEventHandler< React.ComponentRef< typeof Button > > = ( { prop } ) => () => {
    setPassword( { ...passItems, [ prop ]: !passItems?.[prop]  } )
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof (typeof text.form & typeof text.form.password), string>

    const action =
      ({ ...props }: Record<keyof (typeof text.form & typeof text.form.password), string>) =>
      () => {
        console.table(props)
      }


    const timer = setTimeout(action(items), 6 * 1000)

    const onClick = () => {
      clearTimeout(timer)
    }

    if ( true) {
      const { firstName, lastName } = items
      toast({
        title: text.notification.titile,
        description: text.notification.decription({
          username: firstName + ' ' + lastName,
        }),
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

  const { password, confirmation } = passItems

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
        id="new-client-form"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>:is(label,div)]:space-y-2 [&>*]:col-span-full',
          styles?.['custom-form']
        )}
      >
        <Label className='!col-span-1' >
          <span>{text.form.firstName.label}</span>{' '}
          <Input
            required
            name={'firstName' as keyof typeof text.form}
            type="text"
            placeholder={text.form.firstName.placeholder}
          />
        </Label>
        <Label className='!col-span-1'>
          <span>{text.form.lastName.label} </span>
          <Input
            required
            name={'lastName' as keyof typeof text.form}
            type="text"
            placeholder={text.form.lastName.placeholder}
          />
        </Label>
        <Label>
          <span className="after:content-['_*_'] after:text-red-500">{text.form.rol.label} </span>
          <Select required name={'rol' as keyof typeof text.form} defaultValue={text.form.rol.items.user}>
            <SelectTrigger className="w-full border border-primary">
              <SelectValue placeholder={text.form.rol.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              <SelectItem value={text.form.rol.items.admin}>{text.form.rol.items.admin}</SelectItem>
              <SelectItem value={text.form.rol.items.user}>{text.form.rol.items.user}</SelectItem>
            </SelectContent>
          </Select>
        </Label>

        <div className='[&>label]:after:content-["_*_"] [&>label]:after:text-red-500'>
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
              required
              name={'password' as keyof typeof text.form.password}
              type={!password ? "password" : "text"}
              placeholder={text.form.password.current.placeholder}
            />
          </div>
        </div>

        <div className='[&>label]:after:content-["_*_"] [&>label]:after:text-red-500'>
          <Label htmlFor='user-confirmation'>
            <span>{text.form.password.confirmation.label} </span>
          </Label>
          <div className="flex flex-row-reverse items-center gap-x-2">
            <Button
              type="button"
              className="w-fit p-1.5"
              onClick={onClick({ prop: "confirmation" })}
              variant={!confirmation ? 'outline' : 'default'}
            >
              {!confirmation ? <Eye /> : <EyeOff />}
            </Button>
            <Input
              id='user-confirmation'
              required
              name={'confirmation' as keyof typeof text.form.password}
              type={!confirmation ? "password" : "text"}
              placeholder={text.form.password.confirmation.placeholder}
            />
          </div>
        </div>
        
      </form>
      <DialogFooter className="justify-end">
        <Button variant="default" form="new-client-form" type="submit">
          {text.button.update}
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="font-bold hover:ring-1 hover:ring-primary"
          >
            {text.button.close}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
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
    error: 'Error: la creacion de usuario ha fallado',
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
        label: 'Contraseña:',
        placeholder: 'Escriba la cantraseña del usuario',
      },
      confirmation: {
        label: 'Confirmacion:',
        placeholder: 'Confirme la cantraseña anterior',
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



