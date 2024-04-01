import { useToken } from "@/lib/context/login"

export type TREPORT_PARAMS_DATE_TYPE = 'fecha' | 'texto' | 'numero' | 'like'

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
  }[]
}

export type TREPORT_GET_ALL = TREPORT_GET[]

// POST 
export type TREPORT_POST = {
  error: string
  resultado: string[]
}

export type TREPORT_POST_BODY = {}

// FUNCTION TYPES 
type TGetAllReport = () => Promise<TREPORT_GET_ALL>
type TPostReportsById = ( params :{ reportId: number, report: TREPORT_POST_BODY } ) => Promise<TREPORT_POST[]>

// FUNCTION UTILS
export const typeDataByName = ( name: 'fecha' | 'texto' | 'numero' | 'like') => ({ fecha: undefined, texto: 'text', numero: 'number', like: 'text' })[name]

// FUNCTION DEFINITIONS 
export const getAllReport: TGetAllReport = async () => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const res = await fetch(import.meta.env.VITE_API + "/reportes/list", {
    method: "GET",
    headers

  })
  return res.json()
}

export const postReportById: TPostReportsById = async ({ reportId, report }) => {
  const { token } = useToken.getState()
  if( !token ) throw new Error("not auth")
  const headers = new Headers()
  headers.append("Authorization","Bearer " +  token)

  const res = await fetch(import.meta.env.VITE_API + "/reportes/obtener_reporte_by_codigo/" + reportId, {
    method: "POST",
    body: JSON.stringify(report),
    headers
  })
  return res.json()
}
