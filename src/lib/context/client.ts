import { Row } from '@tanstack/react-table'
import { create } from 'zustand'

type TFilter = keyof (typeof import('@/__mock__/mocks-clients.json'))[0]
interface TStatusProps {
  open?: boolean
  filter?: TFilter
}
interface TStatus extends TStatusProps {
  setStatus: ({ open, filter }: { open?: boolean; filter?: TFilter }) => void
}

export const useClientStatus = create<TStatus>()((set) => ({
  setStatus: (state) =>
    set(({ open, filter }) => ({ open, filter: filter, ...state })),
}))

type TCLient = (typeof import('@/__mock__/mocks-clients.json'))[0]
interface TClientSelected {
  clients?: Row<TCLient>[]
  setClient: ({ clients }: { clients: Row<TCLient>[] }) => void
}

export const useClientSelected = create<TClientSelected>()((set) => ({
  setClient: ({ clients }) => set(() => ({ clients })),
}))
