import rols from "@/__mock__/ROLES.json"
import { getId, gets } from "./base"

export type TPayment = typeof rols[0]
type TGetRolId = (params: { rolId: number }) => TPayment
type TGetRols = () => TPayment[]
type TGetRolIdRes = ({params}: { params: { rolId: string } }) => Promise<TPayment>
type TGetRolsRes = () => Promise<TPayment[]>

export const getRolId: TGetRolId = ({ rolId, }) => getId( rols, { id: rolId } )
export const getRols: TGetRols = () => gets( rols )
export const getRolIdRes: TGetRolIdRes = async ({ params: { rolId }}) => getRolId({ rolId: Number.parseInt(rolId) })
export const getRolsRes: TGetRolsRes = async () => getRols()

