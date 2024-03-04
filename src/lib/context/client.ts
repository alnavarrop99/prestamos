import { Row } from '@tanstack/react-table'
import { create } from 'zustand'

interface TSearchContext {
  open?: boolean
  setStatus: ({ open }: { open: boolean }) => void
}

export const useClientStatus = create<TSearchContext>()((set) => ({
  setStatus: ({ open }) => set(() => ({ open })),
}))

type TCLient = (typeof import('@/__mock__/mocks-clients.json'))[0]
interface TClientSelected {
  clients?: Row<TCLient>[]
  setClient: ({ clients }: { clients: Row<TCLient>[] }) => void
}

export const useClientSelected = create<TClientSelected>()((set) => ({
  setClient: ({ clients }) => set(() => ({ clients })),
}))
