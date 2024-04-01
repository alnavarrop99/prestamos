import { Button } from '@/components/ui/button' 
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { useStatus } from '@/lib/context/layout'
import { deleteClientsById } from "@/api/clients"
import { _clientContext, _selectedClients } from "@/pages/_layout/client";
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { type TClientTable } from '@/pages/_layout/-column'

export const Route = createFileRoute('/_layout/client/delete')({
  component: DeleteSelectedClients,
})

/* eslint-disable-next-line */
interface TDeleteClientProps {
  clients?: TClientTable[]
}

/* eslint-disable-next-line */
export function DeleteSelectedClients({ clients: _clients = [] as TClientTable[] }: TDeleteClientProps) {
  const [checked, setChecked] = useState(false)
  const selectedclients = useContext(_selectedClients) ?? _clients
  const { open, setOpen } = useStatus()
  const { pushNotification: setNotification } = useNotifications()
  const navigate = useNavigate()
  const [ clients, setClients, resetRowSelection ] = useContext(_clientContext) ?? [[], (({})=>{}), (()=>{})]
  const { mutate: deleteClient } = useMutation({
    mutationKey: ["delete-client"],
    mutationFn: deleteClientsById
  })

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    const description = text.notification.decription({ length: selectedclients?.length })

    const action = (clients?: TClientTable[]) => () => {
      if(!clients?.length) return;
      for ( const { id } of clients ){
        deleteClient({ clientId: id })
      }
      setNotification({
          date: new Date(),
          action: "DELETE",
          description,
        })
    }

    const timer = setTimeout(action(selectedclients), 6 * 1000)
    setOpen({open: !open})
    navigate({ to: "../" })
    setClients( { clients: clients?.filter( ( { id } ) => !selectedclients?.map(({ id }) => id )?.includes(id) ) } )
    resetRowSelection()

    const onClick = () => {
      clearTimeout(timer)
      setClients({ clients })
    }

    if (true) {
      toast({
        title: text.notification.titile,
        description: description,
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
              {text.alert.description({ length: selectedclients?.length })}
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

DeleteSelectedClients.dispalyname = 'DeleteSelectedClients'

const text = {
  title: 'Eliminacion de clientes',
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
    decription: ({ length = 0 }: { length?: number }) =>
      'Se han eliminado ' + length + ' clientes con exito.',
    error: 'Error: la eliminacion de los clientes ha fallado',
    undo: 'Deshacer',
  },
}
