import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getClientById, pathClientById, type TCLIENT_GET, type TCLIENT_PATCH_BODY } from '@/api/clients'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { listIds, getIdById } from '@/lib/type/id'
import { _clientContext } from '@/pages/_layout/client'
import { TClientTable } from '@/pages/_layout/-column'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_layout/client/$clientId/update')({
  component: UpdateClientById,
  loader: getClientById
})

/* eslint-disable-next-line */
interface TUpdateClientByIdProps {
  client?: TCLIENT_GET
}

/* eslint-disable-next-line */
type TFormName = keyof ( Omit<TCLIENT_PATCH_BODY, "referencia_id"> & Record<"referencia", string> )

/* eslint-disable-next-line */
export function UpdateClientById({ client: _client = {} as TCLIENT_GET }: TUpdateClientByIdProps) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const  clientDB = Route.useLoaderData() ?? _client
  const [ client, setClient ] = useState(clientDB) 
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const { mutate: updateClient } = useMutation({
    mutationKey: ["update-client-by-id"],
    mutationFn: pathClientById
  })
  const [ clients, setClients ] = useContext(_clientContext) ?? [[] as TClientTable[], (({})=>{})]
  const active = useMemo(() => Object.values({ ...clientDB, referencia_id: clientDB?.referencia_id ?? "" }).flat().every( ( value, i ) => value === Object.values({ ...client, referencia_id: client.referencia_id ?? "" }).flat()?.[i] ), [JSON.stringify(client)])
  const ref = useMemo( () => clients?.find( ({ id: refId }) => ( refId === client.referencia_id ) ), [JSON.stringify(client)])

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return;

    const items = Object.fromEntries(
      Array.from( new FormData(form.current).entries())?.map( ([ key, value ]) => {
      if( value === "" || (value === Object?.entries(clientDB)?.find( ([keyO]) => keyO === key )?.[1] ) ) return [ key, undefined ];
      return [ key, value ];
    })) as Record<TFormName, string>

    const description = text.notification.decription({
      username: clientDB?.nombres + " " + clientDB?.apellidos,
    })

    const action =
      (items: Record<TFormName, string>) =>
      () => {
        const refId = ref?.id
        updateClient({ clientId: client?.id, params: {
          celular: items?.celular,
          nombres: items?.nombres,
          telefono: items?.telefono,
          apellidos: items?.apellidos,
          direccion: items?.direccion,
          comentarios: items?.comentarios,
          numero_de_identificacion: items?.numero_de_identificacion,
          tipo_de_identificacion: +items?.tipo_de_identificacion,
          referencia_id: refId ? refId : null,
        }})
        pushNotification({
          date: new Date(),
          action: "PATH",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setOpen({ open: !open })
    setClients( { clients: clients?.map( ({ id: clientId }, i, list) => {
      if(clientId !== client?.id) return list?.[i];
      return ({ 
        ...list?.[i],
        fullName: (items?.nombres ?? clientDB?.nombres) + " " + (items?.apellidos ?? clientDB?.apellidos),
        celular: items?.celular ?? clientDB?.celular,
        nombres: items?.nombres ?? clientDB?.nombres,
        telefono: items?.telefono ?? clientDB?.telefono,
        apellidos: items?.apellidos ?? clientDB?.apellidos,
        direccion: items?.direccion ?? clientDB?.direccion,
        numero_de_identificacion: items?.numero_de_identificacion ?? clientDB?.numero_de_identificacion,
        tipo_de_identificacion_id: getIdById( { id: +items?.tipo_de_identificacion } )?.id  ?? clientDB?.tipo_de_identificacion,
        comentarios: items?.comentarios ?? clientDB?.comentarios,
        referencia: items?.referencia ?? "",
      })
    })})

    const onClick = () => {
      clearTimeout(timer)
      setClients( { clients } )
    }

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

    ev.preventDefault()
  }

  const onChange: React.ChangeEventHandler<HTMLFormElement> = (ev) => {
    const { name, value } = ev.target
    if(!name || !value) return;

    if( name === "referencia" as TFormName ) {
      const refId = clients?.find( ({ fullName }) => ( value === fullName ) )?.id
      setClient( { ...client, referencia_id: refId } ) 
      return;
    }

    setClient( { ...client, [name]: value } );
  }

  return (
    <>
    { !open && <Navigate to={"../../"} replace /> }
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
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>label]:space-y-2 [&>label:last-child]:col-span-full [&_*:disabled]:opacity-100 [&_*:disabled]:cursor-text',
          {
            "[&>label>span]:font-bold": checked,
          }
        )}
      >
        <Label>
          <span>{text.form.firstName.label}</span>
          <Input
            required
            disabled={!checked}
            name={'nombres' as TFormName}
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
            name={'apellidos' as TFormName}
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
            name={'numero_de_identificacion' as TFormName}
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
            name={'tipo_de_identificacion' as TFormName}
          >
            <SelectTrigger className={clsx("w-full")}>
              <SelectValue placeholder={text.form.typeId.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              {listIds()?.map( ({ id, nombre }, index) => 
                <SelectItem key={index} value={""+id}>{nombre}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </Label>
        <Label>
          <span>{text.form.phone.label} </span>
          <Input
            required
            disabled={!checked}
            name={'celular' as TFormName}
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
            name={'telefono' as TFormName}
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
            name={'direccion' as TFormName}
            type="text"
            defaultValue={client?.direccion}
            placeholder={checked ? text.form.direction.placeholder : undefined}
          />
        </Label>
        <Label>
          <span>{text.form.ref.label}</span>
          <Input
            disabled={!checked}
            name={'referencia' as TFormName}
            list='client-referent'
            type="text"
            defaultValue={ref?.fullName}
            placeholder={checked ? text.form.ref.placeholder : undefined}
          />
          <datalist id='client-referent' >
            { clients?.map( ( { fullName }, index ) => <option key={index} value={fullName} />) }
          </datalist>
        </Label>
        <Label>
          <span>{text.form.comment.label}</span>
          <Textarea
            rows={5}
            name={'comentarios' as TFormName}
            placeholder={text.form.comment.placeholder}
            defaultValue={client?.comentarios}
            disabled={!checked}
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
            disabled={!checked || active }
          >
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
        </div>
      </DialogFooter>
    </DialogContent>
    </>
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
    id: {
      label: 'ID:',
      placeholder: 'Escriba el ID',
    },
    comment: {
      label: 'Comentarios:',
      placeholder: 'Escriba el comentario',
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
