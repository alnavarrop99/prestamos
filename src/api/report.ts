import { useToken } from "@/lib/context/login"

export type TREPORT_PARAMS_DATE_TYPE = 'str' | 'number' | 'date' | 'like'

// GET 
export type TREPORT_GET = {
  id: number
  nombre: string
  codigo: string
  comentario: string
  parametros: {
    id: number
    codigo: string
    nombre: string
    tipo_dato: TREPORT_PARAMS_DATE_TYPE
    obligatorio: boolean
  }[]
}

export type TREPORT_GET_ALL = TREPORT_GET[]

// POST 
export type TREPORT_POST = {
  error: string
  resultados: unknown[]
}

export type TREPORT_POST_BODY = {}

// FUNCTION TYPES 
type TGetAllReport = () => Promise<TREPORT_GET_ALL>
type TPostReportsById = ( params :{ code: string, report: TREPORT_POST_BODY } ) => Promise<TREPORT_POST>

// FUNCTION UTILS
export const typeDataByName = ( name: TREPORT_PARAMS_DATE_TYPE ) => ({ date: undefined, str: 'text', number: 'number', like: 'text' })[name]

// FUNCTION DEFINITIONS 
export const getAllReport: TGetAllReport = async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/reportes/list", {
    method: "GET",
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const postReportById: TPostReportsById = async ({ code, report }) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)
  headers.append("accept", "application/json")
  headers.append("Content-Type", "application/json")

  const res = await fetch(import.meta.env.VITE_API + "/reportes/obtener_reporte_by_codigo/" + code, {
    method: "POST",
    body: JSON.stringify(report),
    headers
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}
