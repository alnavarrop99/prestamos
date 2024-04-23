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
import { Navigate, createFileRoute, defer } from '@tanstack/react-router'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  getClientById,
  pathClientById,
  type TCLIENT_POST,
  type TCLIENT_GET,
  type TCLIENT_PATCH_BODY,
  TCLIENT_GET_ALL,
} from '@/api/clients'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { listIds, getIdById } from '@/lib/type/id'
import { _clientContext, getClientListOpt } from '@/pages/_layout/client'
import { Textarea } from '@/components/ui/textarea'
import { queryClient } from '@/pages/__root'
import { Skeleton } from '@/components/ui/skeleton'
import styles from '@/styles/global.module.css'
import { useToken } from '@/lib/context/login'
// import { redirect } from '@tanstack/react-router'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ScrollBar } from '@/components/ui/scroll-area'

export const updateClientByIdOpt = {
  mutationKey: ['update-client-by-id'],
  mutationFn: pathClientById,
}

export const getClientByIdOpt = ({ clientId }: { clientId: string }) => ({
  queryKey: ['get-client-by-id', { clientId }],
  queryFn: () => getClientById({ params: { clientId } }),
})

export const Route = createFileRoute('/_layout/client/$clientId/update')({
  component: UpdateClientById,
  loader: async ({ params }) => {
    const data = queryClient.ensureQueryData(
      queryOptions(getClientByIdOpt(params))
    )

    // TOOD: change this of site infer in the charge
    // const { rol, userId } = useToken.getState()
    // const ownerId = (await data)?.owner.id
    // if (ownerId !== userId && rol?.rolName !== 'Administrador')
    //   throw redirect({ to: '/client' })

    return { client: defer(data) }
  },
})

/* eslint-disable-next-line */
type TFormName = keyof (Omit<TCLIENT_PATCH_BODY, 'referencia_id'> &
  Record<'referencia', string>)

/* eslint-disable-next-line */
export function UpdateClientById() {
  const { userId, rol } = useToken()
  const { clientId } = Route.useParams()
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const {
    data: clientRes,
    isSuccess,
    isError,
  } = useQuery(queryOptions(getClientByIdOpt({ clientId })))
  const [client, setClient] = useState<TCLIENT_GET | undefined>(undefined)
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const init = useRef(client)
  const qClient = useQueryClient()

  useEffect(() => {
    if (!clientRes && isError) throw Error()
  }, [isError])

  const onSuccess = (newData: TCLIENT_POST) => {
    if (!init?.current?.nombres || !init?.current?.apellidos) return

    const description = text.notification.decription({
      username: init?.current?.nombres + ' ' + init.current.apellidos,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: 'PATH',
      description,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    const updateList: (data: TCLIENT_GET_ALL) => TCLIENT_GET_ALL = (data) => {
      const res = data
      return res?.map(({ id }, index, list) => {
        if (id === +clientId)
          return {
            ...list?.[index],
            ...newData,
          }
        return list?.[index]
      })
    }

    const updateClient: (data: TCLIENT_GET_ALL) => TCLIENT_GET_ALL = (data) => {
      return { ...newData, ...data }
    }

    qClient?.setQueryData(getClientListOpt?.queryKey, updateList)
    qClient?.setQueryData(
      getClientByIdOpt({ clientId })?.queryKey,
      updateClient
    )
  }

  const onError = () => {
    if (!init?.current?.nombres || !init?.current?.apellidos) return

    const description = text.notification.error({
      username: init?.current?.nombres + ' ' + init.current.apellidos,
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

    toast({
      title: text.notification.titile,
      description,
      variant: 'destructive',
    })
  }
  const { mutate: updateClient } = useMutation({
    ...updateClientByIdOpt,
    onSuccess,
    onError,
  })

  useEffect(() => {
    if (!clientRes) return
    init.current = clientRes
    setClient(clientRes)
    return () => {
      // setUser()
    }
  }, [clientRes])

  const clients = useContext(_clientContext)

  const active = useMemo(
    () =>
      Object.values({
        ...init.current,
        referencia_id: init.current?.referencia_id ?? '',
      })
        .flat()
        .every(
          (value, i) =>
            value ===
            Object.values({
              ...client,
              referencia_id: client?.referencia_id ?? '',
            }).flat()?.[i]
        ),
    [client]
  )

  const ref = useMemo(
    () => clients?.find(({ id: refId }) => refId === client?.referencia_id),
    [client]
  )

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    const clientId = init.current?.id
    const client = init.current
    if (!form.current || !clientId || !client) return

    const items = Object.fromEntries(
      Array.from(new FormData(form.current).entries())?.map(([key, value]) => {
        if (
          value === '' ||
          value === Object?.entries(client)?.find(([keyO]) => keyO === key)?.[1]
        )
          return [key, undefined]
        return [key, value]
      })
    ) as Record<TFormName, string>

    const refId = ref?.id
    updateClient({
      clientId,
      params: {
        celular: items?.celular,
        nombres: items?.nombres,
        telefono: items?.telefono,
        apellidos: items?.apellidos,
        direccion: items?.direccion,
        comentarios: items?.comentarios,
        numero_de_identificacion: items?.numero_de_identificacion,
        tipo_de_identificacion_id: +items?.tipo_de_identificacion_id,
        referencia_id: refId ? refId : null,
      },
    })

    setOpen({ open: !open })
    ev.preventDefault()
  }

  const onChange: React.ChangeEventHandler<HTMLFormElement> = (ev) => {
    const { name, value } = ev.target
    if (!name || !value || !client) return

    if (name === ('referencia' as TFormName)) {
      const refId = clients?.find(({ fullName }) => value === fullName)?.id
      setClient({ ...client, referencia_id: refId })
      return
    }

    setClient({ ...client, [name]: value })
  }

  return (
    <>
      {!open && <Navigate to={'../../'} replace />}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start text-xl md:text-2xl">
            {text.title({ state: !checked })}
          </DialogTitle>
          <Separator />
          <DialogDescription className="text-start text-xs text-muted-foreground md:text-base">
            {text.description({ state: !checked })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60dvh] overflow-y-auto md:h-full">
          <ScrollBar orientation="vertical" />
          <form
            autoFocus={false}
            autoComplete="off"
            ref={form}
            onSubmit={onSubmit}
            onChange={onChange}
            id="update-client"
            className={clsx(
              'grid-rows-subgrid grid grid-cols-none gap-3 gap-y-4 p-1 md:grid-cols-2 [&>label:last-child]:col-span-full [&>label]:space-y-2 [&_*:disabled]:cursor-text [&_*:disabled]:opacity-100',
              {
                '[&>label>span]:font-bold': checked,
              }
            )}
          >
            <Label>
              <span>{text.form.firstName.label}</span>
              {!isSuccess ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  required
                  disabled={!checked}
                  name={'nombres' as TFormName}
                  type="text"
                  defaultValue={clientRes?.nombres}
                  pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
                  placeholder={
                    checked ? text.form.firstName.placeholder : undefined
                  }
                />
              )}
            </Label>
            <Label>
              <span>{text.form.lastName.label} </span>
              {!isSuccess ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  required
                  disabled={!checked}
                  name={'apellidos' as TFormName}
                  type="text"
                  defaultValue={clientRes?.apellidos}
                  pattern="^[a-zA-Z]+(?: [a-zA-Z]+)?$"
                  placeholder={
                    checked ? text.form.lastName.placeholder : undefined
                  }
                />
              )}
            </Label>
            <Label>
              <span>{text.form.id.label} </span>
              {!isSuccess ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  required
                  disabled={!checked}
                  name={'numero_de_identificacion' as TFormName}
                  type="text"
                  defaultValue={clientRes?.numero_de_identificacion}
                  placeholder={checked ? text.form.id.placeholder : undefined}
                  pattern="[A-Za-z0-9]{6,12}"
                />
              )}
            </Label>
            <Label>
              <span>{text.form.typeId.label} </span>
              {!isSuccess || !clientRes ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  defaultValue={
                    '' +
                    getIdById({ id: clientRes?.tipo_de_identificacion_id })?.id
                  }
                  disabled={!checked}
                  required
                  name={'tipo_de_identificacion_id' as TFormName}
                >
                  <SelectTrigger className={clsx('w-full')}>
                    <SelectValue placeholder={text.form.typeId.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="[&_*]:cursor-pointer">
                    {listIds()?.map(({ id, nombre }, index) => (
                      <SelectItem key={index} value={'' + id}>
                        {nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Label>
            <Label>
              <span>{text.form.phone.label} </span>
              {!isSuccess ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  required
                  disabled={!checked}
                  name={'celular' as TFormName}
                  type="tel"
                  defaultValue={clientRes?.celular}
                  pattern="(?:\+57|0)[0-9]{8}"
                  placeholder={
                    checked ? text.form.phone.placeholder : undefined
                  }
                />
              )}
            </Label>
            <Label>
              <span>{text.form.telephone.label} </span>
              {!isSuccess ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  required
                  disabled={!checked}
                  name={'telefono' as TFormName}
                  type="tel"
                  defaultValue={clientRes?.telefono}
                  pattern="(?:\+57|0)[0-9]{6,7}"
                  placeholder={
                    checked ? text.form.telephone.placeholder : undefined
                  }
                />
              )}
            </Label>
            <Label>
              <span>{text.form.direction.label}</span>
              {!isSuccess ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  required
                  disabled={!checked}
                  name={'direccion' as TFormName}
                  type="text"
                  defaultValue={clientRes?.direccion}
                  placeholder={
                    checked ? text.form.direction.placeholder : undefined
                  }
                />
              )}
            </Label>
            <Label>
              <span>{text.form.ref.label}</span>
              {!isSuccess ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <Input
                    disabled={!checked}
                    name={'referencia' as TFormName}
                    list="client-referent"
                    type="text"
                    defaultValue={ref?.fullName}
                    placeholder={
                      checked ? text.form.ref.placeholder : undefined
                    }
                    pattern={`(${clients
                      ?.map(({ fullName }) => fullName?.replace(/\s+/g, '\\s+'))
                      ?.join('|')})`}
                  />
                  <datalist id="client-referent">
                    {clients?.map(({ fullName }, index) => (
                      <option key={index} value={fullName} />
                    ))}
                  </datalist>
                </>
              )}
            </Label>
            <Label>
              <span>{text.form.comment.label}</span>
              {!isSuccess ? (
                <Skeleton className="h-28 w-full" />
              ) : (
                <Textarea
                  rows={5}
                  name={'comentarios' as TFormName}
                  placeholder={text.form.comment.placeholder}
                  defaultValue={clientRes?.comentarios}
                  disabled={!checked}
                />
              )}
            </Label>
          </form>
        </ScrollArea>
        <DialogFooter className="flex-row !justify-between gap-2">
          <div
            className={clsx('flex items-center gap-2 font-bold italic', {
              invisible: !userId || rol?.rolName !== 'Administrador',
            })}
          >
            {!isSuccess ? (
              <>
                <Skeleton className="h-6 w-16 rounded-full md:h-8 md:w-12" />
                <Skeleton className="h-6 w-16 rounded-full md:h-8 md:w-14" />
              </>
            ) : (
              <>
                <Switch
                  id="edit"
                  checked={checked}
                  onCheckedChange={onCheckedChange}
                />
                <Label htmlFor="edit" className={clsx('cursor-pointer')}>
                  <Badge>{text.button.mode}</Badge>
                </Label>
              </>
            )}
          </div>
          <div className="space-x-2">
            {!isSuccess ? (
              <>
                <Skeleton className="inline-block h-10 w-20 md:h-12 md:w-24" />
                <Skeleton className="inline-block h-10 w-20 md:h-12 md:w-24" />
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  form="update-client"
                  type="submit"
                  disabled={!checked || active}
                  className={clsx({
                    invisible: !checked,
                    visible: checked,
                    [styles?.['search-badge-animation']]: checked,
                  })}
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
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}

/* eslint-disable-next-line */
export function Error() {
  useEffect(() => {
    toast({
      title: text.error.title,
      description: (
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-2xl font-bold">:&nbsp;(</h2>
          <p className="text-base"> {text.error.descriiption} </p>
        </div>
      ),
      variant: 'destructive',
    })
  }, [])
  return
}

UpdateClientById.dispalyname = 'UpdateClientById'
Error.dispalyname = 'UpdateClientByIdError'

const text = {
  title: ({ state }: { state: boolean }) =>
    (state ? 'Datos del ' : 'Actualizacion de los datos') + ' cliente:',
  description: ({ state }: { state: boolean }) =>
    (state ? 'Datos' : 'Actualizacion de los datos') +
    ' del cliente en la plataforma.',
  error: {
    title: 'Obtencion de datos de usuario',
    descriiption: 'Ha ocurrido un error inesperado',
  },
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    mode: 'Modo',
  },
  notification: {
    titile: 'Actualizacion del cliente',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizado el cliente ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La actualizacion del cliente' + username + 'ha fallado',
    retry: 'Reintentar',
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
        passport: 'Passaporte',
        id: 'I.D.',
        driverId: 'Carnet de Conducir',
      },
    },
    ref: {
      label: 'Referencia:',
      placeholder: 'Escriba la referencia',
    },
    status: {
      label: 'Estado:',
      placeholder: 'Seleccione el estado',
    },
  },
}
