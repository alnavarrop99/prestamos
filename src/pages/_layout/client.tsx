import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
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
import React, { createContext, useEffect, useMemo, useState } from 'react'
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
import { columns, type TClientTable } from '@/pages/_layout/-column'
import { Separator } from '@/components/ui/separator'
import { useClientByUsers } from '@/lib/context/client'
import { Skeleton } from '@/components/ui/skeleton'
import { queryClient } from '../__root'
import { queryOptions, useIsMutating, useSuspenseQuery } from '@tanstack/react-query'
import { postClientOpt } from './client/new'
import { updateClientByIdOpt } from './client/$clientId/update'
import { deleteClientByIdOpt } from './client/$clientId/delete'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const getClientListOpt = {
  queryKey: ["list-clients"],
  queryFn: getClientsList,
}

export const Route = createFileRoute('/_layout/client')({
  component: Clients,
  pendingComponent: Pending,
  errorComponent: Error,
  loader: () => queryClient.ensureQueryData( queryOptions( getClientListOpt ) ),
  validateSearch: (search: { clients?: number[] }) => {
    if (!search?.clients?.length) return { clients: [] }
    return search
  },
})

/* eslint-disable-next-line */
interface TClientsProps {
  clients?: TClientTable[]
  open?: boolean
  filter?: keyof TClientTable
}

const ROW = 14
const COL = 7
export const _clientContext = createContext< TClientTable[] | undefined>( undefined)
export const _rowSelected = createContext< (() => void) | undefined >( undefined)
const useFilter = create< { filter: keyof TClientTable, setFilter: ( value: keyof TClientTable ) => void } >()( persist((set) => ({
  filter: "fullName",
  setFilter: ( filter ) => (set( () => ({ filter }) ))
}), { name: "client-filter" }) )

/* eslint-disable-next-line */
export function Clients({ }: React.PropsWithChildren<TClientsProps>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { open, setOpen, value } = useStatus()
  const navigate = useNavigate()
  const {filter, setFilter} = useFilter()
  const search = Route.useSearch()
  const isUpdateClient = useIsMutating( { status: "success", mutationKey: updateClientByIdOpt.mutationKey } )
  const isNewClient = useIsMutating( { status: "success", mutationKey: postClientOpt.mutationKey } )
  const isDeleteClient = useIsMutating( { status: "success", mutationKey: deleteClientByIdOpt.mutationKey } )
  
  const select: ((data: TCLIENT_GET_ALL) => TClientTable[]) = ( data ) => {
    const clients = data?.map<TClientTable>(({ nombres, apellidos, referencia_id, ...props }, _, list) => {
      const ref = list?.find( ({ id: referenciaId }) => ( referenciaId === referencia_id ) )
      if( !ref || !referencia_id ){
        return ({
          ...props,
          fullName: nombres + ' ' + apellidos,
          referencia: ""
        })
      }
      return ({
        ...props,
        fullName: nombres + ' ' + apellidos,
        referencia: ref.nombres + " " + ref.apellidos,
      })
    })
    return clients
  }
  const { data: clientsRes, refetch } = useSuspenseQuery( queryOptions( { ...getClientListOpt, select } ) )

  const { clients, setClient } = useClientByUsers(({ clients, ...items }) => ({ clients: clients ?? clientsRes, ...items }))
  const data = useMemo(() => {
    if (!search?.clients?.length) return clients;
    return clients?.filter(
      ({ id: userId }) => userId && search?.clients?.includes(userId)
    )
  }, [clients])

  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  const table = useReactTable({
    data,
    columns,
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

  useEffect(() => {
    if( clientsRes ){
      refetch()?.then( ({ data }) => {
        if( !data ) return;
        setClient({ clients: data } )
      } )
    }
    return () => {
      // setClients( clientsRes )
    }
  }, [isUpdateClient, isNewClient, isDeleteClient])

  return (
    <_clientContext.Provider value={clients}>
      <_rowSelected.Provider value={table.resetRowSelection}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          { !!data?.length && <Badge className="px-3 text-xl">
            {table.getFilteredRowModel().rows.length}
          </Badge>}
        </div>
        <Separator />
        <div>
          <div className="flex items-center gap-2 py-4">
            <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogTrigger asChild>
                <Link to={'./new'}>
                  <Button variant="default">{text.buttons.new}</Button>
                </Link>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Link
                  disabled={!table.getFilteredSelectedRowModel().rows?.length}
                  to={'./delete'}
                  search={{
                    clients: table .getFilteredSelectedRowModel() ?.rows?.map(({ original }) => original.id) 
                  }}
                >
                  <Button
                    className={clsx({
                      'bg-destructive hover:bg-destructive':
                        table.getFilteredSelectedRowModel().rows?.length,
                    })}
                    disabled={!table.getFilteredSelectedRowModel().rows?.length}
                  >
                    {text.buttons.delete}
                  </Button>
                </Link>
              </DialogTrigger>
              <Outlet />
            </Dialog>
            <Select value={filter} onValueChange={onValueChange}>
              <SelectTrigger title='Filtro de busqueda' className="ms-auto w-auto">
                <SelectValue placeholder={text.select.placeholder} />
              </SelectTrigger>
              <SelectContent className="[&>div]:cursor-pointer">
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
                <SelectItem value={'referencia' as keyof TClientTable} className="cursor-pointer">
                  {text.select.items.ref}
                </SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {text.dropdown.title} <ChevronDown className="ml-2 h-4 w-4" />
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
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={clsx(
                            'first:sticky first:left-0 last:sticky last:right-0'
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={clsx(
                            'first:sticky first:left-0 last:sticky last:right-0'
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {text.search[404]}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {text.search.selected({
                selected: table.getFilteredSelectedRowModel().rows.length,
                total: table.getFilteredRowModel().rows.length,
              })}
            </div>
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
  return <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton className='w-36 h-8' />
      <Skeleton className='w-8 h-8 rounded-full' />
    </div>
    <Separator />
    <div className='flex items-center gap-2'>
      <Skeleton className='w-24 h-10' />
      <Skeleton className='w-24 h-10' />
      <Skeleton className='ms-auto w-32 h-8' />
      <Skeleton className='w-32 h-8' />
    </div>
    <div className='px-4'>
      <table className='ring-4 ring-transparent rounded-md w-full border-separate border-spacing-2'>
      {Array.from( { length: ROW } )?.map( (_, index) => 
        <tr key={index}>
          {Array.from( { length: COL } )?.map( (_, index) => 
            <td key={index} className='first:w-12 last:w-16'> <Skeleton className='w-full h-9' /> </td>
          )}
        </tr>
        )}
      </table>
    </div>
    <div className='flex items-center gap-2'>
      <Skeleton className='w-48 h-8' />
      <Skeleton className='ms-auto w-24 h-10' />
      <Skeleton className='w-24 h-10' />
    </div>
  </div>
}

/* eslint-disable-next-line */
export function Error() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    history.back()
  }
  return <div className='flex items-center h-full [&>svg]:w-32 [&>svg]:stroke-destructive [&>svg]:h-32 items-center justify-center gap-4 [&_h1]:text-2xl'>
      <Annoyed  className='animate-bounce' />
      <div className='space-y-2'>
        <h1 className='font-bold'>{text.error}</h1>
        <p className='italic'>{text.errorDescription}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className='text-sm'> {text.back + "."} </Button>
      </div>
    </div>
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
