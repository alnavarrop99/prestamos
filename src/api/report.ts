import reports from '@/__mock__/REPORT.json'
import { getId, gets } from './base'

export type TReport = {
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

type TGetReportId = (params: { reportId: number }) => TReport
type TGetReports = () => TReport[]
type TGetReportIdRes = ({
  params,
}: {
  params: { reportId: string }
}) => Promise<TReport>
type TGetReportsRes = () => Promise<TReport[]>

export const getReportId: TGetReportId = ({ reportId }) =>
  getId(reports, { id: reportId })
export const getReports: TGetReports = () => gets(reports)
export const getReportIdRes: TGetReportIdRes = async ({
  params: { reportId },
}) => getReportId({ reportId: Number.parseInt(reportId) })
export const getReportsRes: TGetReportsRes = async () => getReports()
export const getTypeElementForm = (
  type: 'fecha' | 'texto' | 'numero' | 'like'
) => ({ fecha: undefined, texto: 'text', numero: 'number', like: 'text' })[type]
