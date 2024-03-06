export type TClient = typeof import('@/__mock__/CLIENTS.json')[0]

type TGetClientId = ( params: { clientId: number } ) => Promise<TClient | undefined> 
export const getClientId: TGetClientId = async ( {clientId} ) => {
    try {
      const { default: list } = (await import('@/__mock__/CLIENTS.json'))

      return list?.find( ( { id } ) => id === clientId  )
    } catch (error) {
      return undefined;
    }
  }

type TGetClients = () => Promise<TClient[] | undefined>
export const getClients: TGetClients = async () => {
    try {
      const { default: list } = (await import('@/__mock__/CLIENTS.json'))
      return list 
    } catch (error) {
      return undefined;
    }
  }

