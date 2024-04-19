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
import {
  postClient,
  type TCLIENT_POST,
  type TCLIENT_POST_BODY,
} from '@/api/clients'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { listIds, getIdByName } from '@/lib/type/id'
import { _clientContext } from '@/pages/_layout/client'
import { useStatus } from '@/lib/context/layout'
import { getStatusByName } from '@/lib/type/status'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScrollBar } from '@/components/ui/scroll-area'

export const postClientOpt = {
  mutationKey: ['create-client'],
  mutationFn: postClient,
}

export const Route = createFileRoute('/_layout/client/new')({
  component: NewClient,
})

/* eslint-disable-next-line */
type TFormName = keyof (Omit<TCLIENT_POST_BODY, 'referencia_id'> &
  Record<'referencia', string>)

/* eslint-disable-next-line */
export function NewClient() {
  const form = useRef<HTMLFormElement>(null)
  const { pushNotification } = useNotifications()
  const { open } = useStatus()

  const onSuccess: (
    data: TCLIENT_POST,
    variables: TCLIENT_POST_BODY
  ) => unknown = (_, items) => {
    const description = text.notification.decription({
      username: items?.nombres + items?.apellidos,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: 'POST',
      description,
    })
  }

  const onError: (
    data: TCLIENT_POST,
    variables: TCLIENT_POST_BODY
  ) => unknown = (_, items) => {
    const description = text.notification.error({
      username: items?.nombres + items?.apellidos,
    })

    const onClick = () => {}

    toast({
      title: text.notification.titile,
      description,
      variant: 'destructive',
      action: (
        <ToastAction altText="action from new user" onClick={onClick}>
          {text.notification.retry}
        </ToastAction>
      ),
    })
  }
  const { mutate: createClient } = useMutation({
    ...postClientOpt,
    onSuccess,
    onError,
  })
  const clients = useContext(_clientContext)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      Array.from(new FormData(form.current).entries())?.map(([key, value]) => {
        if (value === '') return [key, undefined]
        return [key, value]
      })
    ) as Record<TFormName, string>

    const refId = clients?.find(
      ({ fullName }) => items?.referencia === fullName
    )?.id
    createClient({
      nombres: items?.nombres,
      apellidos: items?.apellidos,
      direccion: items?.direccion,
      telefono: items?.telefono,
      celular: items?.celular,
      numero_de_identificacion: items?.numero_de_identificacion,
      tipo_de_identificacion: +items?.tipo_de_identificacion,
      estado: getStatusByName({ statusName: 'Activo' })?.id,
      referencia_id: refId ?? null,
      comentarios: items?.comentarios ?? '',
      // TODO: this field be "" that not's necessary
      email: items?.email ?? '',
    })

    form.current.reset()
    ev.preventDefault()
  }

  return (<>
      {!open && <Navigate to={'../'} replace />}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start text-xl md:text-2xl">{text.title}</DialogTitle>
          <Separator />
          <DialogDescription className="text-xs text-start md:text-base text-muted-foreground">
            {text.descriiption}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='overflow-y-auto h-[25rem] md:h-full'>
        <ScrollBar orientation='vertical' />
          <form
            autoComplete="off"
            ref={form}
            onSubmit={onSubmit}
            id="new-client"
            className={clsx(
              'px-1 grid-rows-subgrid grid md:grid-cols-2 grid-cols-none gap-3 gap-y-4 [&>label]:space-y-2',
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
                pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
              />
            </Label>
            <Label>
              <span>{text.form.lastName.label} </span>
              <Input
                required
                name={'apellidos' as TFormName}
                type="text"
                placeholder={text.form.lastName.placeholder}
                pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
              />
            </Label>
            <Label>
              <span>{text.form.id.label} </span>
              <Input
                required
                name={'numero_de_identificacion' as TFormName}
                type="text"
                placeholder={text.form.id.placeholder}
                pattern="[A-Za-z0-9]{6,12}"
              />
            </Label>
            <Label>
              <span>{text.form.typeId.label} </span>
              <Select
                required
                name={'tipo_de_identificacion' as TFormName}
                defaultValue={'' + getIdByName({ idName: 'Cédula' })?.id}
              >
                <SelectTrigger className="!border-1 w-full !border-ring">
                  <SelectValue placeholder={text.form.typeId.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {listIds()?.map(({ id, nombre }, index) => (
                    <SelectItem key={index} value={'' + id}>
                      {nombre}
                    </SelectItem>
                  ))}
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
                pattern="(?:\+57|0)[0-9]{8}"
              />
            </Label>
            <Label>
              <span>{text.form.telephone.label} </span>
              <Input
                required
                name={'telefono' as TFormName}
                type="tel"
                placeholder={text.form.telephone.placeholder}
                pattern="(?:\+57|0)[0-9]{6,7}"
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
                list="client-referent"
                name={'referencia' as TFormName}
                type="text"
                placeholder={text.form.ref.placeholder}
                pattern={`(${clients
                  ?.map(({ fullName }) => fullName?.replace(/\s+/g, '\\s+'))
                  ?.join('|')})`}
              />
              <datalist id="client-referent">
                {clients?.map(({ fullName }, index) => (
                  <option key={index} value={fullName} />
                ))}
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
        </ScrollArea>
        <DialogFooter className="justify-end gap-2 flex-col md:flex-row">
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
  </>)
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
      'Se ha creado el cliente ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La creacion del cliente' + username + 'ha fallado',
    retry: 'Deshacer',
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
        passport: 'Passaporte',
        id: 'Cedula',
        driverId: 'Carnet de Conducir',
      },
    },
    ref: {
      label: 'Referencia:',
      placeholder: 'Escriba la referencia del cliente',
    },
    status: {
      label: 'Estado:',
      placeholder: 'Seleccione el estado del cliente',
    },
  },
}
