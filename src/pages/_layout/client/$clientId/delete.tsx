import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { deleteClientsById } from '@/api/clients'
import { useToken } from '@/lib/context/login'

type TSearch = {
  name: string
}

export const deleteClientByIdOpt = {
  mutationKey: ['delete-client-by-id'],
  mutationFn: deleteClientsById,
}

export const Route = createFileRoute('/_layout/client/$clientId/delete')({
  component: DeleteClientById,
  errorComponent: Error,
  validateSearch: (search: TSearch) => search,
  beforeLoad: () => {
    const { rol, userId } = useToken.getState()
    if (!userId || rol?.rolName !== 'Administrador')
      throw redirect({ to: '/client' })
  },
})

/* eslint-disable-next-line */
export function DeleteClientById() {
  const { name } = Route.useSearch()
  const { clientId } = Route.useParams()
  const [checked, setChecked] = useState(false)
  const { setOpen, open } = useStatus()
  const { pushNotification } = useNotifications()

  const onSuccess = () => {
    const description = text.notification.decription({
      username: name,
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

  const onError = () => {
    const description = text.notification.error({
      username: name,
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

  const { mutate: deleteClient } = useMutation({
    ...deleteClientByIdOpt,
    onSuccess,
    onError,
  })

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler<React.ComponentRef<typeof Button>> = (
    ev
  ) => {
    if (!name || !clientId || !checked) return

    deleteClient({ clientId: +clientId })

    setOpen({ open: !open })

    ev.preventDefault()
  }

  return (
    <>
      {!open && <Navigate to={'../../'} replace />}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-start text-xl md:text-2xl">{text.title}</DialogTitle>
          <Separator />
          <DialogDescription>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 hidden md:block" />
              <AlertTitle className='text-sm md:text-md text-start max-sm:!px-0'>{text.alert.title}</AlertTitle>
              <AlertDescription className='text-xs md:text-md text-start max-sm:!px-0'>
                {text.alert.description({ username: name })}
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!justify-between flex-col md:flex-row">
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
              className={clsx({
                'bg-destructive hover:bg-destructive': checked,
              })}
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
  useEffect(() => {
    toast({
      title: text.error.title,
      description: (
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-2xl font-bold">:&nbsp;(</h2>
          <p className="text-md"> {text.error.descriiption} </p>
        </div>
      ),
      variant: 'destructive',
    })
  }, [])
  return
}

DeleteClientById.dispalyname = 'DeleteClientById'
Error.dispalyname = 'DeleteClientByIdError'

const text = {
  title: 'Eliminacion del cliente',
  error: {
    title: 'Obtencion de datos de usuario',
    descriiption: 'Ha ocurrido un error inesperado',
  },
  alert: {
    title: 'Se eiminara el cliente de la base de datos',
    description: ({ username }: { username: string }) =>
      'Estas seguro de eliminar el cliente ' +
      username +
      '?. Esta accion es irreversible y se eliminaran todos los datos relacionados con el cliente.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, elimina el cliente.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Eliminacion del cliente',
    decription: ({ username }: { username: string }) =>
      'Se ha eliminado el cliente ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La eliminacion del cliente' + username + 'ha fallado',
    retry: 'Reintentar',
  },
}
