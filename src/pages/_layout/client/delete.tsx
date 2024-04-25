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
import { useToast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import clsx from 'clsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { type TCLIENT_GET_ALL, type TCLIENT_DELETE } from '@/api/clients'
import { _rowSelected, getClientListOpt } from '@/pages/_layout/client.lazy'
import { useNotifications } from '@/lib/context/notification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteClientByIdOpt } from '@/pages/_layout/client/$clientId/delete'
import { useToken } from '@/lib/context/login'
import { redirect } from '@tanstack/react-router'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import { delete_selected as text } from '@/assets/locale/client'

type TSearch = {
  clients: number[]
}

export const Route = createFileRoute('/_layout/client/delete')({
  component: DeleteSelectedClients,
  validateSearch: (search: TSearch) => search,
  beforeLoad: () => {
    const { rol, userId } = useToken.getState()
    if (!userId || rol?.rolName !== 'Administrador')
      throw redirect({ to: '/client' })
  },
})

/* eslint-disable-next-line */
export function DeleteSelectedClients() {
  const [checked, setChecked] = useState(false)
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const { toast } = useToast()
  const { clients } = Route.useSearch()
  const rowSelected = useContext(_rowSelected)
  const qClient = useQueryClient()

  const onSuccess = (data: TCLIENT_DELETE) => {
    const description = text.notification.decription({
      username: data.nombres + ' ' + data.apellidos,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: 'DELETE',
      description,
    })

    const update: (data: TCLIENT_GET_ALL) => TCLIENT_GET_ALL = (data) => {
      const res = data
      return res?.filter(({ id }) => !id || !clients?.includes(id))
    }

    for (const clientId of clients) {
      qClient?.removeQueries({
        queryKey: getClientByIdOpt({ clientId: '' + clientId })?.queryKey,
      })
    }
    qClient?.setQueryData(getClientListOpt?.queryKey, update)

    if (!rowSelected) return
    rowSelected()
  }

  const onError: (
    error: Error,
    variables: { clientId: number },
    context: unknown
  ) => unknown = (error) => {
    const errorMsg: { type: number; msg: string } = JSON.parse(error.message)

    toast({
      title: error.name + ': ' + errorMsg?.type,
      description: (
        <div className="text-sm">
          <p>{errorMsg?.msg}</p>
        </div>
      ),
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
    if (!clients?.length) return

    for (const clientId of clients) {
      if (!clientId) continue
      deleteClient({ clientId })
    }

    setOpen({ open: !open })

    ev.preventDefault()
  }

  if (!clients?.length) return
  return (
    <>
      {!open && <Navigate to={'../'} replace />}
      <DialogContent className="text-start text-xl md:max-w-xl">
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
                {text.alert.description({ length: clients?.length })}
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

DeleteSelectedClients.dispalyname = 'DeleteSelectedClients'
