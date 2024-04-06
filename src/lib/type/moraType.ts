import { enumeradores as moraTypes } from "@/mocks/__mock__/MORA_TYPE.json"
import { getId, gets } from "./base"

export type TMORA_TYPE = "Valor fijo" | "Porciento"
export type TFRECUENCY = {
  id: number
  tipo_enumerador_id: number
  nombre: TMORA_TYPE
}

type TGetMoraTypeById = (params: { moraTypeId: number }) => TFRECUENCY
type TGetMoraTypeByName = (params: { moraTypeName: TMORA_TYPE }) => TFRECUENCY
type TListMoraTypes = () => TFRECUENCY[]

export const getMoraTypeById: TGetMoraTypeById = ({ moraTypeId }) => getId( moraTypes, { id: moraTypeId } )
export const getMoraTypeByName: TGetMoraTypeByName = ({ moraTypeName, }) => (moraTypes?.find( ({ nombre }) => (nombre === moraTypeName))) as TFRECUENCY
export const listMoraTypes: TListMoraTypes = () => gets( moraTypes )
