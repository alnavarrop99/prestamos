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
import { TUser } from '@/api/users'
import { _selectUsers } from "@/pages/_layout/user"
import { useNotifications } from '@/lib/context/notification'
import { useClientStatus } from '@/lib/context/client'

export const Route = createFileRoute('/_layout/user/delete')({
  component: DeleteSelectedUsers,
})

/* eslint-disable-next-line */
interface TDeleteSelectedUsersProps {
  users?: TUser[]
}

/* eslint-disable-next-line */
export function DeleteSelectedUsers({users: _users=[] as TUser[]}: TDeleteSelectedUsersProps) {
  const [checked, setChecked] = useState(false)
  const users = useContext(_selectUsers) ?? _users
  const { setNotification } = useNotifications()
  const { open, setStatus } = useClientStatus()
  const navigate = useNavigate()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    const description = text.notification.decription({
      length: users?.length,
    })
    const action = (clients?: TUser[]) => () => {
      console.table(clients)
      setNotification({
        notification: {
          date: new Date(),
          action: "DELETE",
          description,
        }
      })
    }

    const timer = setTimeout(action(users), 6 * 1000)

    setStatus({ open: !open })
    navigate({to: "../"})

    const onClick = () => {
      clearTimeout(timer)
    }

    if ( true) {
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
              {text.alert.description({ length: users?.length })}
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
            <Button
              className={clsx({ "bg-destructive hover:bg-destructive": checked })}
              variant="default"
              form="delete-user"
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

DeleteSelectedUsers.dispalyname = 'DeleteSelectedUsers'

const text = {
  title: 'Eliminacion de usuarios',
  alert: {
    title: 'Se eliminara multiples usuarios de la base de datos',
    description: ({ length = 0 }: { length: number }) =>
      'Estas seguro de eliminar ' +
      length +
      ' usuario(s) de la basde de datos?. Esta accion es irreversible y se eliminaran todos los datos relacionados con los usuarios seleccionados.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, elimina los usuarios.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Eliminacion de multiples usuarios',
    decription: ({ length = 0 }: { length?: number }) =>
      'Se han eliminado ' + length + ' usuarios con exito.',
    error: 'Error: la eliminacion de los usuarios ha fallado',
    undo: 'Deshacer',
  },
}
