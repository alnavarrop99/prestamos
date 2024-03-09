import { createFileRoute } from '@tanstack/react-router'
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
import { useRef, useState } from 'react'
import styles from './new.module.css'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useClientStatus } from '@/lib/context/client'
import { TUserResponse, getUserId } from '@/api/users'


export const Route = createFileRoute('/_layout/user/$userId/delete')({
  component: DeleteUserById,
  loader: async ({ params: { userId } }) => getUserId({ userId: Number.parseInt(userId) }),
})

interface TDeleteByUser {
  user?: TUserResponse
}
export function DeleteUserById({ user: _user={} as TUserResponse }: TDeleteByUser) {
    const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const user = Route.useLoaderData() ?? _user
  const { nombre } = user
  const { setStatus, open } = useClientStatus()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if(!user) return;

    const action =
      ({ ...props }: TUserResponse) =>
      () => {
        console.table(props)
      }

    const timer = setTimeout(action(user), 6 * 1000)
    setStatus({ open: !open, })

    const onClick = () => {
      clearTimeout(timer)
    }

    if (true) {
      toast({
        title: text.notification.titile,
        description: text.notification.decription({
          username: nombre,
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
              {text.alert.description({ username: nombre })}
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
            className={clsx({'hover:bg-destructive': checked})}
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

DeleteUserById.dispalyname = 'DeleteUserById'

const text = {
  title: 'Eliminacion del usuario',
  alert: {
    title: 'Se eiminara el usuario de la base de datos',
    description: ({ username }: { username: string }) =>
      'Estas seguro de eliminar el usuario ' +
      username +
      '?. Esta accion es irreversible y se eliminaran todos los datos relacionados con el usuario.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, elimina el usuario.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Eliminacion del usuario',
    decription: ({ username }: { username: string }) =>
      'Se ha eliminado el usuario ' + username + ' con exito.',
    error: 'Error: la eliminacion de los datos del usuario ha fallado',
    undo: 'Deshacer',
  },
}
