import { enumeradores as satus } from "@/mocks/__mock__/STATUS.json"
import { getId, gets } from "./base"

export type TSTATUS_TYPE = "Activo" | "Inactivo"
export type TSTATUS = {
  id: number
  nombre: TSTATUS_TYPE
  tipo_enumerador_id: number
}

type TGeStatusById = (params: { statusId: number }) => TSTATUS
type TGetStatusByName = (params: { statusName: TSTATUS_TYPE }) => TSTATUS
type TListStatusyId = () => TSTATUS[]

export const getStatusById: TGeStatusById = ({ statusId }) => getId( satus, { id: statusId } )
export const getStatusByName: TGetStatusByName = ({ statusName }) => (satus?.find( ({ nombre }) => nombre === statusName)) as TSTATUS
export const listStatus: TListStatusyId = () => gets( satus )

