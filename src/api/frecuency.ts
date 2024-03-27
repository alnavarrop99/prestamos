import frecuency from "@/mocks/__mock__/FRECUENCY.json"
import { getId, gets } from "./base"

export type TFrecuencyType = "Semanal" | "Quincenal" | "Mensual" | "Anual"
export type TFrecuency = {
  id: number
  nombre: TFrecuencyType,
}

type TGetFrecuencyId = (params: { frecuencyId: number }) => TFrecuency
type TGetFrecuencyName = (params: { frecuencyName: TFrecuencyType }) => TFrecuency
type TGetFrecuencys = () => TFrecuency[]

export const getRolId: TGetFrecuencyId = ({ frecuencyId }) => getId( frecuency, { id: frecuencyId } )
export const getRolName: TGetFrecuencyName = ({ frecuencyName, }) => (frecuency?.find( ({ nombre }) => (nombre === frecuencyName)) ?? frecuency?.[0]) as TFrecuency
export const getRols: TGetFrecuencys = () => gets( frecuency )

