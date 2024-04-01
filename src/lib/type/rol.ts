import rols from "@/mocks/__mock__/ROLES.json"
import { getId, gets } from "./base"

export type TRoles = "Administrador" | "Usuario" | "Cobrador"
export type TRol = {
  id: number
  nombre: TRoles,
}

type TGetRolId = (params: { rolId: number }) => TRol
type TGetRolName = (params: { rolName: TRoles }) => TRol
type TGetRols = () => TRol[]

export const getRolById: TGetRolId = ({ rolId, }) => getId( rols, { id: rolId } )
export const getRolByName: TGetRolName = ({ rolName, }) => (rols?.find( ({ nombre }) => nombre === rolName) ?? rols?.[0]) as TRol
export const listRols: TGetRols = () => gets( rols )

