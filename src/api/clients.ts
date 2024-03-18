import { gets, getId } from "@/api/base"
import clients from "@/__mock__/CLIENTS.json"

export type TClient = typeof clients[0]
type TGetClientId = ( params: { clientId: number } ) => TClient 
type TGetClients = () => TClient[]
type TGetClientIdRes = ({params}: { params: { clientId: string } }) => Promise<TClient>
type TGetClientsRes = () => Promise<TClient[]>

export const getClientId: TGetClientId = ( {clientId} ) => getId( clients, { id: clientId } )
export const getClients: TGetClients = () => gets( clients )
export const getClientIdRes: TGetClientIdRes = async ({params: {clientId} }) => getClientId({ clientId: Number.parseInt(clientId) })
export const getClientsRes: TGetClientsRes =  async () => getClients()
