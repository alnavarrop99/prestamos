import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import styles from './new.module.css'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'

export const Route = createFileRoute('/_layout/client/new')({
  component: NewClient,
})

export function NewClient() {
  const form = useRef<HTMLFormElement>(null)

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<TClientForm, string>

    const action =
      ({ ...props }: Record<TClientForm, string>) =>
      () => {
        console.table(props)
      }

    const timer = setTimeout(action(items), 6 * 1000)

    const onClick = () => {
      clearTimeout(timer)
    }

    if (
      Object.entries(items).every(([key, value]) => {
        if (key === 'comment') return true
        return value
      })
    ) {
      const { firstName, lastName } = items
      toast({
        title: text.notification.titile,
        description: text.notification.decription({
          username: firstName + ' ' + lastName,
        }),
        variant: 'default',
        action: (
          <ToastAction altText="action from new user">
            {' '}
            <Button variant="default" onClick={onClick}>
              {' '}
              {text.notification.undo}{' '}
            </Button>{' '}
          </ToastAction>
        ),
      })
    }

    ev.preventDefault()
  }

  return (
    <DialogContent className="max-w-2xl">
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
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>label]:space-y-2',
          styles?.['custom-form']
        )}
      >
        <Label>
          {' '}
          <span>{text.form.firstName.label}</span>{' '}
          <Input
            required
            name={'firstName' as TClientForm}
            type="text"
            placeholder={text.form.firstName.placeholder}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.lastName.label} </span>
          <Input
            required
            name={'lastName' as TClientForm}
            type="text"
            placeholder={text.form.lastName.placeholder}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.phone.label} </span>
          <Input
            required
            name={'phone' as TClientForm}
            type="tel"
            placeholder={text.form.phone.placeholder}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.direction.label}</span>
          <Input
            required
            name={'direction' as TClientForm}
            type="text"
            placeholder={text.form.direction.placeholder}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.ref.label} </span>
          <Input
            required
            name={'ref' as TClientForm}
            type="text"
            placeholder={text.form.ref.placeholder}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.comment.label} </span>
          <Textarea
            spellCheck
            name={'comment' as TClientForm}
            placeholder={text.form.comment.placeholder}
            rows={6}
            className="rosize-none"
          />{' '}
        </Label>
      </form>
      <DialogFooter className="justify-end">
        <Button variant="default" form="new-client-form" type="submit">
          {' '}
          {text.button.update}{' '}
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="font-bold hover:ring-1 hover:ring-primary"
          >
            {' '}
            {text.button.close}{' '}
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

NewClient.dispalyname = 'NewClient'

const text = {
  title: 'Crear cliente:',
  descriiption:
    'Introdusca los datos correctamente para la creacion de un cliente nuevo en la plataforma',
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
      placeholder: 'Escriba el nombre del cliente',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido del cliente',
    },
    phone: {
      label: 'Telefono:',
      placeholder: 'Escriba el telefono del cliente',
    },
    direction: {
      label: 'Direccion:',
      placeholder: 'Escriba la direccion del cliente',
    },
    comment: { label: 'Comentario:', placeholder: 'Escriba un comentario' },
    ref: {
      label: 'Referencia:',
      placeholder: 'Escriba | Seleccione la referencia del cliente',
    },
  },
}

type TClientForm = keyof typeof text.form
