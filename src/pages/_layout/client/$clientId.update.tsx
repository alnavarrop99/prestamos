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
import { ComponentRef, useReducer, useRef, useState } from 'react'
import styles from './new.module.css'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import clients from '@/__mock__/mocks-clients.json'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_layout/client/$clientId/update')({
  component: UpdateByClientId,
  loader: async ({ params: { clientId } }) =>
    clients?.find(({ id }) => clientId === id),
})

type TForm = {
  ref?: string
  firstName?: string
  lastName?: string
  phone?: string
  direction?: string
  comment?: string
}
const reducer: React.Reducer<TForm, TForm> = (prev, state) => ({
  ...prev,
  ...state,
})

export function UpdateByClientId() {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const client = Route.useLoaderData()
  const [{ direction, comment, phone, ref, lastName, firstName }, setForm] =
    useReducer(reducer, client ?? {})

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onChange: (
    prop: TClientForm
  ) => React.ChangeEventHandler<
    ComponentRef<typeof Input> | ComponentRef<typeof Textarea>
  > = (prop) => (ev) => {
    setForm({ [prop]: ev.target.value })
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = {
      firstName,
      lastName,
      phone,
      comment,
      ref,
      direction,
    } as Record<TClientForm, string>
    // const items = Object.fromEntries(
    //   new FormData(form.current).entries()
    // ) as Record<TClientForm, string>

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
        <DialogTitle className="text-2xl">
          {text.title({ state: !checked })}
        </DialogTitle>
        <Separator />
        <DialogDescription>
          {text.description({ state: !checked })}
        </DialogDescription>
      </DialogHeader>
      <form
        autoComplete="on"
        ref={form}
        onSubmit={onSubmit}
        id="new-client-form"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>label]:space-y-2',
          styles?.['custom-form'],
          {
            [styles?.['custom-form-off']]: !checked,
          }
        )}
      >
        <Label>
          {' '}
          <span>{text.form.firstName.label}</span>{' '}
          <Input
            required
            disabled={!checked}
            name={'firstName' as TClientForm}
            type="text"
            value={firstName}
            onChange={onChange('firstName')}
            placeholder={checked ? text.form.firstName.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.lastName.label} </span>
          <Input
            required
            disabled={!checked}
            name={'lastName' as TClientForm}
            type="text"
            value={lastName}
            onChange={onChange('lastName')}
            placeholder={checked ? text.form.lastName.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.phone.label} </span>
          <Input
            required
            disabled={!checked}
            name={'phone' as TClientForm}
            type="tel"
            value={phone}
            onChange={onChange('phone')}
            placeholder={checked ? text.form.phone.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.direction.label}</span>
          <Input
            required
            disabled={!checked}
            name={'direction' as TClientForm}
            type="text"
            value={direction}
            onChange={onChange('direction')}
            placeholder={checked ? text.form.direction.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.ref.label} </span>
          <Input
            required
            disabled={!checked}
            name={'ref' as TClientForm}
            type="text"
            value={ref}
            onChange={onChange('ref')}
            placeholder={checked ? text.form.ref.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.comment.label} </span>
          <Textarea
            spellCheck
            disabled={!checked}
            name={'comment' as TClientForm}
            placeholder={checked ? text.form.comment.placeholder : undefined}
            rows={6}
            value={comment}
            onChange={onChange('comment')}
            className="rosize-none"
          />{' '}
        </Label>
      </form>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Switch
            id="switch-updates-client"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="switch-updates-client"
            className={clsx('cursor-pointer')}
          >
            <Badge>{text.button.mode}</Badge>
          </Label>
        </div>
        <div className="space-x-2">
          <Button
            variant="default"
            form="new-client-form"
            type="submit"
            disabled={!checked}
          >
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
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

UpdateByClientId.dispalyname = 'UpdateByClientId'

const text = {
  title: ({ state }: { state: boolean }) =>
    (state ? 'Ver' : 'Actualizacion de los datos') + ' cliente:',
  description: ({ state }: { state: boolean }) =>
    (state ? 'Datos' : 'Actualizacion de los datos') +
    ' del cliente en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    mode: 'Modo',
  },
  notification: {
    titile: 'Actualizacion del cliente',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizado el cliente ' + username + ' con exito.',
    error: 'Error: la actualizacion de los datos del cliente',
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
