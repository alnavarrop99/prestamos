import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useRef, useState } from 'react'
import styles from '@/styles/global.module.css'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getClientIdRes, type TClient } from '@/api/clients'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClientStatus } from '@/lib/context/client'

export const Route = createFileRoute('/_layout/client/$clientId/update')({
  component: UpdateClientById,
  loader: getClientIdRes
})

const reducer: React.Reducer<TClient, TClient> = (prev, state) => ({
  ...prev,
  ...state,
})

/* eslint-disable-next-line */
interface TUpdateClientByIdProps {
  client?: TClient
}

/* eslint-disable-next-line */
export function UpdateClientById({ client: _client = {} as TClient }: TUpdateClientByIdProps) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const client = Route.useLoaderData() ?? _client
  const [clientItems, setForm] = useReducer(reducer, client)
  const { open, setStatus } = useClientStatus()

  const { 
    nombres: firstName,
    apellidos: lastName,
    direccion: direction,
    segunda_direccion: secondDirection,
    numero_de_identificacion: id,
    tipo_de_identificacion: idType,
    referencia: ref,
    celular: phone, 
    telefono: telephone,
  } =  clientItems

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onChange: React.ChangeEventHandler< HTMLFormElement > = (ev) => {
    setForm({ ...clientItems, [ev.target.name as keyof TClient]: ev.target.value })
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return;

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof TClient, string>

    const action =
      ({ ...props }: Record<keyof TClient, string>) =>
      () => {
        console.table(props)
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setStatus({ open: !open })

    const onClick = () => {
      clearTimeout(timer)
    }

    if (true) {
      const { nombres: firstName, apellidos: lastName } = items
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
        onChange={onChange}
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
          <span>{text.form.firstName.label}</span>{' '}
          <Input
            required
            disabled={!checked}
            name={'nombres' as keyof TClient}
            type="text"
            value={firstName}
            placeholder={checked ? text.form.firstName.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.lastName.label} </span>
          <Input
            required
            disabled={!checked}
            name={'apellidos' as keyof TClient}
            type="text"
            value={lastName}
            placeholder={checked ? text.form.lastName.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.id.label} </span>
          <Input
            required
            disabled={!checked}
            name={'numero_de_identificacion' as keyof TClient}
            type="text"
            value={id}
            placeholder={checked ? text.form.id.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.id.label} </span>
          <Select value={idType} disabled={!checked} required name={'tipo_de_identificacion' as keyof TClient} >
            <SelectTrigger className={clsx("w-full", { "border border-primary": checked})}>
              <SelectValue placeholder={text.form.id.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              <SelectItem value={text.form.id.items.id}>{text.form.id.items.id}</SelectItem>
              <SelectItem value={text.form.id.items.passport}>{text.form.id.items.passport}</SelectItem>
              <SelectItem value={text.form.id.items.driverId}>{text.form.id.items.driverId}</SelectItem>
            </SelectContent>
          </Select>
        </Label>
        
        <Label>
          <span>{text.form.phone.label} </span>
          <Input
            required
            disabled={!checked}
            name={'celular' as keyof TClient}
            type="tel"
            value={phone}
            placeholder={checked ? text.form.phone.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.telephone.label} </span>
          <Input
            required
            disabled={!checked}
            name={'telefono' as keyof TClient}
            type="tel"
            value={telephone}
            placeholder={checked ? text.form.telephone.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.direction.label}</span>
          <Input
            required
            disabled={!checked}
            name={'direccion' as keyof TClient}
            type="text"
            value={direction}
            placeholder={checked ? text.form.direction.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.secondDirection.label} </span>
          <Input
            required
            disabled={!checked}
            name={'segunda_direccion' as keyof TClient}
            type="text"
            value={secondDirection}
            placeholder={checked ? text.form.ref.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.ref.label}</span>
          <Input
            required
            disabled={!checked}
            name={'referencia' as keyof TClient}
            type="text"
            value={ref}
            placeholder={checked ? text.form.ref.placeholder : undefined}
          />
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
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

UpdateClientById.dispalyname = 'UpdateClientById'

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
      label: 'Celular:',
      placeholder: 'Escriba el celular del cliente',
    },
    telephone: {
      label: 'Telefono:',
      placeholder: 'Escriba el telefono del cliente',
    },
    direction: {
      label: 'Direccion:',
      placeholder: 'Escriba la direccion del cliente',
    },
    secondDirection: {
      label: '2da Direccion:',
      placeholder: 'Escriba la 2da direccion del cliente',
    },
    id: {
      label: 'I.D.:',
      placeholder: 'Escriba el numero del I.D. del cliente',
      items: {
        passport: "Passaporte",
        id: "I.D.",
        driverId: "Carnet de Conducir"
      }
    },
    ref: {
      label: 'Referencia:',
      placeholder: 'Escriba la referencia del cliente',
    },
    status: {
      label: 'Estado:',
      placeholder: 'Seleccione el estado del cliente',
    }
  },
}
