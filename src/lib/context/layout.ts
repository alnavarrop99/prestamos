import { create } from 'zustand'

interface TStatus {
  open: boolean
  search?: boolean
  value?: string
  setSearch: ({ search }: { search: boolean }) => void
  setValue: ({ value }: { value: string }) => void
  setOpen: ( {open}: { open: boolean } ) => void
}

export const useStatus = create<TStatus>()((set) => ({
  open: false,
  setSearch: ({ search }) => set(() => ({ search })),
  setValue: ({ value }) => set(() => ({ value })),
  setOpen: ( { open } ) => set(() => ({ open }))
}))

