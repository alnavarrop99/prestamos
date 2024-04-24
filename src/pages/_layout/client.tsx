import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Annoyed, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import React, { createContext, useEffect, useState } from 'react'
import {
  Outlet,
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useStatus } from '@/lib/context/layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type TCLIENT_GET_ALL, getClientsList } from '@/api/clients'
import clsx from 'clsx'
import { desktop, movile, type TClientTable } from '@/pages/_layout/-column'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { queryClient } from '@/pages/__root'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useToken } from '@/lib/context/login'
import { ClientTable } from './-table'
import { useScreen } from '@/lib/hook/useScreens'

type TSearch = {
  userId: number
}

export const getClientListOpt = {
  queryKey: ['list-clients'],
  queryFn: getClientsList,
}

export const Route = createFileRoute('/_layout/client')({
  component: Clients,
  pendingComponent: Pending,
  errorComponent: Error,
  loader: () => queryClient.ensureQueryData(queryOptions(getClientListOpt)),
  validateSearch: (search: TSearch) => search,
})

const ROW = 13
const COL = 7
export const _clientContext = createContext<TClientTable[] | undefined>(
  undefined
)
export const _rowSelected = createContext<(() => void) | undefined>(undefined)
export const useFilter = create<{
  filter: keyof TClientTable
  setFilter: (value: keyof TClientTable) => void
}>()(
  persist(
    (set) => ({
      filter: 'fullName',
      setFilter: (filter) => set(() => ({ filter })),
    }),
    { name: 'client-filter' }
  )
)

/* eslint-disable-next-line */
export function Clients() {
  const { rol, userId } = useToken()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { open, setOpen, value } = useStatus()
  const navigate = useNavigate()
  const { filter, setFilter } = useFilter()
  const { userId: ownerId } = Route.useSearch()
  const screen = useScreen()

  const select: (data: TCLIENT_GET_ALL) => TClientTable[] = (data) => {
    const clients = data?.map<TClientTable>(
      ({ nombres, apellidos, referencia_id, ...props }, _, list) => {
        const ref = list?.find(
          ({ id: referenciaId }) => referenciaId === referencia_id
        )
        if (!ref || !referencia_id) {
          return {
            ...props,
            fullName: nombres + ' ' + apellidos,
            referencia: '',
          }
        }
        return {
          ...props,
          fullName: nombres + ' ' + apellidos,
          referencia: ref.nombres + ' ' + ref.apellidos,
        }
      }
    )
    if (ownerId) return clients?.filter(({ owner_id }) => owner_id === ownerId)
    if (userId && rol?.rolName !== 'Administrador')
      return clients?.filter(({ owner_id }) => owner_id === userId)
    return clients
  }
  const { data: clientsRes } = useSuspenseQuery(
    queryOptions({ ...getClientListOpt, select })
  )

  useEffect(() => {
    document.title = import.meta.env.VITE_NAME + ' | ' + text.browser
  }, [])

  const table = useReactTable({
    data: clientsRes,
    columns: screen !== 'lg' ? movile : desktop,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(() => {
    table.getColumn(filter)?.setFilterValue(value)
  }, [value, filter])

  const onOpenChange: (open: boolean) => void = (open) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const onValueChange = (value: string) => {
    setFilter(value as keyof TClientTable)
    table.resetRowSelection()
  }

  return (
    <_clientContext.Provider value={clientsRes}>
      <_rowSelected.Provider value={table.resetRowSelection}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold md:text-3xl">{text.title}</h1>
            {!!clientsRes?.length && (
              <Badge className="px-3 text-lg md:text-xl">
                {table.getFilteredRowModel().rows.length}
              </Badge>
            )}
            <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogTrigger asChild className="ms-auto">
                <Link to={'./new'}>
                  <Button variant="default">{text.buttons.new}</Button>
                </Link>
              </DialogTrigger>
              {!!userId && rol?.rolName === 'Administrador' && (
                <DialogTrigger asChild>
                  <Link
                    disabled={!table.getFilteredSelectedRowModel().rows?.length}
                    to={'./delete'}
                    search={{
                      clients: table
                        .getFilteredSelectedRowModel()
                        ?.rows?.map(({ original }) => original.id),
                    }}
                  >
                    <Button
                      className={clsx({
                        'bg-destructive hover:bg-destructive':
                          table.getFilteredSelectedRowModel().rows?.length,
                      })}
                      disabled={
                        !table.getFilteredSelectedRowModel().rows?.length
                      }
                    >
                      {text.buttons.delete}
                    </Button>
                  </Link>
                </DialogTrigger>
              )}
              <Outlet />
            </Dialog>
          </div>
          <Separator />
          <div>
            <div className="flex items-center gap-2 py-4">
              {!!table.getRowCount() && (
                <p className="hidden text-sm text-muted-foreground xl:block">
                  {text.search.selected({
                    selected: table.getFilteredSelectedRowModel().rows.length,
                    total: table.getFilteredRowModel().rows.length,
                  })}
                </p>
              )}
              <Select value={filter} onValueChange={onValueChange}>
                <SelectTrigger
                  title="Filtro de busqueda"
                  className="ms-auto hidden w-auto xl:flex"
                >
                  <SelectValue placeholder={text.select.placeholder} />
                </SelectTrigger>
                <SelectContent className="z-10 [&>div]:cursor-pointer">
                  <SelectItem
                    value={'fullName' as keyof TClientTable}
                    className="cursor-pointer"
                  >
                    {text.select.items.fullName}
                  </SelectItem>
                  <SelectItem
                    value={'numero_de_identificacion' as keyof TClientTable}
                    className="cursor-pointer"
                  >
                    {text.select.items.id}
                  </SelectItem>
                  <SelectItem
                    value={'direccion' as keyof TClientTable}
                    className="cursor-pointer"
                  >
                    {text.select.items.direction}
                  </SelectItem>
                  <SelectItem
                    value={'celular' as keyof TClientTable}
                    className="cursor-pointer"
                  >
                    {text.select.items.phone}
                  </SelectItem>
                  <SelectItem
                    value={'telefono' as keyof TClientTable}
                    className="cursor-pointer"
                  >
                    {text.select.items.telephone}
                  </SelectItem>
                  <SelectItem
                    value={'referencia' as keyof TClientTable}
                    className="cursor-pointer"
                  >
                    {text.select.items.ref}
                  </SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden xl:flex">
                  <Button variant="outline">
                    {text.dropdown.title}{' '}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        className="cursor-pointer capitalize"
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {getMenuItem(column.id)}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-xl bg-background ring-2 ring-border">
              <ClientTable table={table} />
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="hover:ring hover:ring-primary"
                >
                  {text.buttons.prev}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {text.buttons.next}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </_rowSelected.Provider>
    </_clientContext.Provider>
  )
}

/* eslint-disable-next-line */
export function Pending() {
  const { rol } = useToken()
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24 md:w-36" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="ms-auto h-10 w-20 md:w-24" />
        {rol?.rolName === 'Administrador' && (
          <Skeleton className="h-10 w-20 md:w-24" />
        )}
      </div>
      <Separator />
      <div className="flex items-center gap-2">
        {rol?.rolName === 'Administrador' && (
          <Skeleton className="hidden h-6 md:w-56 xl:block" />
        )}
        <Skeleton className="ms-auto hidden h-8 w-32 xl:block" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="px-4">
        <table className="hidden w-full border-separate border-spacing-2 divide-y-2 rounded-xl bg-background ring-2 ring-muted xl:table">
          {Array.from({ length: ROW })?.map((_, row) => (
            <tr key={row}>
              {Array.from({ length: COL })?.map((_, index) => {
                if (rol?.rolName !== 'Administrador' && index === 0) return
                return (
                  <td
                    key={index}
                    className={clsx('last:w-16', { 'first:w-12': index === 0 })}
                  >
                    {' '}
                    <Skeleton className={clsx('h-9 w-full')} />{' '}
                  </td>
                )
              })}
            </tr>
          ))}
        </table>

        <div className="divide-y-2 rounded-xl ring-2 ring-muted xl:hidden">
          {Array.from({ length: ROW })?.map((_, row) => (
            <div key={row} className="w-full bg-background">
              <div
                className={clsx('flex items-center gap-2 bg-muted px-4 py-2 ', {
                  'rounded-t-xl': row === 0,
                })}
              >
                <Skeleton className="h-6 w-24 !bg-background" />
                <Skeleton className="ms-auto h-3 w-12 !bg-background" />
                {rol?.rolName === 'Administrador' && (
                  <Skeleton className="h-4 w-4 !bg-background" />
                )}
              </div>

              <div className="flex flex-col gap-1 px-8 py-2 [&>*]:flex [&>*]:gap-2">
                <div>
                  {' '}
                  <Skeleton className="h-6 w-20" />{' '}
                  <Skeleton className="h-6 w-20" />{' '}
                </div>
                <div>
                  {' '}
                  <Skeleton className="h-6 w-16" />{' '}
                  <Skeleton className="h-6 w-24" />{' '}
                </div>
                <div>
                  {' '}
                  <Skeleton className="h-6 w-28" />{' '}
                  <Skeleton className="h-6 w-12" />{' '}
                </div>
                <div>
                  {' '}
                  <Skeleton className="h-6 w-32" />{' '}
                  <Skeleton className="h-6 w-12" />{' '}
                </div>
                <div>
                  {' '}
                  <Skeleton className="h-6 w-24" />{' '}
                  <Skeleton className="h-6 w-16" />{' '}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="ms-auto h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

/* eslint-disable-next-line */
export function Error() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }
  return (
    <div className="flex h-full flex-col  items-center items-center justify-center gap-4 md:flex-row [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{text.error}</h1>
        <p className="italic">{text.errorDescription}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.back + '.'}{' '}
        </Button>
      </div>
    </div>
  )
}

Clients.displayname = 'ClientsList'
Error.displayname = 'ClientsListError'
Pending.displayname = 'ClientsListPending'

/* eslint-disable-next-line */
type TMenuItems =
  | 'numero_de_identificacion'
  | 'telefono'
  | 'celular'
  | 'direccion'
  | 'fullName'
  | 'apellidos'
  | 'referencia'

const getMenuItem = (name: string) => {
  const data = {
    numero_de_identificacion: text.dropdown.items?.id,
    telefono: text.dropdown.items?.telephone,
    celular: text.dropdown.items?.phone,
    direccion: text.dropdown.items?.direction,
    fullName: text.dropdown.items?.firstName,
    apellidos: text.dropdown.items?.lastName,
    referencia: text.dropdown.items?.ref,
  }
  return data?.[name as TMenuItems] ?? 'fullName'
}

const text = {
  back: 'Intente volver a la pestaña anterior',
  title: 'Clientes:',
  error: 'Ups!!! ha ocurrido un error',
  errorDescription: 'El listado de clientes ha fallado.',
  browser: 'Clientes',
  search: {
    404: 'No se encontraron resultados',
    selected: ({ selected, total }: { selected: number; total: number }) =>
      `${selected} de ${total} fila(s) seleccionadas.`,
  },
  columns: {
    fullName: 'Nombre y apellidos',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    id: 'I.D.',
    phone: 'Celular',
    telephone: 'Telefono',
    ref: 'Referencia',
    direction: 'Direccion',
  },
  buttons: {
    next: 'Siguiente',
    prev: 'Anterior',
    delete: 'Eliminar',
    new: 'Nuevo',
  },
  select: {
    placeholder: 'Seleccione un filtro',
    title: 'Filtros:',
    get items() {
      return { ...text.columns }
    },
  },
  dropdown: {
    title: 'Columnas',
    subtitle: 'Acciones',
    get items() {
      return { ...text.columns }
    },
  },
  menu: {
    aria: 'Mas Opciones',
    title: 'Acciones:',
    copy: 'Copiar datos del cliente',
    update: 'Ver | Actualizar Cliente',
    delete: 'Eliminar Cliente',
  },
}
