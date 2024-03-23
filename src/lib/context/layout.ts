import { create } from 'zustand'

interface TSearchContext {
  open: boolean
  search?: boolean
  value?: string
  setSearch: ({ search }: { search: boolean }) => void
  setValue: ({ value }: { value: string }) => void
  setOpen: ( {open}: { open: boolean } ) => void
}

export const useStatus = create<TSearchContext>()((set) => ({
  open: false,
  setSearch: ({ search }) => set(() => ({ search })),
  setValue: ({ value }) => set(() => ({ value })),
  setOpen: ( { open } ) => set(() => ({ open }))
}))

