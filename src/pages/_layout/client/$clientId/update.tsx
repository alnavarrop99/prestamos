import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getClientIdRes, pathClientsIdRes, TClientList, type TClient } from '@/api/clients'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { getIDs, getIdById } from '@/lib/type/id'
import { _clientContext } from '../../client'

export const Route = createFileRoute('/_layout/client/$clientId/update')({
  component: UpdateClientById,
  loader: getClientIdRes
})

/* eslint-disable-next-line */
interface TUpdateClientByIdProps {
  client?: TClientList
}

/* eslint-disable-next-line */
export function UpdateClientById({ client: _client = {} as TClientList }: TUpdateClientByIdProps) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const  clientDB = Route.useLoaderData() ?? _client
  const [ client, setClient ] = useState(clientDB) 
  const { open, setOpen } = useStatus()
  const { pushNotification: setNotification } = useNotifications()
  const navigate = useNavigate()
  const { mutate: updateClient } = useMutation({
    mutationKey: ["update-client-by-id"],
    mutationFn: pathClientsIdRes
  })
  const [ clients, setClients ] = useContext(_clientContext) ?? [[], (({})=>{})]

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return;

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof TClient | "referencia", string>

    const { nombres: firstName, apellidos: lastName } = items
    const description = text.notification.decription({
      username: firstName + ' ' + lastName,
    })

    const action =
      ({ ...items }: Record<keyof Omit<TClient, "id">, string>) =>
      () => {
        const { id } = client
        updateClient({ clientId: id, params: {
          ...items,
          tipo_de_identificacion: Number.parseInt( items?.tipo_de_identificacion ),
          estado: 1,
          // TODO: referencia_id but referencia is a string
          referencia_id: 0,
        } })
        setNotification({
          date: new Date(),
          action: "PATH",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setOpen({ open: !open })
    navigate({to: "../../"})
    setClients( { clients: clients?.map( ({ id }, i, list) => {
      if(id === client?.id){
        return ({ 
          ...list?.[i],
          numero_de_identificacion: items.numero_de_identificacion,
          email: items?.email,
          estado: 1,
          celular: items?.celular,
          fullName: firstName + " " + lastName,
          telefono: items?.telefono,
          direccion:items?.direccion,
          comentarios: items?.comentarios,
          tipo_de_identificacion: Number.parseInt(items?.referencia),
        })
      }
      return list?.[i]
    } ) } )

    const onClick = () => {
      clearTimeout(timer)
    setClients( { clients } )
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
            </Button>{' '}
          </ToastAction>
        ),
      })
    }

    ev.preventDefault()
  }

  const onChange: React.ChangeEventHandler<HTMLFormElement> = (ev) => {
    const { name, value } = ev.target
    if(!name || !value) return;
    setClient( { ...client, [name]: value } )
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">
          {text.title({ state: !checked })}
        </DialogTitle>
        <Separator />
        <DialogDescription className='text-muted-foreground'>
          {text.description({ state: !checked })}
        </DialogDescription>
      </DialogHeader>
      <form
        autoComplete="off"
        ref={form}
        onSubmit={onSubmit}
        onChange={onChange}
        id="update-client"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>label]:space-y-2',
          {
            "[&>label>span]:font-bold": checked,
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
            defaultValue={client?.nombres}
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
            defaultValue={client?.apellidos}
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
            defaultValue={client?.numero_de_identificacion+""}
            placeholder={checked ? text.form.id.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.typeId.label} </span>
          <Select 
            defaultValue={""+getIdById({ id: client?.tipo_de_identificacion })?.id}
            disabled={!checked}
            required
            name={'tipo_de_identificacion' as keyof TClient}
          >
            <SelectTrigger className={clsx("w-full")}>
              <SelectValue placeholder={text.form.typeId.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              {getIDs()?.map( ({ id, name }) => 
                <SelectItem key={id} value={""+id}>{name}</SelectItem>
              )}
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
            defaultValue={client?.celular}
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
            defaultValue={client?.telefono}
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
            defaultValue={client?.direccion}
            placeholder={checked ? text.form.direction.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.email.label} </span>
          <Input
            required
            disabled={!checked}
            name={'email' as keyof TClient}
            type="email"
            defaultValue={client?.email}
            placeholder={checked ? text.form.ref.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.ref.label}</span>
          <Input
            required
            disabled={!checked}
            name={'referencia'}
            type="text"
            defaultValue={client?.referencia_id}
            placeholder={checked ? text.form.ref.placeholder : undefined}
          />
        </Label>
      </form>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Switch
            id="edit"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="edit"
            className={clsx('cursor-pointer')}
          >
            <Badge>{text.button.mode}</Badge>
          </Label>
        </div>
        <div className="space-x-2">
          <Button
            variant="default"
            form="update-client"
            type="submit"
            disabled={!checked || Object.values(clientDB).flat().every( ( value, i ) => value === Object.values(client).flat()?.[i] ) }
          >
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
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

UpdateClientById.dispalyname = 'UpdateClientById'

const text = {
  title: ({ state }: { state: boolean }) =>
    (state ? 'Datos del ' : 'Actualizacion de los datos') + ' cliente:',
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
      placeholder: 'Escriba el nombre',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido',
    },
    phone: {
      label: 'Celular:',
      placeholder: 'Escriba el celular',
    },
    telephone: {
      label: 'Telefono:',
      placeholder: 'Escriba el telefono',
    },
    direction: {
      label: 'Direccion:',
      placeholder: 'Escriba la direccion',
    },
    email: {
      label: 'Email:',
      placeholder: 'Escriba el email',
    },
    id: {
      label: 'ID:',
      placeholder: 'Escriba el ID',
    },
    typeId: {
      label: 'Tipo de identificacion:',
      placeholder: 'Seleccione una opcion',
      items: {
        passport: "Passaporte",
        id: "I.D.",
        driverId: "Carnet de Conducir"
      }
    },
    ref: {
      label: 'Referencia:',
      placeholder: 'Escriba la referencia',
    },
    status: {
      label: 'Estado:',
      placeholder: 'Seleccione el estado',
    }
  },
}
