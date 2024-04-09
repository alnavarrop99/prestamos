import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { decodeJwt } from "jose"

type TToken = {
  token?: string, 
  name?: string, 
  userId?: number,
  setToken: ( token: string ) => void 
  setUserId: ( userId?: number ) => void 
  deleteToken: ( ) => void 
}

export const useToken = create<TToken>()( persist((set) => ({
  setToken: ( token ) => set( () => ({ token, name: decodeJwt(token)?.sub } ) ),
  setUserId: ( userId ) => set( () => ({ userId }) ),
  deleteToken: ( ) => set( () => ({ token: undefined, name: undefined }) ),
  
}), { name: "token-auth" }))

