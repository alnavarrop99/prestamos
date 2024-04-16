import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TNotification {
  id: number
  action: 'POST' | 'PATH' | 'DELETE'
  description: string
  date: Date
}

interface TNotificationContext {
  notifications?: TNotification[]
  pushNotification: (params: Omit<TNotification, "id">) => void
  setNotifications: (params: TNotification[]) => void
  deleteNotificationById: (params: number) => void
  updateNotificationById: ( notificationId :{ notificationId: number } , params: TNotification) => void
}

export const useNotifications = create<TNotificationContext>()( persist( (set) => ({
  pushNotification: (notification) => set(({ notifications }) => ({ notifications: [ ...(notifications ?? []), { id: (notifications?.at(-1)?.id ?? 0) + 1, ...notification } ] })),
  setNotifications: ( notifications ) => set( ( ) => ({ notifications }) ),
  deleteNotificationById: ( notificationById ) => set( ( { notifications } ) => ({ notifications: notifications?.filter( ({ id }) => ( id !== notificationById ) ) })  ),
  updateNotificationById: ({ notificationId }, notification ) => set( ( { notifications } ) => ({ notifications: notifications?.map( ({ id }, i, list) => { 
    if( notificationId !== id ){
      return list?.[i]
    }
    return notification
  } ) })  )
}) , { name: "notification" } ))
