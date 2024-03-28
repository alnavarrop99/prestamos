import moraTypes from "@/mocks/__mock__/MORA_TYPE.json"
import { getId, gets } from "./base"

export type TMORA_TYPE = "valor" | "porcentaje"
export type TFRECUENCY = {
  id: number
  nombre: TMORA_TYPE,
}

type TGetMoraTypeById = (params: { moraTypeId: number }) => TFRECUENCY
type TGetMoraTypeByName = (params: { moraTypeName: TMORA_TYPE }) => TFRECUENCY
type TGetMoraTypes = () => TFRECUENCY[]

export const getMoraTypeById: TGetMoraTypeById = ({ moraTypeId }) => getId( moraTypes, { id: moraTypeId } )
export const getMoraTypeByName: TGetMoraTypeByName = ({ moraTypeName, }) => (moraTypes?.find( ({ nombre }) => (nombre === moraTypeName)) ?? moraTypes?.[0]) as TFRECUENCY
export const getMoraTypes: TGetMoraTypes = () => gets( moraTypes )
