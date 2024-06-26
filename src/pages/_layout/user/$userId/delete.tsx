import { Navigate, createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useState } from 'react'
import clsx from 'clsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useNotifications } from '@/lib/context/notification'
import { useStatus } from '@/lib/context/layout'
import { useToken } from '@/lib/context/login'
import { delete_by_id as text } from "@/locale/user";

type TSearch = {
  name: string
}

export const Route = createFileRoute('/_layout/user/$userId/delete')({
  component: DeleteUserById,
  validateSearch: ( search: TSearch ) => (search as TSearch),
})

/* eslint-disable-next-line */
export function DeleteUserById() {
  const [checked, setChecked] = useState(false)
  const { name } = Route.useSearch()
  const { userId } = Route.useParams()
  const { pushNotification } = useNotifications()
  const { open, setOpen } = useStatus()
  const { userId: currentUserId, deleteToken } = useToken()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if(!userId) return;

    const description = text.notification.description({
      username: name,
    })

    pushNotification({
      date: new Date(),
      action: "DELETE",
      description,
    })
  
    setOpen({ open: !open })

    toast({
      title: text.notification.title,
      description,
      variant: 'default',
    })

    if( +userId === currentUserId ){
      deleteToken()
      throw redirect({ to: "/" })
    }

    ev.preventDefault()
  }

  return (
    <>
    { !open && <Navigate to={"../../"} replace />}
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-start text-xl md:text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 hidden md:block" />
            <AlertTitle className='text-sm md:text-base text-start max-sm:!px-0'>{text.alert.title}</AlertTitle>
            <AlertDescription className='text-xs md:text-base text-start max-sm:!px-0'>
              {text.alert.description({ username: name })}
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
              className={clsx({'bg-destructive hover:bg-destructive': checked})}
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

DeleteUserById.dispalyname = 'DeleteUserById'
