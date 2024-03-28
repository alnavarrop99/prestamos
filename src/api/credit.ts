import type { TPAYMENT_GET_ALL } from './payment'

// BASE
export interface TCREDIT_BASE {
  id: number
  comentario: string
  cobrador_id: number
  fecha_de_aprobacion: Date
  numero_de_cuotas: number
  tasa_de_interes: number
  monto: number
  estado: number
  frecuencia_del_credito_id: number
  dias_adicionales: number
  tipo_de_mora_id: number
  valor_de_mora: number
  owner_id: number
}

export interface TCREDIT_BASE_BODY {
  comentario?: string
  cobrador_id?: number
  fecha_de_aprobacion?: Date
  numero_de_cuotas?: number
  tasa_de_interes?: number
  monto?: number
  estado?: number
  frecuencia_del_credito_id?: number
  dias_adicionales?: number
  tipo_de_mora_id?: number
  valor_de_mora?: number
  owner_id?: number
}

export interface TCUOTES {
  id: number
  numero_de_cuota: number
  fecha_de_pago: Date
  fecha_de_aplicacion_de_mora?: Date
  valor_pagado: number
  valor_de_cuota: number,
  valor_de_mora: number,
  pagada: boolean,
  credito_id: number,
}

export interface TMORA {
  id: number
  tipo_enumerador_id: number
  nombre: string
}

export interface TFRECUENCY {
  id: number
  tipo_enumerador_id: number
  nombre: string
}

// GET BY ID
export interface TCREDIT_GET extends TCREDIT_BASE {
  nombre_del_cliente: string
  fecha_de_cuota: Date
  valor_de_cuota: number
  numero_de_cuota: number
  garante_id?: number
  frecuencia_del_credito: TFRECUENCY
  tipo_de_mora: TMORA
  pagos?: TPAYMENT_GET_ALL
  cuotas?: TCUOTES[]
}

// GET ALL
export type TCREDIT_GET_ALL = TCREDIT_BASE[]

// GET CUOTES
export type TCREDIT_GET_CUOTES_FOR_PAY = TCREDIT_BASE

// GET FILTERS
export interface TCREDIT_GET_FILTER {
  id: number
  cliente_id: number
  nombre_del_cliente: string
  fecha_de_cuota: Date
  valor_de_cuota: number
  numero_de_cuota: number
  numero_de_cuotas: number
  monto: number
  valor_de_la_mora: number
  frecuencia: TFRECUENCY
}

export interface TCREDIT_GET_FILTER_BODY {
  fecha_de_pago?: Date 
  saldo_por_pagar?: boolean
  saldo_en_mora?: boolean 
  cliente?: string 
}

export type TCREDIT_GET_FILTER_ALL = TCREDIT_GET_FILTER[]

// POST
export type TCREDIT_POST_BODY = Omit<TCREDIT_BASE, "id">

export interface TCREDIT_POST extends TCREDIT_BASE {
  garante_id:  number
  owner_id:  number 
}

// PATCH
export type TCREDIT_PATCH_BODY = TCREDIT_BASE_BODY
export type TCREDIT_PATCH = TCREDIT_BASE

// DELETE
export type TCREDIT_DELETE = TCREDIT_BASE

// FUNCTION TYPES
type TGetCreditById = (params: { params: { creditId: string } }) => Promise<TCREDIT_GET>
type TGetCredits = () => Promise<TCREDIT_GET_ALL>
type TGetCreditsFilter = ( params?: TCREDIT_GET_FILTER_BODY) => () => Promise<TCREDIT_GET_FILTER_ALL>
type TPostCredit = (params: TCREDIT_POST_BODY) => Promise<TCREDIT_POST>
type TDeleteCreditById = (params: { params: { creditId: string } }) => Promise<TCREDIT_DELETE>
type TPatchCreditById = (params: { params: { creditId: string, updateCredit: TCREDIT_PATCH_BODY } }) => Promise<TCREDIT_PATCH>

// FUNCTION DEFINITIONS
export const getCreditById: TGetCreditById = async ({ params: { creditId} }) => {
  const creditById = await fetch(import.meta.env.VITE_API + "/creditos/by_id/" + creditId,{
    method: "GET",
  })
  return creditById.json()
}

export const getCredits: TGetCredits =  async () => {
  const creditById = await fetch(import.meta.env.VITE_API + "/creditos/list",{
    method: "GET"
  })
  return creditById.json()
}

export const getCreditsFilter: TGetCreditsFilter = ( filter = {} ) => async () => {
  const creditById = await fetch(import.meta.env.VITE_API + "/creditos/filtrar_prestamos",{
    method: "POST",
    body: JSON.stringify(filter)
  })
  return creditById.json()
}

export const postCredit: TPostCredit =  async ( newCredit ) => {
  const creditById = await fetch(import.meta.env.VITE_API + "/creditos/create",{
    method: "POST",
    body: JSON.stringify(newCredit)
  })
  return creditById.json()
}

export const deleteCreditById: TDeleteCreditById =  async ({ params: { creditId } }) => {
const creditById = await fetch(import.meta.env.VITE_API + "/creditos/delete/" + creditId,{
    method: "DELETE",
  })
  return creditById.json()
}

export const patchCreditsById: TPatchCreditById =  async ({ params: { creditId, updateCredit } }) => {
  const creditById = await fetch(import.meta.env.VITE_API + "/creditos/" + creditId,{
    method: "PATCH",
    body: JSON.stringify(updateCredit)
  })
  return creditById.json()
}
