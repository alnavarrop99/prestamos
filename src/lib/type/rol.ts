import { enumeradores as roles } from "@/mocks/__mock__/ROLES.json"
import { getId, gets } from "./base"

export type TROLES = "Administrador" | "Usuario" | "Cobrador"
export type TROL = {
  id: number
  tipo_enumerador_id: number
  nombre: TROLES
}

type TGetRolId = (params: { rolId: number }) => TROL
type TGetRolName = (params: { rolName: TROLES }) => TROL
type TListRols = () => TROL[]

export const getRolById: TGetRolId = ({ rolId, }) => getId( roles, { id: rolId } )
export const getRolByName: TGetRolName = ({ rolName, }) => (roles?.find( ({ nombre }) => nombre === rolName) ?? roles?.[0]) as TROL
export const listRols: TListRols = () => gets( roles )

