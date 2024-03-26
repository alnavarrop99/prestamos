import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Copy, MoreHorizontal, UserCog2 as UserUpdate, UserX2 as UserDelete, UserPlus2 as UserPay, } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useStatus } from '@/lib/context/layout'
import { type TClient } from '@/api/clients'
import { getIdById } from '@/api/id'

export type TClientTable =  Omit<TClient, "nombres"| "apellidos"> & Record< "fullName", string >
export const columns: ColumnDef<TClientTable>[] = [
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
        className='mr-4'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName" as keyof TClientTable,
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
      <p className="copitalize min-w-32">
        {row.getValue("fullName")}
      </p>
    ),
  },
  {
    accessorKey: 'email' as keyof TClientTable,
    header: ({column}) => {
      return <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.email}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    },
    cell: ({ row }) => <p className='min-w-32'>
      {row.getValue('email' as keyof TClientTable) + "."}
    </p>,
  },
  {
    accessorKey: 'direccion' as keyof TClientTable,
    header: ({column}) => {
      return <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.direction}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    },
    cell: ({ row }) => <p className='min-w-32'>
      {row.getValue('direccion' as keyof TClientTable) + "."}
    </p>,
  },
  {
    accessorKey: 'celular' as keyof TClientTable,
    header: () => {
      return <p>{text.columns.phone}</p>
    },
    cell: ({ row }) => <p className="lowercase w-32">{row.getValue('celular' as keyof TClientTable)}</p>
  },
  {
    accessorKey: 'telefono' as keyof TClientTable,
    header: () => {
      return <p>{text.columns.telephone}</p>
    },
    cell: ({ row }) => <p className="lowercase w-32">{row.getValue('telefono' as keyof TClientTable)}</p>
  },
  {
    accessorKey: 'numero_de_identificacion' as keyof TClientTable,
    header: () => {
      return <p>{text.columns.id}</p>
    },
    cell: ({ row }) => <div className='w-32'>
      <p className='capitalize font-bold'>{getIdById({ id: row.original.tipo_de_identificacion})?.name}</p>
      <p>{row.getValue('numero_de_identificacion' as keyof TClientTable)}</p>
    </div>,
  },
  {
    accessorKey: 'referencia_id' as keyof TClientTable,
    header: ({column}) => {
     return <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {text.columns.ref}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    },
    cell: ({ row }) => <p className='w-32'>{row.getValue('referencia_id' as keyof TClientTable)}</p>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const { id, celular, fullName, numero_de_identificacion } = row.original

      /* eslint-disable-next-line */
      const { open, setOpen } = useStatus()

      /* eslint-disable-next-line */
      const [{ menu }, setMenu] = useState<{ menu?: boolean }>({ menu: false })

      /* eslint-disable-next-line */
      const navigate = useNavigate()

      const onClickCopy: React.MouseEventHandler<
        React.ComponentRef<typeof DropdownMenuItem>
      > = () => {
        navigator.clipboard.writeText( [ fullName, celular, numero_de_identificacion ].join(" ") )
      }

      const onClick: React.MouseEventHandler< React.ComponentRef< typeof DropdownMenuItem > > = ( ) => {
        const _open = !open
        const _menu = !menu
        if (!_open) {
          navigate({ to: '/client' })
        }
        setOpen({ open: _open })
        setMenu({ menu: _menu })
      }

      const onClickPay: React.MouseEventHandler< React.ComponentRef< typeof DropdownMenuItem > > = ( ) => {
        const _open = !open
        const _menu = !menu
        setOpen({ open: _open })
        setMenu({ menu: _menu })
      }

      const onMenuChange = ( menu: boolean ) => {
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
            <DropdownMenuItem onClick={onClickCopy} >
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
                {text.menu.update} <UserUpdate />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick} >
              <Link
                className="flex h-full w-full items-center justify-between gap-2"
                to={'./$clientId/delete'}
                params={{ clientId: id }}
              >
                {text.menu.delete} <UserDelete />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const text = {
  menu: {
    aria: 'Mas Opciones',
    title: 'Acciones:',
    copy: 'Copiar datos del cliente',
    update: 'Ver | Actualizar cliente',
    pay: 'Asignar prestamo al cliente',
    delete: 'Eliminar cliente',
  },
  columns: {
    fullName: 'Nombre y apellidos',
    email: 'Email',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    id: 'I.D.',
    phone: 'Celular',
    telephone: 'Telefono',
    ref: 'Referencia',
    direction: 'Direccion',
    secondDirection: 'Segunda Direccion',
  },
}
