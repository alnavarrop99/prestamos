import { create } from 'zustand'

interface TSearchContext {
  open?: boolean
  setStatus: ({ open }: { open: boolean }) => void
}

export const useClientStatus = create<TSearchContext>()((set) => ({
  setStatus: ({ open }) => set(() => ({ open })),
}))
