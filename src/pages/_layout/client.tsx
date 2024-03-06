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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getClients, type TClient } from '@/api/clients'
import clsx from 'clsx'

export const Route = createFileRoute('/_layout/client')({
  component: Client,
  loader: getClients
})

const columns: ColumnDef<TClient>[] = [
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
    accessorKey: 'nombres' as keyof TClient,
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
        {row.original.nombres + ' ' + row.original.apellidos}
      </div>
    ),
  },
  {
    accessorKey: 'direccion' as keyof TClient,
    header: ({column}) => {
      return <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.direction}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    },
    cell: ({ row }) => <div>
      {row.getValue('direccion' as keyof TClient) + ". " +
      row.original.segunda_direccion}
    </div>,
  },
  {
    accessorKey: 'celular' as keyof TClient,
    header: () => {
      return <p>{text.columns.phone}</p>
    },
    cell: ({ row }) => <div className="lowercase w-32">{row.getValue('celular' as keyof TClient)}</div>,
  },
  {
    accessorKey: 'telefono' as keyof TClient,
    header: () => {
      return <p>{text.columns.telephone}</p>
    },
    cell: ({ row }) => <div className="lowercase w-32">{row.getValue('telefono' as keyof TClient)}</div>,
  },
  {
    accessorKey: 'numero_de_identificacion' as keyof TClient,
    header: () => {
      return <p>{text.columns.id}</p>
    },
    cell: ({ row }) => <div className='w-32'>
      <p className='capitalize font-bold'>{row.original.tipo_de_identificacion}</p>
      <p>{row.getValue('numero_de_identificacion' as keyof TClient)}</p>
    </div>,
  },
  {
    accessorKey: 'referencia' as keyof TClient,
    header: ({column}) => {
     return <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.ref}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    },
    cell: ({ row }) => <div>
      <p>{row.getValue('referencia' as keyof TClient)}</p>
    </div>,
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
        navigator.clipboard.writeText(id.toFixed())
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
              <span className="sr-only">{text.menu.aria}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 [&>*:not(:is([role=separator],:first-child))]:h-16 [&>*]:flex [&>*]:cursor-pointer [&>*]:justify-between [&>*]:gap-2"
          >
            <DropdownMenuLabel className="text-lg">
              {text.menu.title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClickCopy}>
              {text.menu.copy} <Copy />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>
              <Link
                className="flex h-full w-full items-center justify-between gap-2"
                to={'./$clientId/update'}
                params={{ clientId: id }}
              >
                {text.menu.update} <UserCog />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>
              <Link
                className="flex h-full w-full items-center justify-between gap-2"
                to={'./$clientId/delete'}
                params={{ clientId: id }}
              >
                {text.menu.delete} <UserX />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface TClientProps {
  clients?: TClient[],
  open?: boolean
}
export function Client({
  children,
  open: _open = false,
  clients: _clients = [] as TClient[]
}: React.PropsWithChildren<TClientProps>) {
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
  const { clients: clientsSelected, setClient: setSelectdedClient } =
    useClientSelected(({ clients, setClient }) => ({ clients, setClient }))
  const clientsDB = Route.useLoaderData() ?? _clients

  const table = useReactTable({
    data: clientsDB,
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

  useEffect(() => {
    setSelectdedClient({ clients: table.getFilteredSelectedRowModel().rows as unknown as TClient[] })
  }, [rowSelection])

  const onOpenChange: (open: boolean) => void = () => {
    if (open) {
      !children && navigate({ to: './' })
    }
    setStatus({ open: !open })
  }

  const onValueChange = (value: string) => {
    setStatus({ filter: value as keyof TClient})
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

            <Link disabled={!clientsSelected?.length} to={'./delete'}>
              <Button
                className={clsx({ "hover:bg-destructive": clientsSelected?.length })}
                disabled={!clientsSelected?.length} onClick={onClick}>
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
                    const getColumnsName = ( id: string ) => ({
                      numero_de_identificacion: "id" as keyof typeof text.dropdown.items,
                      telefono: "telephone" as keyof typeof text.dropdown.items,
                      celular: "phone" as keyof typeof text.dropdown.items,
                      direccion: "direction" as keyof typeof text.dropdown.items,
                      nombres: "firstName" as keyof typeof text.dropdown.items,
                      apellidos: "lastName" as keyof typeof text.dropdown.items,
                      referencia: "ref" as keyof typeof text.dropdown.items,
                    } as Record<keyof TClient, string>)?.[id as keyof TClient] ?? ""
                    return (
                      <DropdownMenuCheckboxItem
                        className="capitalize hover:cursor-pointer"
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {text.dropdown.items?.[ getColumnsName( column.id ) ] ?? ""}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table className='overflow-auto'>
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
