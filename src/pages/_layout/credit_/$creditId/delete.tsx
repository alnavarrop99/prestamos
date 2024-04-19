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
import { useContext, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { deleteCreditById, type TCREDIT_GET_BASE } from '@/api/credit'
import { useNotifications } from '@/lib/context/notification'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { _credit } from '@/pages/_layout/credit_/$creditId'
import { Navigate } from '@tanstack/react-router'
import { queryClient } from '@/pages/__root'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import { useToken } from '@/lib/context/login'
import { redirect } from '@tanstack/react-router'

export const deleteCreditByIdOpt = {
  mutationKey: ['delete-credit-by-id'],
  mutationFn: deleteCreditById,
}

export const Route = createFileRoute('/_layout/credit/$creditId/delete')({
  component: DeleteCreditById,
  beforeLoad: () => {
    const { rol, userId } = useToken.getState()
    if (!userId || rol?.rolName !== 'Administrador')
      throw redirect({ to: '/credit' })
  },
})

/* eslint-disable-next-line */
export function DeleteCreditById() {
  const credit = useContext(_credit)
  const [checked, setChecked] = useState(false)
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const qClient = useQueryClient(queryClient)
  const { creditId } = Route.useParams()

  const onSuccess: (
    data: TCREDIT_GET_BASE,
    variables: { creditId: number },
    context: unknown
  ) => Promise<unknown> = async () => {
    const client = await qClient?.fetchQuery(
      queryOptions(getClientByIdOpt({ clientId: '' + credit?.owner_id }))
    )
    const description = text.notification.decription({
      username: client?.nombres + ' ' + client?.apellidos,
    })

    pushNotification({
      date: new Date(),
      action: 'DELETE',
      description,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })
  }
  const onError: (
    error: Error,
    variables: { creditId: number },
    context: unknown
  ) => Promise<unknown> = async () => {
    const client = await qClient?.fetchQuery(
      queryOptions(getClientByIdOpt({ clientId: '' + credit?.owner_id }))
    )
    const description = text.notification.error({
      username: client?.nombres + ' ' + client?.apellidos,
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

  const { mutate: deleteCredit } = useMutation({
    ...deleteCreditByIdOpt,
    onSuccess,
    onError,
  })

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler<React.ComponentRef<typeof Button>> = (
    ev
  ) => {
    if (!checked || !creditId) return
    deleteCredit({ creditId: +creditId })

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
              <AlertTitle className='text-sm md:text-base text-start max-sm:!px-0'>{text.alert.title}</AlertTitle>
              <AlertDescription className='text-xs md:text-base text-start max-sm:!px-0'>
                {text.alert.description({
                  // TODO
                  username: '' + credit?.owner_id,
                })}
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!justify-between flex-col md:flex-row">
          <div className="flex items-center gap-2 font-bold italic">
            <Checkbox
              id="confirmation"
              checked={checked}
              onCheckedChange={onCheckedChange}
            />
            <Label htmlFor="confirmation" className={clsx('cursor-pointer')}>
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
                className={clsx({
                  'bg-destructive hover:bg-destructive': checked,
                })}
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

DeleteCreditById.dispalyname = 'DeleteCreditById'

const text = {
  title: 'Eliminacion de un prestamo',
  alert: {
    title: 'Se eiminara el prestamo de la base de datos',
    description: ({ username }: { username: string }) =>
      'Estas seguro de eliminar prestamo del cliente ' +
      username +
      ' de la basde de datos?. Esta accion es irreversible y se eliminaran todos los datos relacionados con el prestamo.',
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
    error: ({ username }: { username: string }) =>
      'La eliminacion del prestamo del cliente ' + username + ' ha fallado',
    retry: 'Reintentar',
  },
}
