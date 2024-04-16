import { Button } from '@/components/ui/button' 
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast, useToast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { type TCLIENT_DELETE  } from "@/api/clients"
import { _rowSelected } from "@/pages/_layout/client";
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { type TClientTable } from '@/pages/_layout/-column'
import { deleteClientByIdOpt } from "@/pages/_layout/client/$clientId/delete"

type TSearch = {
  clients: number[]
}

export const Route = createFileRoute('/_layout/client/delete')({
  component: DeleteSelectedClients,
  errorComponent: Error,
  validateSearch: ( search: TSearch ) => search
})

/* eslint-disable-next-line */
interface TDeleteClientProps {
  clients?: TClientTable[]
}

/* eslint-disable-next-line */
export function DeleteSelectedClients({}: TDeleteClientProps) {
  const [checked, setChecked] = useState(false)
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const { toast } = useToast()
  const { clients } = Route.useSearch()
  const rowSelected = useContext(_rowSelected)

  const onSuccess = ( data: TCLIENT_DELETE ) => {
    const description = text.notification.decription({
      username: data.nombres + ' ' + data.apellidos,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: "DELETE",
      description,
    })

    if( !rowSelected ) return;
    rowSelected()
  }

  const onError = () => {
    const description = text.notification.error
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

  const { mutate: deleteClient } = useMutation({
    ...deleteClientByIdOpt,
    onSuccess,
    onError
  })

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler< React.ComponentRef< typeof Button > > = (ev) => {
    if(!clients?.length) return;

    for ( const clientId of clients ){
      if(!clientId) continue;
      alert(clientId)
      deleteClient({ clientId })
    }

    setOpen({open: !open})

    ev.preventDefault()
  }

  if(!clients?.length) return;
  return (
    <>
    {!open && <Navigate to={"../"} replace />}
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{text.alert.title}</AlertTitle>
            <AlertDescription>
              {text.alert.description({ length: clients?.length })}
            </AlertDescription>
          </Alert>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Checkbox
            id="switch-updates-client"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="switch-updates-client"
            className={clsx('cursor-pointer')}
          >
            {text.button.checkbox}
          </Label>
        </div>
        <div
          className={clsx(
            'flex flex-col items-end gap-2 space-x-2 [&>*]:w-fit',
            {
              'flex-col-reverse': !checked,
              'flex-col': checked,
              '[&>*:last-child]:animate-pulse': !checked,
            }
          )}
        >
          <Button
            className={clsx({ "hover:bg-destructive bg-destructive": checked })}
            variant="default"
            form="delete-client"
            type="submit"
            disabled={!checked}
            onClick={onSubmit}
          >
            {text.button.delete}
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

DeleteSelectedClients.dispalyname = 'DeleteSelectedClients'
Error.dispalyname = 'DeleteSelectedClientsError'

const text = {
  title: 'Eliminacion de clientes',
  error: {
    title: "Obtencion de datos de usuario",
    descriiption: "Ha ocurrido un error inesperado"
  },
  alert: {
    title: 'Se eiminara multiples clientes de la base de datos',
    description: ({ length = 0 }: { length: number }) =>
      'Estas seguro de eliminar ' +
      length +
      ' cliente(s) de la basde de datos?. Esta accion es irreversible y se eliminaran todos los datos relacionados con los clientes seleccionados.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, elimina los clientes.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Eliminacion de multiples clientes',
    decription: ({ username }: { username: string }) =>
      'Se ha eliminado el cliente ' + username + ' con exito.',
    error: 'Error: la eliminacion de los clientes ha fallado',
    retry: 'Reintentar',
  },
}
