import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { decodeJwt } from "jose"

type TToken = {
  token?: string, 
  name?: string, 
  setToken: ( token: string ) => void 
  deleteToken: ( ) => void 
}

export const useToken = create<TToken>()( persist((set) => ({
  setToken: ( token ) => set( () => ({ token, name: decodeJwt(token)?.sub } ) ),
  deleteToken: ( ) => set( () => ({ token: undefined, name: undefined }) ),
}), { name: "token-auth" }))

