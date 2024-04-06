import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { type TCREDIT_GET, deleteCreditById } from "@/api/credit";
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { _selectedCredit } from '@/pages/_layout/credit_/$creditId'
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/credit/$creditId/delete')({
  component: DeleteCreditById,
})

/* eslint-disable-next-line */
interface TDeleteCreditByIdProps {
  credit?: TCREDIT_GET
}

/* eslint-disable-next-line */
export function DeleteCreditById({ credit: _credit = {} as TCREDIT_GET }: TDeleteCreditByIdProps) {
  const [ credit ] = useContext(_selectedCredit) ?? [ _credit ]
  const [checked, setChecked] = useState(false)
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const { mutate: deleteCredit } = useMutation( {
    mutationKey: ["delete-credit"],
    mutationFn: deleteCreditById
  })

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler< React.ComponentRef< typeof Button > > = (ev) => {
    const description = text.notification.decription({
      // TODO
      username: ""+credit?.owner_id,
    })

    const action = (credit: TCREDIT_GET) => () => {
      console.table(credit)
      deleteCredit({ creditId: credit?.id })
      pushNotification({
        date: new Date(),
        action: "DELETE",
        description,
      })
    }

    const timer = setTimeout(action(credit), 6 * 1000)
    setOpen({open: !open})

    const onClick = () => {
      clearTimeout(timer)
    }

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

    ev.preventDefault()
  }

  return (
    <>
    { !open && <Navigate to={"../../"} replace />}
    <DialogContent className="max-w-xl">
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
                username: "" + credit?.owner_id 
              })}
            </AlertDescription>
          </Alert>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Checkbox
            id="confirmation"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="confirmation"
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
              className={clsx({ "hover:bg-destructive bg-destructive": checked })}
              variant="default"
              form="delete-credit"
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
