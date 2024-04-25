import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useNotifications } from '@/lib/context/notification'
import { useStatus } from '@/lib/context/layout'
import { _selectUsers } from '@/pages/_layout/user.lazy'
import { delete_multiple as text } from "@/locale/user";

export const Route = createFileRoute('/_layout/user/delete')({
  component: DeleteSelectedUsers,
})

/* eslint-disable-next-line */
export function DeleteSelectedUsers() {
  const [checked, setChecked] = useState(false)
  const selectUsers = useContext(_selectUsers)
  const { pushNotification } = useNotifications()
  const { open, setOpen } = useStatus()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler< React.ComponentRef< typeof Button > > = (ev) => {
    const description = text.notification.decription({
      length: selectUsers?.length,
    })

    pushNotification({
      date: new Date(),
      action: "DELETE",
      description,
    })

    setOpen({ open: !open })

    const onClick = () => {}

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
      action: (
        <ToastAction altText="action from delete client" onClick={onClick}>
            {text.notification.retry}
        </ToastAction>
      ),
    })

    ev.preventDefault()
  }

  return (
    <>
    {!open && <Navigate to={"../"} replace />}
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-start text-xl md:text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 hidden md:block" />
            <AlertTitle className='text-sm md:text-base text-start max-sm:!px-0'>{text.alert.title}</AlertTitle>
            <AlertDescription className='text-xs md:text-base text-start max-sm:!px-0'>
              {text.alert.description({ length: selectUsers?.length })}
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

DeleteSelectedUsers.dispalyname = 'DeleteSelectedUsers'
