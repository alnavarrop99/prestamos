import { TClientTable } from '@/pages/_layout/-column'
import { create } from 'zustand'

interface TClientByUsers {
  clients?: TClientTable[]
  setClient: ({ clients }: { clients: TClientTable[] }) => void
}

export const useClientByUsers = create<TClientByUsers>()((set) => ({
  setClient: ({ clients }) => set(() => ({ clients })),
}))

