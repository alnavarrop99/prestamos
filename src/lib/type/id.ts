import { enumeradores as ids } from "@/mocks/__mock__/ID.json"
import { getId, gets } from "./base"

export type TID_TYPE = "Pasaporte" | "Cédula" | "Carnet de conducir" | "Cédula Extranjera" | "Nit" | "Tarjeta de identidad"
export type TID = {
  id: number
  nombre: TID_TYPE
  tipo_enumerador_id: number
}

type TGetIdById = (params: { id: number }) => TID
type TGetIdByName = (params: { idName: TID_TYPE }) => TID
type TListIds = () => TID[]

export const getIdById: TGetIdById = ({ id }) => getId( ids, { id } )
export const getIdByName: TGetIdByName = ({ idName }) => (ids?.find( ({ nombre }) => nombre === idName)) as TID
export const listIds: TListIds = () => gets( ids )

