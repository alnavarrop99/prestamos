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

export const Route = createFileRoute('/_layout/client/$clientId/update')({
  component: Update,
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

export function Update() {
  const form = useRef<HTMLFormElement>(null)
  const [update, setUpdate] = useState(false)
  const client = Route.useLoaderData()
  const [{ direction, comment, phone, ref, lastName, firstName }, setForm] =
    useReducer(reducer, client ?? {})

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
          {text.title({ state: !update })}
        </DialogTitle>
        <Separator />
        <DialogDescription>
          {text.description({ state: !update })}
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
            [styles?.['custom-form-off']]: !update,
          }
        )}
      >
        <Label>
          {' '}
          <span>{text.form.firstName.label}</span>{' '}
          <Input
            required
            disabled={!update}
            name={'firstName' as TClientForm}
            type="text"
            value={firstName}
            onChange={onChange('firstName')}
            placeholder={update ? text.form.firstName.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.lastName.label} </span>
          <Input
            required
            disabled={!update}
            name={'lastName' as TClientForm}
            type="text"
            value={lastName}
            onChange={onChange('lastName')}
            placeholder={update ? text.form.lastName.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.phone.label} </span>
          <Input
            required
            disabled={!update}
            name={'phone' as TClientForm}
            type="tel"
            value={phone}
            onChange={onChange('phone')}
            placeholder={update ? text.form.phone.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.direction.label}</span>
          <Input
            required
            disabled={!update}
            name={'direction' as TClientForm}
            type="text"
            value={direction}
            onChange={onChange('direction')}
            placeholder={update ? text.form.direction.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.ref.label} </span>
          <Input
            required
            disabled={!update}
            name={'ref' as TClientForm}
            type="text"
            value={ref}
            onChange={onChange('ref')}
            placeholder={update ? text.form.ref.placeholder : undefined}
          />{' '}
        </Label>
        <Label>
          <span>{text.form.comment.label} </span>
          <Textarea
            spellCheck
            disabled={!update}
            name={'comment' as TClientForm}
            placeholder={update ? text.form.comment.placeholder : undefined}
            rows={6}
            value={comment}
            onChange={onChange('comment')}
            className="rosize-none"
          />{' '}
        </Label>
      </form>
      <DialogFooter className="!justify-between">
        <Label className="flex cursor-pointer items-center gap-2 font-bold italic">
          {' '}
          <Switch value={!!update} onClick={() => setUpdate(!update)} />{' '}
          {text.button.mode}{' '}
        </Label>
        <div className="space-x-2">
          <Button
            variant="default"
            form="new-client-form"
            type="submit"
            disabled={!update}
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

Update.dispalyname = 'NewClient'

const text = {
  title: ({ state }: { state: boolean }) =>
    (state ? 'Ver' : 'Actualizar') + ' cliente:',
  description: ({ state }: { state: boolean }) =>
    (state ? 'Datos relacionados ' : 'Actualizacion de los datos') +
    'del cliente en la plataforma.',
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
