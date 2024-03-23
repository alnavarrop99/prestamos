import { create } from 'zustand'

type TCLient = (typeof import('@/__mock__/CLIENTS.json'))[0]
interface TClientSelected {
  clients?: TCLient[]
  setClient: ({ clients }: { clients: TCLient[] }) => void
}

export const useClientSelected = create<TClientSelected>()((set) => ({
  setClient: ({ clients }) => set(() => ({ clients })),
}))

