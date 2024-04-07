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
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useRef } from 'react'
import styles from '@/styles/global.module.css'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { postClient, TCLIENT_POST, type TCLIENT_POST_BODY } from "@/api/clients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { listIds, getIdByName } from '@/lib/type/id'
import { _clientContext } from '@/pages/_layout/client'
import { type TClientTable } from '@/pages/_layout/-column'
import { useStatus } from '@/lib/context/layout'
import { getStatusByName } from '@/lib/type/status'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_layout/client/new')({
  component: NewClient,
})

/* eslint-disable-next-line */
type TFormName = keyof (Omit<TCLIENT_POST_BODY, "referencia_id"> & Record<"referencia", string>)

/* eslint-disable-next-line */
export function NewClient() {
  const form = useRef<HTMLFormElement>(null)
  const { pushNotification } = useNotifications()
  const { open } = useStatus()

  const onSuccess: (data: TCLIENT_POST) => unknown = (newClient) => {
    setClients({ clients: [ ...clients.slice(0, -1), { ...(clients?.at(-1) ?? {} as TClientTable), ...newClient } ] })
  }
  const {mutate: createClient} = useMutation( {
    mutationKey: ["create-client"],
    mutationFn: postClient,
    onSuccess
  } )
  const [ clients, setClients ] = useContext(_clientContext) ?? [[] as TClientTable[], (({})=>{})]

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      Array.from(new FormData(form.current).entries())?.map( ([ key, value ]) => {
      if( value === "" ) return [ key, undefined ]
      return [ key, value ]
    })) as Record<TFormName , string>

    const description = text.notification.decription({
      username: items?.nombres + items?.apellidos,
    })

    const action =
      ({ ...items }: Record<TFormName, string>) =>
      () => {
        const refId = clients?.find( ({ fullName }) => ( items?.referencia === fullName ) )?.id
        createClient({
          nombres: items?.nombres,
          apellidos: items?.apellidos,
          direccion: items?.direccion,
          telefono: items?.telefono,
          celular: items?.celular,
          numero_de_identificacion: items?.numero_de_identificacion,
          tipo_de_identificacion: +items?.tipo_de_identificacion,
          estado: getStatusByName({ statusName: "Activo" })?.id,
          referencia_id: refId ?? null,
          comentarios: items?.comentarios ?? "",
          // TODO: this field be "" that not's necessary
          email: items?.email ?? "",
        })
        pushNotification({
          date: new Date(),
          action: "POST",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setClients({ clients: [ ...clients, {
      fullName: items?.nombres + " " + items?.apellidos,
      direccion: items?.direccion,
      telefono: items?.telefono,
      celular: items?.celular,
      numero_de_identificacion: items?.numero_de_identificacion,
      tipo_de_identificacion: +items?.tipo_de_identificacion,
      estado: getStatusByName({ statusName: "Activo" })?.id,
      referencia: items?.referencia ?? "",
      id: clients?.at(-1)?.id ?? 0 + 1,
      comentarios: items?.comentarios ?? "",
      // TODO: this field be "" that not's necessary
      email: items?.email ?? "",
      // TODO: 
      owner_id: 0,
    }] } )
          

    const onClick = () => {
      clearTimeout(timer)
      setClients({ clients })
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

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <>
    { !open && <Navigate to={"../"} replace /> }
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription className='text-muted-foreground'>{text.descriiption}</DialogDescription>
      </DialogHeader>
      <form
        autoComplete="off"
        ref={form}
        onSubmit={onSubmit}
        id="new-client"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>label]:space-y-2',
          styles?.['custom-form']
        )}
      >
        <Label>
          <span>{text.form.firstName.label}</span>
          <Input
            required
            name={'nombres' as TFormName}
            type="text"
            placeholder={text.form.firstName.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.lastName.label} </span>
          <Input
            required
            name={'apellidos' as TFormName}
            type="text"
            placeholder={text.form.lastName.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.id.label} </span>
          <Input
            required
            name={'numero_de_identificacion' as TFormName}
            type="text"
            placeholder={text.form.id.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.typeId.label} </span>
          <Select required name={'tipo_de_identificacion' as TFormName} defaultValue={""+getIdByName({ idName: "Cédula" })?.id}>
            <SelectTrigger className="w-full ring-ring ring-1">
              <SelectValue placeholder={text.form.typeId.placeholder} />
            </SelectTrigger>
            <SelectContent>
              { listIds()?.map( ({ id, nombre }, index) => 
                <SelectItem key={index} value={""+id}>{nombre}</SelectItem>
              ) }
            </SelectContent>
          </Select>
        </Label>
        <Label>
          <span>{text.form.phone.label} </span>
          <Input
            required
            name={'celular' as TFormName}
            type="tel"
            placeholder={text.form.phone.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.telephone.label} </span>
          <Input
            required
            name={'telefono' as TFormName}
            type="tel"
            placeholder={text.form.telephone.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.direction.label}</span>
          <Input
            required
            name={'direccion' as TFormName}
            type="text"
            placeholder={text.form.direction.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.ref.label}</span>
          <Input
            list='client-referent'
            name={'referencia' as TFormName}
            type="text"
            placeholder={text.form.ref.placeholder}
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
        />
      </Label>
      </form>
      <DialogFooter className="justify-end">
        <Button variant="default" form="new-client" type="submit">
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

NewClient.dispalyname = 'NewClient'

const text = {
  title: 'Crear cliente:',
  descriiption:
    'Introdusca los datos correctamente para la creacion de un cliente nuevo en la plataforma.',
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
    comment: {
      label: 'Comentarios:',
      placeholder: 'Escriba el comentario',
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
        id: "Cedula",
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
