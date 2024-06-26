import type { TPAYMENT_GET_BASE } from '@/api/payment'
import { useToken } from '@/lib/context/login'
import { format } from 'date-fns'

export type TCUOTE = {
  id: number
  numero_de_cuota: number
  fecha_de_pago: string
  fecha_de_aplicacion_de_mora: string
  valor_pagado: number
  valor_de_cuota: number,
  valor_de_mora: number,
  pagada: boolean,
  credito_id?: number,
}

export type TMORA = {
  id?: number
  tipo_enumerador_id?: number
  nombre: string
}

export type TFRECUENCY = {
  id?: number
  tipo_enumerador_id?: number
  nombre: string
}

type TPAYMNET = TPAYMENT_GET_BASE

// GET
export type TCREDIT_GET_BASE = {
  comentario: string
  cobrador_id: number
  fecha_de_aprobacion: string
  numero_de_cuotas: number
  tasa_de_interes: number
  monto: number
  estado: number
  frecuencia_del_credito_id?: number
  dias_adicionales: number
  tipo_de_mora_id?: number
  valor_de_mora: number
  id?: number,
  owner_id?: number,
  garante_id?: number | null
}

export type TCREDIT_GET = {
  comentario: string
  cobrador_id: number
  fecha_de_aprobacion: string
  numero_de_cuotas: number
  tasa_de_interes: number
  monto: number
  estado: number
  frecuencia_del_credito_id: number
  dias_adicionales: number
  tipo_de_mora_id: number
  valor_de_mora: number
  id: number,
  owner_id: number,
  garante_id?: number | null
  tipo_de_mora: TMORA
  frecuencia_del_credito: TFRECUENCY
  pagos: TPAYMNET[]
  cuotas: TCUOTE[]
}

export type TCREDIT_GET_ALL = TCREDIT_GET_BASE[]

export type TCREDIT_GET_FILTER = {
  // TODO: id and clientId is missing in the backend
  id: number
  clientId: number
  nombre_del_cliente: string
  fecha_de_cuota: string
  valor_de_cuota: number
  numero_de_cuota: number
  valor_de_la_mora: number
  frecuencia: TFRECUENCY
  cobrador_id: number
}

export type TCREDIT_GET_FILTER_ALL = TCREDIT_GET_FILTER[]

export type TCREDIT_GET_FILTER_BODY = {
  fecha_de_pago: string 
  saldo_por_pagar: boolean | null
  saldo_en_mora: boolean  | null
  cliente: string  | null
}

// POST
export type TCREDIT_POST = TCREDIT_GET_BASE

export type TCREDIT_POST_BODY = {
  comentario: string
  cobrador_id: number
  fecha_de_aprobacion: string
  numero_de_cuotas: number
  tasa_de_interes: number
  monto: number
  estado: number
  frecuencia_del_credito_id: number
  dias_adicionales: number
  tipo_de_mora_id: number
  valor_de_mora: number
  owner_id: number
  garante_id: number | null
}

// PATCH
export type TCREDIT_PATCH = TCREDIT_GET_BASE

export type TCREDIT_PATCH_BODY = {
  comentario?: string
  cobrador_id?: number
  fecha_de_aprobacion?: string
  numero_de_cuotas?: number
  tasa_de_interes?: number
  monto?: number
  estado?: number
  dias_adicionales?: number
  tipo_de_mora_id?: number
  valor_de_mora?: number
  frecuencia_del_credito_id?: number
  garante_id?: number | null
}

// DELETE
export type TCREDIT_DELETE = TCREDIT_GET_BASE

// FUNCTION TYPES
type TGetCreditById = (params: { params: { creditId: string } }) => Promise<TCREDIT_GET>
type TGetCreditsList = () => Promise<TCREDIT_GET_ALL>
type TGetCreditsFilter = ( params?: TCREDIT_GET_FILTER_BODY) => () => Promise<TCREDIT_GET_FILTER_ALL>
type TPostCredit = (params: TCREDIT_POST_BODY) => Promise<TCREDIT_POST>
type TDeleteCreditById = (params: { creditId: number }) => Promise<TCREDIT_DELETE>
type TPatchCreditById = (params: { creditId: number, updateCredit?: TCREDIT_PATCH_BODY }) => Promise<TCREDIT_PATCH>

// FUNCTION DEFINITIONS
export const getCreditById: TGetCreditById = async ({ params: { creditId} }) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/creditos/by_id/" + creditId,{
    method: "GET",
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const getCreditsList: TGetCreditsList =  async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/creditos/list",{
    method: "GET",
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const getCreditsFilter: TGetCreditsFilter = ( filter = { cliente: null, fecha_de_pago: format( new Date(2020,1,1), "yyyy-MM-dd" ), saldo_en_mora: null, saldo_por_pagar: null } ) => async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/creditos/filtrar_prestamos",{
    method: "POST",
    body: JSON.stringify(filter),
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const postCredit: TPostCredit =  async ( newCredit ) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/creditos/create",{
    method: "POST",
    body: JSON.stringify(newCredit),
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const deleteCreditById: TDeleteCreditById =  async ({ creditId }) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/creditos/delete/" + creditId,{
    method: "DELETE",
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const patchCreditsById: TPatchCreditById =  async ({ creditId, updateCredit }) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/creditos/" + creditId,{
    method: "PATCH",
    body: JSON.stringify(updateCredit),
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}
