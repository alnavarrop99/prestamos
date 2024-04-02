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
import { postClient, type TCLIENT_POST_BODY } from "@/api/clients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { getIDs, getIdById } from '@/lib/type/id'
import { _clientContext } from '@/pages/_layout/client'
import { type TClientTable } from '@/pages/_layout/-column'
import { useStatus } from '@/lib/context/layout'

export const Route = createFileRoute('/_layout/client/new')({
  component: NewClient,
})

/* eslint-disable-next-line */
type TFormName = keyof (TCLIENT_POST_BODY & Record<"referencia", string>)

/* eslint-disable-next-line */
export function NewClient() {
  const form = useRef<HTMLFormElement>(null)
  const { pushNotification } = useNotifications()
  const { open } = useStatus()

  const onSuccess: (data: TCLIENT_POST_BODY) => unknown = (newClient) => {
    setClients({ clients: [ ...clients.slice(0, -1), { ...(clients?.at(-1) ?? {} as TClientTable), ...newClient } ] })
  }

  const {mutate: createClient} = useMutation( {
    mutationKey: ["create-client"],
    mutationFn: postClient,
    onSuccess
  } )
  const [ clients, setClients ] = useContext(_clientContext) ?? [[], (({})=>{})]

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<TFormName , string>

    const { nombres: firstName, apellidos: lastName } = items
    const description = text.notification.decription({
      username: firstName + ' ' + lastName,
    })

    const action =
      ({ ...props }: Record<TFormName, string>) =>
      () => {
        createClient({
          ...props,
          tipo_de_identificacion: Number.parseInt(props?.tipo_de_identificacion),
          estado: 1,
          // TODO: referencia_id because referencia is the name
          referencia_id: 0,
        })
        pushNotification({
          date: new Date(),
          action: "POST",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setClients({ clients: [ ...clients, {
      numero_de_identificacion: items.numero_de_identificacion,
      id: (clients?.at(-1)?.id ?? 0) + 1,
      email: items?.email,
      estado: 1,
      celular: items?.celular,
      fullName: firstName + " " + lastName,
      telefono: items?.telefono,
      direccion:items?.direccion,
      comentarios: items?.comentarios,
      tipo_de_identificacion: +items?.tipo_de_identificacion,
      // TODO: 
      referencia_id: +items?.referencia_id,
      owner_id: undefined
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
    { !open && <Navigate to={"../"} /> }
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
          <Select required name={'tipo_de_identificacion' as TFormName} defaultValue={""+getIdById({ id: 1 })?.id}>
            <SelectTrigger className="w-full ring-ring ring-1">
              <SelectValue placeholder={text.form.typeId.placeholder} />
            </SelectTrigger>
            <SelectContent>
              { getIDs()?.map( ({ id, name }) => 
                <SelectItem key={id} value={""+id}>{name}</SelectItem>
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
          <span>{text.form.email.label}</span>
          <Input
            required
            name={'email' as TFormName}
            type="email"
            placeholder={text.form.email.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.ref.label}</span>
          <Input
            required
            name={'referencia' as TFormName}
            type="text"
            placeholder={text.form.ref.placeholder}
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
            variant="secondary"
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


