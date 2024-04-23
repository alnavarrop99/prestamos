import { ColumnDef, Row } from '@tanstack/react-table'
import {
  ArrowUpDown,
  Copy,
  MoreHorizontal,
  UserCog2 as UserUpdate,
  UserX2 as UserDelete,
  UserPlus2 as UserPay,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useStatus } from '@/lib/context/layout'
import type { TCLIENT_GET_BASE } from '@/api/clients'
import { getIdById } from '@/lib/type/id'
import { useToken } from '@/lib/context/login'
import type { TROLES } from '@/lib/type/rol'

export type TClientTable = Omit<
  TCLIENT_GET_BASE,
  'nombres' | 'apellidos' | 'referencia_id'
> &
  Record<'fullName' | 'referencia', string>

export const movile: ColumnDef<TClientTable>[] = [
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
        id={'select-' + row.index}
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName' as keyof TClientTable,
    header: () => <p>{text.columns.fullName}</p>,
    cell: ({ row }) => <p className="copitalize">{row.getValue('fullName')}</p>,
  },
  {
    accessorKey: 'direccion' as keyof TClientTable,
    header: () => <p>{text.columns.direction}</p>,
    cell: ({ row }) => (
      <p>{row.getValue('direccion' as keyof TClientTable) + '.'}</p>
    ),
  },
  {
    accessorKey: 'celular' as keyof TClientTable,
    header: () => <p>{text.columns.phone}</p>,
    cell: ({ row }) => (
      <p className="lowercase">
        {row.getValue('celular' as keyof TClientTable)}
      </p>
    ),
  },
  {
    accessorKey: 'telefono' as keyof TClientTable,
    header: () => <p>{text.columns.telephone}</p>,
    cell: ({ row }) => (
      <p className="lowercase">
        {row.getValue('telefono' as keyof TClientTable)}
      </p>
    ),
  },
  {
    accessorKey: 'numero_de_identificacion' as keyof TClientTable,
    header: () => <p>{text.columns.id}</p>,
    cell: ({ row }) => (
      <p>{row.getValue('numero_de_identificacion' as keyof TClientTable)}</p>
    ),
  },
  {
    accessorKey: 'tipo_de_identificacion_id' as keyof TClientTable,
    header: () => <p>{text.columns.idType}</p>,
    cell: ({ row }) => {
      const id: number = row.getValue(
        'tipo_de_identificacion_id' as keyof TClientTable
      )
      if (!id) return
      return <p>{getIdById({ id })?.nombre}</p>
    },
  },
  {
    accessorKey: 'referencia' as keyof TClientTable,
    header: () => <p>{text.columns.ref}</p>,
    cell: ({ row }) => (
      <p className="">{row.getValue('referencia' as keyof TClientTable)}</p>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ClientActions row={row} />,
  },
]

export const desktop: ColumnDef<TClientTable>[] = [
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
        className="mr-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName' as keyof TClientTable,
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
    cell: ({ row }) => <p className="copitalize">{row.getValue('fullName')}</p>,
  },
  {
    accessorKey: 'direccion' as keyof TClientTable,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.direction}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <p className="">
        {row.getValue('direccion' as keyof TClientTable) + '.'}
      </p>
    ),
  },
  {
    accessorKey: 'celular' as keyof TClientTable,
    header: () => {
      return <p>{text.columns.telephone}</p>
    },
    cell: ({ row }) => (
      <div className="[&_span]:font-bold">
        <p>
          <span>{'M' + ':'}</span>
          {row.getValue('celular' as keyof TClientTable)}
        </p>
        {row?.original?.telefono !== '' && (
          <p>
            <span>{'T' + ':'}</span>
            {row.original?.telefono}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'numero_de_identificacion' as keyof TClientTable,
    header: () => {
      return <p>{text.columns.id}</p>
    },
    cell: ({ row }) => (
      <div>
        <p className="font-bold capitalize">
          {getIdById({ id: row.original?.tipo_de_identificacion_id })?.nombre}
        </p>
        <p>{row.getValue('numero_de_identificacion' as keyof TClientTable)}</p>
      </div>
    ),
  },
  {
    accessorKey: 'referencia' as keyof TClientTable,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.ref}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <p className="">{row.getValue('referencia' as keyof TClientTable)}</p>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ClientActions row={row} />,
  },
]

function ClientActions({ row }: { row: Row<TClientTable> }) {
  const {
    id,
    celular,
    fullName,
    numero_de_identificacion,
    telefono,
    direccion,
  } = row.original
  const { open, setOpen } = useStatus()
  const [{ menu }, setMenu] = useState<{ menu?: boolean }>({ menu: false })
  const navigate = useNavigate()
  const { userId, rol } = useToken()

  const onClickCopy: React.MouseEventHandler<
    React.ComponentRef<typeof DropdownMenuItem>
  > = () => {
    navigator.clipboard.writeText(
      [fullName, celular, telefono, direccion, numero_de_identificacion].join(
        ' '
      )
    )
  }

  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof DropdownMenuItem>
  > = () => {
    const _open = !open
    const _menu = !menu
    if (!_open) {
      navigate({ to: '/client' })
    }
    setOpen({ open: _open })
    setMenu({ menu: _menu })
  }

  const onClickPay: React.MouseEventHandler<
    React.ComponentRef<typeof DropdownMenuItem>
  > = () => {
    const _open = !open
    const _menu = !menu
    setOpen({ open: _open })
    setMenu({ menu: _menu })
  }

  const onMenuChange = (menu: boolean) => {
    setMenu({ menu })
  }

  return (
    <DropdownMenu open={menu} onOpenChange={onMenuChange}>
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
        <DropdownMenuItem onClick={onClickPay}>
          <Link
            className="flex h-full w-full items-center justify-between gap-2"
            to={'/credit/new'}
            search={{ clientId: id }}
          >
            {text.menu.pay} <UserPay />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClick}>
          <Link
            className="flex h-full w-full items-center justify-between gap-2"
            to={'./$clientId/update'}
            params={{ clientId: id }}
          >
            {text.menu.update({ rolName: rol?.rolName })} <UserUpdate />
          </Link>
        </DropdownMenuItem>
        {!!userId && rol?.rolName === 'Administrador' && (
          <DropdownMenuItem onClick={onClick}>
            <Link
              className="flex h-full w-full items-center justify-between gap-2"
              to={'./$clientId/delete'}
              params={{ clientId: id }}
              search={{
                name: fullName,
              }}
            >
              {text.menu.delete} <UserDelete />
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const text = {
  menu: {
    aria: 'Mas Opciones',
    title: 'Acciones:',
    copy: 'Copiar datos del cliente',
    update: ({ rolName }: { rolName?: TROLES }) =>
      rolName === 'Administrador' ? 'Ver | Actualizar' : 'Ver' + ' cliente',
    pay: 'Asignar prestamo al cliente',
    delete: 'Eliminar cliente',
  },
  columns: {
    fullName: 'Nombre y apellidos',
    email: 'Correo',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    id: 'I.D.',
    idType: 'Tipo de I.D.',
    phone: 'Celular',
    telephone: '#Telefono',
    ref: 'Referencia',
    direction: 'Direccion',
    secondDirection: 'Segunda Direccion',
  },
}
