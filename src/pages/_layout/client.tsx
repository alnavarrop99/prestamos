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
import { ChevronDown } from 'lucide-react'
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
  Navigate,
} from '@tanstack/react-router'
import { useClientStatus } from '@/lib/context/client'
import { useRootStatus } from '@/lib/context/layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getClientsRes, type TClient } from '@/api/clients'
import clsx from 'clsx'
import { columns } from '@/pages/_layout/-column'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_layout/client')({
  component: Clients,
  loader: getClientsRes,
})

/* eslint-disable-next-line */
interface TClientsProps {
  clients?: TClient[]
  open?: boolean
}

export const _selectedClients = createContext<TClient[] | undefined>(undefined)

/* eslint-disable-next-line */
export function Clients({
  children,
  open: _open,
  clients: _clients = [] as TClient[],
}: React.PropsWithChildren<TClientsProps>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const {
    open = _open,
    filter = 'nombres' as keyof TClient,
    setStatus,
  } = useClientStatus(({ open = _open, filter, setStatus }) => ({
    open,
    filter,
    setStatus,
  }))
  const { value } = useRootStatus(({ value }) => ({ value }))
  const navigate = useNavigate({ from: '/client' })
  const clients = Route.useLoaderData() ?? _clients

  const table = useReactTable({
    data: clients,
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

  const onOpenChange: (open: boolean) => void = () => {
    if (open) {
      !children && navigate({ to: './' })
    }
    setStatus({ open: !open })
  }

  const onValueChange = (value: string) => {
    setStatus({ filter: value as keyof TClient })
  }

  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    if (open) {
      !children && navigate({ to: './' })
    }
    setStatus({ open: !open })
  }

  return (
    <_selectedClients.Provider
      value={table.getFilteredSelectedRowModel().rows as unknown as TClient[]}
    >
      {!children && <Navigate to={'/client'} />}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <Badge className="px-3 text-xl">
            {table.getFilteredRowModel().rows.length}
          </Badge>
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
              {children ?? <Outlet />}
            </Dialog>

            <Link
              disabled={!table.getFilteredSelectedRowModel().rows?.length}
              to={'./delete'}
            >
              <Button
                className={clsx({
                  'bg-destructive':
                    table.getFilteredSelectedRowModel().rows?.length,
                })}
                disabled={!table.getFilteredSelectedRowModel().rows?.length}
                onClick={onClick}
              >
                {text.buttons.delete}
              </Button>
            </Link>

            <Select value={filter} onValueChange={onValueChange}>
              <SelectTrigger className="ms-auto w-auto">
                <SelectValue placeholder={text.select.placeholder} />
              </SelectTrigger>
              <SelectContent className="[&>div]:cursor-pointer">
                <SelectItem
                  value={'nombres' as keyof TClient}
                  className="cursor-pointer"
                >
                  {text.select.items.fullName}
                </SelectItem>
                <SelectItem
                  value={'numero_de_identificacion' as keyof TClient}
                  className="cursor-pointer"
                >
                  {text.select.items.id}
                </SelectItem>
                <SelectItem
                  value={'direccion' as keyof TClient}
                  className="cursor-pointer"
                >
                  {text.select.items.direction}
                </SelectItem>
                <SelectItem
                  value={'celular' as keyof TClient}
                  className="cursor-pointer"
                >
                  {text.select.items.phone}
                </SelectItem>
                <SelectItem
                  value={'telefono' as keyof TClient}
                  className="cursor-pointer"
                >
                  {text.select.items.telephone}
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
                  .map((column) => {
                    // TODO: this fuctions offuse the code but is necesary because the api is in spanish and the frontend is in english
                    const getColumnsName = (id: string) =>
                      (
                        ({
                          numero_de_identificacion:
                            'id' as keyof typeof text.dropdown.items,
                          telefono:
                            'telephone' as keyof typeof text.dropdown.items,
                          celular: 'phone' as keyof typeof text.dropdown.items,
                          direccion:
                            'direction' as keyof typeof text.dropdown.items,
                          nombres:
                            'firstName' as keyof typeof text.dropdown.items,
                          apellidos:
                            'lastName' as keyof typeof text.dropdown.items,
                          referencia: 'ref' as keyof typeof text.dropdown.items,
                        }) as Record<keyof TClient, string>
                      )?.[id as keyof TClient] ?? ''
                    return (
                      <DropdownMenuCheckboxItem
                        className="capitalize cursor-pointer"
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {text.dropdown.items?.[getColumnsName(column.id)] ?? ''}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border ">
            <Table className="overflow-auto">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={clsx(
                            'first:sticky first:left-0 first:bg-secondary last:sticky last:right-0 last:bg-secondary'
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
                            'first:sticky first:left-0 first:bg-secondary last:sticky last:right-0 last:bg-secondary'
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
                className='hover:ring hover:ring-primary'
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
    </_selectedClients.Provider>
  )
}

Clients.displayname = 'ClientsList'

const text = {
  title: 'Clientes:',
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
    secondDirection: 'Segunda Direccion',
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
