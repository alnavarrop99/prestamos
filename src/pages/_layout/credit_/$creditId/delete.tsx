import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useClientStatus } from '@/lib/context/client'
import { getCreditIdRes, type TCredit } from "@/api/credit";

export const Route = createFileRoute('/_layout/credit/$creditId/delete')({
  component: DeleteCreditById,
  loader: getCreditIdRes
})

/* eslint-disable-next-line */
interface TDeleteCreditByIdProps {
  credit?: TCredit
}

/* eslint-disable-next-line */
export function DeleteCreditById({ credit: _credit = {} as TCredit }: TDeleteCreditByIdProps) {
  const [checked, setChecked] = useState(false)
  const credit = Route.useLoaderData() ?? _credit
  const { open, setStatus } = useClientStatus()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    const action = (credit?: TCredit) => () => {
      console.table(credit)
    }

    const timer = setTimeout(action(credit), 6 * 1000)
    setStatus({open: !open})

    const onClick = () => {
      clearTimeout(timer)
    }

    if (true) {
      toast({
        title: text.notification.titile,
        description: text.notification.decription({
          // TODO
          username: "Armando Navarro",
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
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{text.alert.title}</AlertTitle>
            <AlertDescription>
              {text.alert.description({ 
                // TODO
                username: "Armando Navarro" 
              })}
            </AlertDescription>
          </Alert>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Checkbox
            id="checkbox-delete-credit"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="checkbox-delete-credit"
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
          <DialogClose asChild>
            <Button
              className={clsx({ "hover:bg-destructive": checked })}
              variant="default"
              form="delete-credit-by-id"
              type="submit"
              disabled={!checked}
              onClick={onSubmit}
            >
              {text.button.delete}
            </Button>
          </DialogClose>
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

DeleteCreditById.dispalyname = 'DeleteCreditById'

const text = {
  title: 'Eliminacion de un prestamo',
  alert: {
    title: 'Se eiminara el prestamo de la base de datos',
    description: ({ username }: { username: string }) =>
      'Estas seguro de eliminar prestamo del cliente ' + username + ' de la basde de datos?. Esta accion es irreversible y se eliminaran todos los datos relacionados con el prestamo.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, elimina el prestamo.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Eliminacion de un credito',
    decription: ({ username }: { username?: string }) =>
      'Se ha eliminado prestamo del cliente ' + username + ' con exito.',
    error: 'Error: la eliminacion del prestamo ha fallado',
    undo: 'Deshacer',
  },
}
