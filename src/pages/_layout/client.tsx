import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ColumnDef,
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
import {
  ArrowUpDown,
  ChevronDown,
  Copy,
  MoreHorizontal,
  UserCog,
  UserX,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import React, { ComponentRef, useEffect, useState } from 'react'
import {
  Outlet,
  createFileRoute,
  Link,
  useNavigate,
  Navigate,
} from '@tanstack/react-router'
import { useClientSelected, useClientStatus } from '@/lib/context/client'
import { useRootStatus } from '@/lib/context/layout'
import clientsMock from '@/__mock__/mocks-clients.json'

export const Route = createFileRoute('/_layout/client')({
  component: Client,
})

type TClients = (typeof import('@/__mock__/mocks-clients.json'))[0]
const columns: ColumnDef<TClients>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.fullName}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="copitalize">
        {row.original.firstName + ' ' + row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.email}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: () => {
      return <p>{text.columns.phone}</p>
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'id',
    header: () => {
      return <p>{text.columns.id}</p>
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('id')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original

      /* eslint-disable-next-line */
      const { open, setStatus } = useClientStatus(({ open, setStatus }) => ({
        open,
        setStatus,
      }))

      /* eslint-disable-next-line */
      const [{ menu }, setMenu] = useState<{ menu?: boolean }>({ menu: false })

      const onClickCopy: React.MouseEventHandler<
        React.ComponentRef<typeof DropdownMenuItem>
      > = () => {
        navigator.clipboard.writeText(id)
      }

      const onClick: React.MouseEventHandler<
        React.ComponentRef<typeof DropdownMenuItem>
      > = () => {
        setMenu({ menu: !menu })
        setStatus({ open: !open })
      }

      return (
        <DropdownMenu open={menu} onOpenChange={() => setMenu({ menu: !menu })}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{text.dropdown.aria}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 [&>*:not(:is([role=separator],:first-child))]:h-16 [&>*]:flex [&>*]:cursor-pointer [&>*]:justify-between [&>*]:gap-2"
          >
            <DropdownMenuLabel className="text-lg">
              {text.dropdown.title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClickCopy}>
              {text.dropdown.copy} <Copy />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>
              <Link
                className="flex h-full w-full items-center justify-between gap-2"
                to={'./$clientId/update'}
                params={{ clientId: id }}
              >
                {text.dropdown.update} <UserCog />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>
              <Link
                className="flex h-full w-full items-center justify-between gap-2"
                to={'./$clientId/delete'}
                params={{ clientId: id }}
              >
                {text.dropdown.delete} <UserX />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function Client({
  children,
  open: _open,
}: React.PropsWithChildren<{ open?: boolean }>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { open = _open, setStatus } = useClientStatus(
    ({ open = false, setStatus }) => ({ open, setStatus })
  )
  const { value } = useRootStatus(({ value }) => ({ value }))
  const navigate = useNavigate({ from: '/client' })
  const { clients: clientsSelected, setClient: setSelectdedClient } =
    useClientSelected(({ clients, setClient }) => ({ clients, setClient }))

  const table = useReactTable({
    data: clientsMock,
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
    table.getColumn('firstName')?.setFilterValue(value)
  }, [value])

  useEffect(() => {
    setSelectdedClient({ clients: table.getFilteredSelectedRowModel().rows })
  }, [rowSelection])

  const onOpenChange: (open: boolean) => void = () => {
    if (open) {
      !children && navigate({ to: './' })
    }
    setStatus({ open: !open })
  }

  const onClick: React.MouseEventHandler<ComponentRef<typeof Button>> = () => {
    if (open) {
      !children && navigate({ to: './' })
    }
    setStatus({ open: !open })
  }

  return (
    <>
      {!children && <Navigate to={'/client'} />}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <Badge className="px-3 text-xl">
            {table.getFilteredRowModel().rows.length}
          </Badge>
        </div>

        <div className="w-full">
          <div className="flex items-center gap-2 py-4">
            <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogTrigger asChild>
                <Link to={'./new'}>
                  <Button variant="default">{text.buttons.new}</Button>
                </Link>
              </DialogTrigger>
              {children ?? <Outlet />}
            </Dialog>

            <Button disabled={!clientsSelected?.length} onClick={onClick}>
              <Link to={'./delete'}>{text.buttons.delete}</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {text.select.title} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        className="capitalize hover:cursor-pointer"
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {text.select.columns?.[column.id as keyof TClients]}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
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
                        <TableCell key={cell.id}>
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
    </>
  )
}

Client.displayname = 'Client'

const text = {
  title: 'Clientes:',
  search: {
    404: 'No se encontraron resultados',
    selected: ({ selected, total }: { selected: number; total: number }) =>
      `${selected} de ${total} fila(s) seleccionadas.`,
  },
  columns: {
    fullName: 'Nombre y Apellidos',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    id: 'I.D',
    phone: 'Telefono',
    alias: 'Alias',
    email: 'Email',
  },
  buttons: {
    next: 'Siguiente',
    prev: 'Anterior',
    delete: 'Eliminar',
    new: 'Nuevo',
  },
  select: {
    title: 'Columnas',
    subtitle: 'Acciones',
    get columns() {
      return { ...text.columns }
    },
  },
  dropdown: {
    aria: 'Mas Opciones',
    title: 'Acciones:',
    copy: 'Copiar datos del cliente',
    update: 'Ver | Actualizar Cliente',
    delete: 'Eliminar Cliente',
  },
}
