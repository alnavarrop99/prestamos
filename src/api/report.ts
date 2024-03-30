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
    tipo_dato: 'fecha' | 'texto' | 'numero' | 'like'
  }[]
}

// POST 
export type TREPORT_POST = {
  error: string
  resultado: string[]
}

export type TREPORT_POST_BODY = {}

// FUNCTION TYPES 
type TGetAllReport = () => Promise<TREPORT_GET>
type TPostReportsById = ( params :{ reportId: number, report: TREPORT_POST_BODY } ) => Promise<TREPORT_POST[]>

// FUNCTION UTILS
export const geetTypeElementForm = ( type: 'fecha' | 'texto' | 'numero' | 'like') => ({ fecha: undefined, texto: 'text', numero: 'number', like: 'text' })[type]

// FUNCTION DEFINITIONS 
export const getAllReport: TGetAllReport = async () => {
  const res = await fetch(import.meta.env.VITE_API + "/reportes/list", {
    method: "GET"
  })
  return res.json()
}

export const postReportById: TPostReportsById = async ({ reportId, report }) => {
  const res = await fetch(import.meta.env.VITE_API + "/reportes/obtener_reporte_by_codigo/" + reportId, {
    method: "POST",
    body: JSON.stringify(report)
  })
  return res.json()
}
