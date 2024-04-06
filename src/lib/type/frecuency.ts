import { enumeradores as frecuencys } from "@/mocks/__mock__/FRECUENCY.json"
import { gets, getId } from "./base"

export type TFRECUENCY_TYPE = "Semanal" | "Quincenal" | "Mensual" | "Diario"
export type TFRECUENCY = {
  id: number
  tipo_enumerador_id: number
  nombre: TFRECUENCY_TYPE
}

type TGetFrecuencyId = (params: { frecuencyId: number }) => TFRECUENCY
type TGetFrecuencyName = (params: { frecuencyName: TFRECUENCY_TYPE }) => TFRECUENCY
type TListFrecuencys = () => TFRECUENCY[]

export const getFrecuencyById: TGetFrecuencyId = ({ frecuencyId }) => getId( frecuencys, { id: frecuencyId } )
export const getFrecuencyByName: TGetFrecuencyName = ({ frecuencyName, }) => (frecuencys?.find( ({ nombre }) => (nombre === frecuencyName))) as TFRECUENCY
export const listFrecuencys: TListFrecuencys = () => gets( frecuencys )

