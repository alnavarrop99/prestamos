import { create } from "zustand";
import { persist } from 'zustand/middleware'

type TToken = {
  token?: string, 
  setToken: ( token: string ) => void 
  deleteToken: ( ) => void 
}

export const useToken = create<TToken>()( persist((set) => ({
  setToken: ( token ) => set( () => ({ token }) ),
  deleteToken: ( ) => set( () => ({ token: undefined }) ),
}), { name: "token-auth" }))

