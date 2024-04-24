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
import { useState } from 'react'
import clsx from 'clsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type TCLIENT_GET_ALL, deleteClientsById } from '@/api/clients'
import { useToken } from '@/lib/context/login'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import { getClientListOpt } from '@/pages/_layout/client.lazy'

type TSearch = {
  name: string
}

export const deleteClientByIdOpt = {
  mutationKey: ['delete-client-by-id'],
  mutationFn: deleteClientsById,
}

export const Route = createFileRoute('/_layout/client/$clientId/delete')({
  component: DeleteClientById,
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
  const qClient = useQueryClient()

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

    const update: (data: TCLIENT_GET_ALL) => TCLIENT_GET_ALL = (data) => {
      const res = data
      return res?.filter(({ id }) => id !== +clientId)
    }

    qClient?.removeQueries({
      queryKey: getClientByIdOpt({ clientId })?.queryKey,
    })
    qClient?.setQueryData(getClientListOpt?.queryKey, update)
  }

  const onError: ((error: Error, variables: { clientId: number; }, context: unknown) => unknown) = (error) => {
    const errorMsg: {type: number, msg: string} = JSON.parse( error.message )

    toast({
      title: error.name + ": " + errorMsg?.type,
      description: (<div>
        <p>{ errorMsg?.msg as unknown as string }</p>
      </div>),
      variant: 'destructive',
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
          <DialogTitle className="text-start text-xl md:text-2xl">
            {text.title}
          </DialogTitle>
          <Separator />
          <DialogDescription>
            <Alert variant="destructive">
              <AlertCircle className="hidden h-4 w-4 md:block" />
              <AlertTitle className="text-start text-sm max-sm:!px-0 md:text-base">
                {text.alert.title}
              </AlertTitle>
              <AlertDescription className="text-start text-xs max-sm:!px-0 md:text-base">
                {text.alert.description({ username: name })}
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col !justify-between md:flex-row">
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

DeleteClientById.dispalyname = 'DeleteClientById'

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
