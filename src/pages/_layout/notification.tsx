import { Separator } from '@radix-ui/react-separator'
import { createFileRoute } from '@tanstack/react-router'
import { useNotifications, type TNotification } from "@/lib/context/notification";
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Cross, Zap } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute('/_layout/notification')({
  component: Notifications,
})

/* eslint-disable-next-line */
interface TNotificationProps {
  notifications?: TNotification[]
}

/* eslint-disable-next-line */
export function Notifications({ notifications: _notifications = [] as TNotification[] }: TNotificationProps) {
  const { notifications } = useNotifications( ({ notifications }) => ({ notifications: notifications ?? _notifications }) )
  return (
    <div className='space-y-2'>
      <h1 className="text-3xl font-bold">{text.title}</h1>
      <Separator />
      { !notifications?.length && <p> {text.notfound} </p> }
      { !!notifications?.length && notifications?.map( ({ id, description, action, date }) => 
        <Card key={id} className={clsx('!m-4 space-y-2 p-8 ring-2', {
            "ring-green-500": action === "POST",
            "ring-blue-500": action === "PATH",
            "ring-red-500": action === "DELETE",
          })}>
          <CardTitle className='flex items-center gap-4'> <ActionIcon action={action} />  {getAction(action)} </CardTitle>
          <CardDescription> <p>{description}</p> </CardDescription>
          <div className='flex justify-end'><Badge>{format(date, "dd-MM-yyyy")}</Badge></div>
        </Card> 
      ) }
    </div>
  )
}

/* eslint-disable-next-line */
export function ActionIcon({ action }: {action: "POST" | "PATH" | "DELETE"}) {
  if( action ===   "DELETE") return <Cross className='rotate-45 stroke-red-500 ring-2 ring-red-500 rounded-full' />;
  if( action ===   "PATH") return <Zap className='stroke-blue-500 ring-2 ring-blue-500 rounded-full' />;
  if( action ===   "POST") return <Cross className='stroke-green-500 ring-2 ring-green-500 rounded-full' />;
  return <Zap />
}

const getAction = (action: "POST" | "PATH" | "DELETE") => {
  if( action ===   "DELETE") return "Eliminacion";
  if( action ===   "PATH") return "Actualizacion";
  if( action ===   "POST") return "Creacion";
  return ""
}

Notifications.dispalyname = 'Notification'

const text = {
  title: 'Notificaciones:',
  notfound: 'No existen notificaciones.',
}
