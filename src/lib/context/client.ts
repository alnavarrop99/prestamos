import { create } from 'zustand'

type TCLient = (typeof import('@/__mock__/CLIENTS.json'))[0]
interface TClient {
  clients?: TCLient[]
  setClient: ({ clients }: { clients: TCLient[] }) => void
}

export const useClientByUsers = create<TClient>()((set) => ({
  setClient: ({ clients }) => set(() => ({ clients })),
}))

