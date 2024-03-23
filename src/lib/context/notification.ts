import { create } from 'zustand'

export interface TNotification {
  id?: number
  action: 'POST' | 'PATH' | 'DELETE'
  description: string
  date: Date
}

interface TNotificationContext {
  notifications?: TNotification[]
  setNotification: (params: TNotification) => void
}

export const useNotifications = create<TNotificationContext>()((set) => ({
  setNotification: ({ ...notification }) =>
    set(({ notifications }) => {
      if (!notifications) return { notifications: [notification] }
      return { notifications: [...notifications, { id: (notification?.id ?? 0) + 1,  ...notification }] }
    }),
}))
