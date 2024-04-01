import ids from "@/mocks/__mock__/ID.json"
import { getId, gets } from "./base"

export type TTypeId = "Pasaporte" | "Cedula" | "Carnet de conducir"
export type TId = {
  id: number
  name: TTypeId,
}

type TGeIdById = (params: { id: number }) => TId
type TGetIdByName = (params: { idName: TTypeId }) => TId
type TGetIById = () => TId[]

export const getIdById: TGeIdById = ({ id }) => getId( ids, { id: id } )
export const getIdByName: TGetIdByName = ({ idName }) => (ids?.find( ({ name }) => name === idName) ?? ids?.[0]) as TId
export const getIDs: TGetIById = () => gets( ids )

