import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { TCLIENT_GET, deleteClientsById, getClientById } from '@/api/clients'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { _clientContext } from '../../client'

export const Route = createFileRoute('/_layout/client/$clientId/delete')({
  component: DeleteClientById,
  loader: getClientById,
})

/* eslint-disable-next-line */
interface TDeleteByClient {
  client?: TCLIENT_GET
}

/* eslint-disable-next-line */
export function DeleteClientById({ client: _client = {} as TCLIENT_GET }: TDeleteByClient) {
  const [checked, setChecked] = useState(false)
  const client = Route.useLoaderData() ?? _client
  const { nombres: firstName, apellidos: lastName } = client
  const { setOpen, open } = useStatus()
  const { pushNotification: setNotification } = useNotifications()
  const { mutate: deleteClient } = useMutation({
    mutationKey: ["delete-client-by-id"],
    mutationFn: deleteClientsById
  })
  const navigate = useNavigate()
  const [ clients, setClients ] = useContext(_clientContext) ?? [[], (({})=>{})]

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler<React.ComponentRef< typeof Button >> = (ev) => {
    if(!client) return;

    const description = text.notification.decription({
      username: firstName + ' ' + lastName,
    })

    const action = ({ ...props }: TCLIENT_GET) =>
      () => {
        deleteClient({ clientId: props?.id })
        setNotification( {
          date: new Date(),
          action: "DELETE",
          description,
        })
      }

    const timer = setTimeout(action(client), 6 * 1000)
    setOpen({ open: !open, })
    navigate({to: "../../"})
    setClients( { clients: clients?.filter( ( { id } ) => client?.id !== id ) } )

    const onClick = () => {
      clearTimeout(timer)
      setClients({ clients} )
    }

    if (true) {
      toast({
        title: text.notification.titile,
        description,
        variant: 'default',
        action: (
          <ToastAction altText="action from delete client">
            <Button variant="default" onClick={onClick}>
              {text.notification.undo}
            </Button>
          </ToastAction>
        ),
      })
    }

    ev.preventDefault()
  }


  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{text.alert.title}</AlertTitle>
            <AlertDescription>
              {text.alert.description({ username: firstName + ' ' + lastName })}
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
            className={clsx({'hover:bg-destructive bg-destructive': checked})}
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
              variant="secondary"
              className="font-bold hover:ring hover:ring-primary"
            >
              {text.button.close}
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

DeleteClientById.dispalyname = 'DeleteClientById'

const text = {
  title: 'Eliminacion del cliente',
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
    error: 'Error: la eliminacion de los datos del cliente ha fallado',
    undo: 'Deshacer',
  },
}
