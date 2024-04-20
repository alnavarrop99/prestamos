import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { useNotifications } from '@/lib/context/notification'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { X as Close, Cross, Zap } from 'lucide-react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

export const Route = createFileRoute('/_layout/notification')({
  component: Notifications,
})

/* eslint-disable-next-line */
export function Notifications() {
  const { notifications, deleteNotificationById } = useNotifications()

  useEffect(() => {
    document.title = import.meta.env.VITE_NAME + ' | ' + text.browser
  }, [])

  const onDelete: (index: number) => React.MouseEventHandler<HTMLSpanElement> =
    (index) => () => {
      const notification = notifications?.[index]
      if (!notification || !notification?.id) return
      deleteNotificationById(notification.id)
    }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">{text.title}</h1>
        {!!notifications?.length && (
          <Badge className="px-3 text-xl"> {notifications?.length} </Badge>
        )}
      </div>
      <Separator />
      <div className="space-y-4 py-2 md:space-y-4">
        {!notifications?.length && <p> {text.notfound} </p>}
        {!!notifications?.length &&
          notifications?.reverse()?.map(
            ({ id: notificationId, description, action, date }, index) =>
              notificationId && (
                <Card
                  key={index}
                  className={clsx('shadow-lg ring-2', {
                    'ring-green-500': action === 'POST',
                    'ring-blue-500': action === 'PATH',
                    'ring-red-500': action === 'DELETE',
                  })}
                >
                  <CardHeader>
                    <span
                      onClick={onDelete(index)}
                      className="[&>svg]:dalay-150 ms-auto cursor-pointer rounded-full p-1 transition delay-150 duration-300 hover:bg-destructive [&>svg]:stroke-destructive [&>svg]:transition [&>svg]:duration-300 [&>svg]:hover:stroke-secondary"
                    >
                      <Close className="p-1" />
                    </span>
                    <CardTitle className="flex items-center gap-2 md:gap-4">
                      {' '}
                      <ActionIcon action={action} /> {getAction(action)}{' '}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      {' '}
                      <p>{description}</p>{' '}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-end">
                    <div>
                      <Badge>{format(date, 'dd-MM-yyyy')}</Badge>
                    </div>
                  </CardFooter>
                </Card>
              )
          )}
      </div>
    </div>
  )
}

/* eslint-disable-next-line */
export function ActionIcon({ action }: { action: 'POST' | 'PATH' | 'DELETE' }) {
  if (action === 'DELETE')
    return (
      <Cross className="rotate-45 rounded-full stroke-red-500 ring-2 ring-red-500" />
    )
  if (action === 'PATH')
    return <Zap className="rounded-full stroke-blue-500 ring-2 ring-blue-500" />
  if (action === 'POST')
    return (
      <Cross className="rounded-full stroke-green-500 ring-2 ring-green-500" />
    )
  return <Zap />
}

const getAction = (action: 'POST' | 'PATH' | 'DELETE') => {
  if (action === 'DELETE') return 'Eliminacion'
  if (action === 'PATH') return 'Actualizacion'
  if (action === 'POST') return 'Creacion'
  return ''
}

Notifications.dispalyname = 'Notification'

const text = {
  title: 'Notificaciones:',
  browser: 'Notificaciones',
  notfound: 'No existen notificaciones.',
}
