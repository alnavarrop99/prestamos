import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { decodeJwt } from "jose"
import { TROLES } from "@/lib/type/rol";

type TRol = {
  rolId: number
  rolName: TROLES
}

type TToken = {
  token?: string, 
  name?: string, 
  rol?: TRol,
  userId?: number,
  setToken: ( token: string ) => void 
  setUserId: ( userId?: number ) => void 
  setRol: ( rol: TRol ) => void 
  deleteToken: ( ) => void 
}

export const useToken = create<TToken>()( persist((set) => ({
  setToken: ( token ) => set( () => ({ token, name: decodeJwt(token)?.sub } ) ),
  setUserId: ( userId ) => set( () => ({ userId }) ),
  setRol: ( rol ) => set( () => ({ rol }) ),
  deleteToken: ( ) => set( () => ({ token: undefined, name: undefined }) ),
  
}), { name: "token-auth" }))

