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
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import styles from '@/styles/global.module.css'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { postClientsRes, type TClient } from "@/api/clients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { getIDs, getIdById } from '@/api/id'

export const Route = createFileRoute('/_layout/client/new')({
  component: NewClient,
})

/* eslint-disable-next-line */
export function NewClient() {
  const form = useRef<HTMLFormElement>(null)
  const { setNotification } = useNotifications()
  const {mutate: createClient} = useMutation( {
    mutationKey: ["create-client"],
    mutationFn: postClientsRes
  } )

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof TClient | "referencia", string>

    const { nombres: firstName, apellidos: lastName } = items
    const description = text.notification.decription({
      username: firstName + ' ' + lastName,
    })

    const action =
      ({ referencia, ...props }: Record<keyof TClient | "referencia", string>) =>
      () => {
        createClient({
          ...props,
          tipo_de_identificacion: Number.parseInt(props?.tipo_de_identificacion),
          estado: 1,
          // TODO: referencia_id because referencia is the name
          referencia_id: 0,
        })
        setNotification({
          date: new Date(),
          action: "POST",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)

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
            {' '}
            <Button variant="default" onClick={onClick}>
              {' '}
              {text.notification.undo}{' '}
            </Button>{' '}
          </ToastAction>
        ),
      })
    }

    form.current.reset()
    ev.preventDefault()
  }

  return (
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
          <span>{text.form.firstName.label}</span>{' '}
          <Input
            required
            name={'nombres' as keyof TClient}
            type="text"
            placeholder={text.form.firstName.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.lastName.label} </span>
          <Input
            required
            name={'apellidos' as keyof TClient}
            type="text"
            placeholder={text.form.lastName.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.id.label} </span>
          <Input
            required
            name={'numero_de_identificacion' as keyof TClient}
            type="text"
            placeholder={text.form.id.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.typeId.label} </span>
          <Select required name={'tipo_de_identificacion' as keyof TClient} defaultValue={""+getIdById({ id: 1 })?.id}>
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
            name={'celular' as keyof TClient}
            type="tel"
            placeholder={text.form.phone.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.telephone.label} </span>
          <Input
            required
            name={'telefono' as keyof TClient}
            type="tel"
            placeholder={text.form.telephone.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.direction.label}</span>
          <Input
            required
            name={'direccion' as keyof TClient}
            type="text"
            placeholder={text.form.direction.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.email.label}</span>
          <Input
            required
            name={'email' as keyof TClient}
            type="email"
            placeholder={text.form.email.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.ref.label}</span>
          <Input
            required
            name={'referencia'}
            type="text"
            placeholder={text.form.ref.placeholder}
          />
        </Label>
      </form>
      <DialogFooter className="justify-end">
        <Button variant="default" form="new-client" type="submit">
          {' '}
          {text.button.update}{' '}
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="font-bold hover:ring hover:ring-primary"
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


