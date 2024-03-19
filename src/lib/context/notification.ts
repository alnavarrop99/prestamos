import { create } from "zustand";

export interface TNotification {
  action: "POST" | "PATH" | "DELETE"   
  description: string,
  date: Date
}

interface TNotificationContext {
  notifications?: TNotification[]
  setNotification: ( params: { notification: TNotification}  ) => void
}

export const useNotifications = create<TNotificationContext>()( (set) => ({
  setNotification: ( { notification } ) => set( ( { notifications } ) => {
    if( !notifications ) return { notifications: [ notification ] };
    return { notifications: [ ...notifications, notification ] }
  } ) 
}) )
