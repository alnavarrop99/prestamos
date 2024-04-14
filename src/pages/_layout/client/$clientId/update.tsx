import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Await, Navigate, createFileRoute, defer } from '@tanstack/react-router'
import { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { getClientById, pathClientById, TCLIENT_POST, type TCLIENT_GET, type TCLIENT_PATCH_BODY } from '@/api/clients'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { queryOptions, useMutation } from '@tanstack/react-query'
import { listIds, getIdById } from '@/lib/type/id'
import { _clientContext } from '@/pages/_layout/client'
import { Textarea } from '@/components/ui/textarea'
import { queryClient } from '@/pages/__root'
import { Skeleton } from '@/components/ui/skeleton'

export const updateClientByIdOpt = {
  mutationKey: ["update-client-by-id"],
  mutationFn: pathClientById,
}

export const getClientByIdOpt = ( { clientId }: { clientId: string }  ) => ({
  queryKey: ["get-client-by-id", { clientId }],
  queryFn: () => getClientById({ params: { clientId } }),
})

export const Route = createFileRoute('/_layout/client/$clientId/update')({
  component: UpdateClientById,
  loader: async ( { params } ) =>{
    const data = queryClient.ensureQueryData( queryOptions( getClientByIdOpt(params) ) )
    return ( { client: defer( data ) } )
  }
})

/* eslint-disable-next-line */
interface TUpdateClientByIdProps {
  client?: TCLIENT_GET
}

/* eslint-disable-next-line */
type TFormName = keyof ( Omit<TCLIENT_PATCH_BODY, "referencia_id"> & Record<"referencia", string> )

/* eslint-disable-next-line */
export function UpdateClientById({ }: TUpdateClientByIdProps) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const { client: clientRes } = Route.useLoaderData()
  const [ client, setClient ] = useState<TCLIENT_GET | undefined>(undefined) 
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const { clientId } = Route.useParams()
  const init = useRef(client)

  const onSuccess = ( data: TCLIENT_POST ) => {
    if( !init?.current?.nombres || !init?.current?.apellidos ) return;

    const description = text.notification.decription({
      username: init?.current?.nombres + " " + init.current.apellidos
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: "PATH",
      description,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })
    
    queryClient.setQueriesData( { queryKey: getClientByIdOpt({ clientId }).queryKey }, data )

    // TODO: not update user with exec a path update
    // setUser( { ...data, password: "" } )
  }

  const onError = () => {
    if( !init?.current?.nombres || !init?.current?.apellidos ) return;

    const description = text.notification.error({
      username: init?.current?.nombres + " " + init.current.apellidos
    })

    const onClick = () => {}

    toast({
      title: text.notification.titile,
      description,
      variant: 'destructive',
      action: (
        <ToastAction altText="action from new user">
          <Button variant="default" onClick={onClick}>
            {text.notification.retry}
          </Button>
        </ToastAction>
      ),
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'destructive',
    })
  }
  const { mutate: updateClient } = useMutation({ ...updateClientByIdOpt,
    onSuccess,
    onError
  })

  useEffect( () => {
    if(!client){
      clientRes?.then( ( data ) => {
        init.current = data
        setClient(data)
      })
    }
    return () => {
      // setUser()
    }
  }, [clientRes] )

  const clientsList = useContext(_clientContext)

  const active = useMemo(() => Object.values({ ...init.current, referencia_id: init.current?.referencia_id ?? "" }).flat().every( ( value, i ) => value === Object.values({ ...client, referencia_id: client?.referencia_id ?? "" }).flat()?.[i] ), [client])

  const ref = useMemo( () => clientsList?.find( ({ id: refId }) => ( refId === client?.referencia_id ) ), [client])

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    const clientId = init.current?.id
    if (!form.current || !clientId) return;

    const items = Object.fromEntries(
      Array.from( new FormData(form.current).entries())?.map( ([ key, value ]) => {
      if( value === "" || (value === Object?.entries(clientRes)?.find( ([keyO]) => keyO === key )?.[1] ) ) return [ key, undefined ];
      return [ key, value ];
    })) as Record<TFormName, string>

    const refId = ref?.id
    updateClient({ clientId, params: {
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

    setOpen({ open: !open })

    ev.preventDefault()
  }

  const onChange: React.ChangeEventHandler<HTMLFormElement> = (ev) => {
    const { name, value } = ev.target
    if(!name || !value || !client) return;

    if( name === "referencia" as TFormName ) {
      const refId = clientsList?.find( ({ fullName }) => ( value === fullName ) )?.id
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
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Input
                required
                disabled={!checked}
                name={'nombres' as TFormName}
                type="text"
                defaultValue={data?.nombres}
                placeholder={checked ? text.form.firstName.placeholder : undefined}
              />
           }
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.lastName.label} </span>
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Input
                required
                disabled={!checked}
                name={'apellidos' as TFormName}
                type="text"
                defaultValue={data?.apellidos}
                placeholder={checked ? text.form.lastName.placeholder : undefined}
              />
           }
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.id.label} </span>
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Input
                required
                disabled={!checked}
                name={'numero_de_identificacion' as TFormName}
                type="text"
                defaultValue={data?.numero_de_identificacion}
                placeholder={checked ? text.form.id.placeholder : undefined}
              />
           }
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.typeId.label} </span>
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Select 
                defaultValue={""+getIdById({ id: data?.tipo_de_identificacion })?.id}
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
           }
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.phone.label} </span>
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Input
                required
                disabled={!checked}
                name={'celular' as TFormName}
                type="tel"
                defaultValue={data?.celular}
                placeholder={checked ? text.form.phone.placeholder : undefined}
              />
           }
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.telephone.label} </span>
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Input
                required
                disabled={!checked}
                name={'telefono' as TFormName}
                type="tel"
                defaultValue={data?.telefono}
                placeholder={checked ? text.form.telephone.placeholder : undefined}
              />
           }
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.direction.label}</span>
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Input
                required
                disabled={!checked}
                name={'direccion' as TFormName}
                type="text"
                defaultValue={data?.direccion}
                placeholder={checked ? text.form.direction.placeholder : undefined}
              />
           }
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.ref.label}</span>
          <Suspense fallback={
            <Skeleton className='w-full h-10' />
          }>
          <Await promise={clientRes}>
            { () => <>
                <Input
                  disabled={!checked}
                  name={'referencia' as TFormName}
                  list='client-referent'
                  type="text"
                  defaultValue={ref?.fullName}
                  placeholder={checked ? text.form.ref.placeholder : undefined}
                />
                <datalist id='client-referent' >
                  { clientsList?.map( ( { fullName }, index ) => <option key={index} value={fullName} />) }
                </datalist>
           </>}
          </Await>
          </Suspense>
        </Label>
        <Label>
          <span>{text.form.comment.label}</span>
          <Suspense fallback={
            <Skeleton className='w-full h-28' />
          }>
          <Await promise={clientRes}>
            { (data) =>
              <Textarea
                rows={5}
                name={'comentarios' as TFormName}
                placeholder={text.form.comment.placeholder}
                defaultValue={data?.comentarios}
                disabled={!checked}
              />
           }
          </Await>
          </Suspense>
        </Label>
      </form>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
        <Suspense fallback={<>
          <Skeleton className='w-12 h-10' />
          <Skeleton className='w-16 h-10' />
        </>}>
        <Await promise={clientRes}>
          { () => <>
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
          </>}
       </Await>
       </Suspense>
        </div>
        <div className="space-x-2">
       <Suspense fallback={<>
          <Skeleton className='w-24 h-12 inline-block' />
          <Skeleton className='w-24 h-12 inline-block' />
        </>}>
        <Await promise={clientRes}>
          { () => <>
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
          </>}
       </Await>
       </Suspense>
        </div>
      </DialogFooter>
    </DialogContent>
    </>
  )
}

/* eslint-disable-next-line */
export function Error() {
  useEffect( () => {
    toast({
      title: text.error.title,
      description: <div className='flex flex-row gap-2 items-center'>
      <h2 className='font-bold text-2xl'>:&nbsp;(</h2>
      <p className='text-md'>  {text.error.descriiption} </p> 
    </div>,
      variant: 'destructive',
    })
  }, [] )
  return ;
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
    title: "Obtencion de datos de usuario",
    descriiption: "Ha ocurrido un error inesperado"
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
      "La actualizacion del cliente" + username + "ha fallado",
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
