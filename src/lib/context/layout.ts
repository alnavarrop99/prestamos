import { create } from 'zustand'

interface TSearchContext {
  search?: boolean
  value?: string
  setSearch: ({ search }: { search: boolean }) => void
  setValue: ({ value }: { value: string }) => void
}

export const useRootStatus = create<TSearchContext>()((set) => ({
  search: undefined,
  value: undefined,
  setSearch: ({ search }) => set(() => ({ search })),
  setValue: ({ value }) => set(() => ({ value })),
}))
