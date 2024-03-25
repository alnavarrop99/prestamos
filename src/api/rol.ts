import rols from "@/__mock__/ROLES.json"
import { getId, gets } from "./base"

export type TRoles = "Administrador" | "Usuario" | "Cobrador"
export type TRol = {
  id: number
  name: TRoles,
}

type TGetRolId = (params: { rolId: number }) => TRol
type TGetRolName = (params: { rolName: TRoles }) => TRol
type TGetRols = () => TRol[]
type TGetRolIdRes = ({params}: { params: { rolId: string } }) => Promise<TRol>
type TGetRolsRes = () => Promise<TRol[]>

export const getRolId: TGetRolId = ({ rolId, }) => getId( rols, { id: rolId } )
export const getRolName: TGetRolName = ({ rolName, }) => (rols?.find( ({ name }) => name === rolName) ?? rols?.[0]) as TRol
export const getRols: TGetRols = () => gets( rols )
export const getRolIdRes: TGetRolIdRes = async ({ params: { rolId }}) => getRolId({ rolId: Number.parseInt(rolId) })
export const getRolsRes: TGetRolsRes = async () => getRols()

