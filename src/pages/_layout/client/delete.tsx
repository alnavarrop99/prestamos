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
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import styles from './new.module.css'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useClientSelected, useClientStatus } from '@/lib/context/client'
import { type TClient } from "@/api/clients"

export const Route = createFileRoute('/_layout/client/delete')({
  component: DeleteClient,
})

interface TDeleteClient {
  clients?: TClient[]
}

export function DeleteClient({ clients: _clients = [] as TClient[] }: TDeleteClient) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const { clients = _clients } = useClientSelected() 
  const { open, setStatus } = useClientStatus()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    const action = (clients?: TClient[]) => () => {
      console.table(clients)
    }


    const timer = setTimeout(action(clients), 6 * 1000)
    setStatus({open: !open})

    const onClick = () => {
      clearTimeout(timer)
    }

    if ( true) {
      toast({
        title: text.notification.titile,
        description: text.notification.decription({
          length: clients?.length,
        }),
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
              {text.alert.description({ length: clients?.length })}
            </AlertDescription>
          </Alert>
        </DialogDescription>
      </DialogHeader>

      <form
        autoComplete="on"
        ref={form}
        onSubmit={onSubmit}
        id="new-client-form"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-2 gap-3 gap-y-4 [&>label]:space-y-2',
          styles?.['custom-form'],
          {
            [styles?.['custom-form-off']]: !checked,
          }
        )}
      ></form>
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
            className={clsx({ "hover:bg-destructive": checked })}
            variant="default"
            form="new-client-form"
            type="submit"
            disabled={!checked}
          >
            {text.button.delete}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="font-bold hover:ring-1 hover:ring-primary"
            >
              {text.button.close}
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

DeleteClient.dispalyname = 'DeleteByClientId'

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
