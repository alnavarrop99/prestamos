import installmants from "@/__mock__/INSTALLMANTS.json"
import { gets, getId } from "@/api/base"

export type TInstallmant = typeof installmants[0]
type TGetInstallmantId = (params: { installmantId: number }) => TInstallmant
type TGetInstallmants = () => TInstallmant[]
type TGetInstallmantIdRes = ({params}:{params: { installmantId: string }}) => Promise<TInstallmant>
type TGetInstallmantsRes = () => Promise<TInstallmant[]>

export const getInstallmantId: TGetInstallmantId = ({ installmantId, }) => getId( installmants, { id: installmantId } )
export const getInstallmants: TGetInstallmants = () => gets(installmants)
export const getInstallmantIdRes: TGetInstallmantIdRes = async ({params: { installmantId }}) => getInstallmantId({ installmantId: Number.parseInt(installmantId) })
export const getInstallmantsRes: TGetInstallmantsRes = async () => getInstallmants()

