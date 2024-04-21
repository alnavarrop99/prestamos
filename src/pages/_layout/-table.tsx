import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useScreen } from '@/lib/hook/useScreens'
import { flexRender, type Table as TTable } from '@tanstack/react-table'
import { TClientTable, desktop } from './-column'
import clsx from 'clsx'
import { Label } from '@/components/ui/label'
import { useToken } from '@/lib/context/login'

/* eslint-disable-next-line */
type TPaymentTable = {
  table: TTable<TClientTable>
}

/* eslint-disable-next-line */
export function ClientTable({ table }: TPaymentTable) {
  const screen = useScreen()
  const { rol } = useToken()

  if (screen !== 'lg')
    return (
      <Table>
        <TableBody className="divide-y-2">
          {table.getRowModel().rows?.map((row, index) => {
            const select = row?.getVisibleCells()?.[0]
            const fullName = row?.getVisibleCells()?.[1]
            const direction = row?.getVisibleCells()?.[2]
            const phone = row?.getVisibleCells()?.[3]
            const telephone = row?.getVisibleCells()?.[4]
            const id = row?.getVisibleCells()?.[5]
            const idType = row?.getVisibleCells()?.[6]
            const ref = row?.getVisibleCells()?.[7]
            const action = row?.getVisibleCells()?.[8]
            return (
              <Table key={index}>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className={clsx('bg-muted', {
                        'rounded-t-xl': index === 0,
                      })}
                    >
                      <Label
                        htmlFor={'select-' + row.index}
                        className="items-between flex justify-between gap-2 [&>*]:flex [&>*]:items-center"
                      >
                        {flexRender(
                          fullName?.column?.columnDef.cell,
                          fullName?.getContext()
                        )}
                        {rol?.rolName === 'Administrador' && (
                          <div className="space-x-2 px-4">
                            {flexRender(
                              action?.column?.columnDef.cell,
                              action?.getContext()
                            )}
                            {flexRender(
                              select?.column?.columnDef.cell,
                              select?.getContext()
                            )}
                          </div>
                        )}
                      </Label>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    <TableCell className="px-8">
                      <ul className="flex list-outside list-disc flex-col !items-start [&>li]:flex [&>li]:gap-1">
                        <li>
                          <b>{'Celular: ' + ':'}</b>{' '}
                          {flexRender(
                            phone?.column?.columnDef.cell,
                            phone?.getContext()
                          )}
                        </li>

                        <li>
                          <b>{'Telefono' + ':'}</b>{' '}
                          {flexRender(
                            telephone?.column?.columnDef.cell,
                            telephone?.getContext()
                          )}
                        </li>

                        <li>
                          <b>{'Direccion' + ':'}</b>{' '}
                          {flexRender(
                            direction?.column?.columnDef.cell,
                            direction?.getContext()
                          )}
                        </li>

                        <li>
                          <b>{'Tipo de ID' + ':'}</b>{' '}
                          {flexRender(
                            idType?.column?.columnDef.cell,
                            idType?.getContext()
                          )}
                        </li>

                        <li>
                          <b>{'#ID' + ':'}</b>{' '}
                          {flexRender(
                            id?.column?.columnDef.cell,
                            id?.getContext()
                          )}
                        </li>

                        {ref?.getValue<string | undefined>() && (
                          <li>
                            <b>{'Referencia' + ':'}</b>{' '}
                            {flexRender(
                              ref?.column?.columnDef.cell,
                              ref?.getContext()
                            )}
                          </li>
                        )}
                      </ul>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )
          })}
        </TableBody>
      </Table>
    )

  return (
    <Table>
      <TableHeader className="rounded-t-xl bg-muted">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index, list) => {
              if (rol?.rolName !== 'Administrador' && index === 0) return
              return (
                <TableHead
                  key={header.id}
                  className={clsx(
                    'first:sticky first:left-0 last:sticky last:right-0',
                    {
                      'rounded-tl-xl':
                        (rol?.rolName === 'Administrador' && index === 0) ||
                        (rol?.rolName !== 'Administrador' && index === 1),
                      'rounded-tr-xl': index === list?.length - 1,
                    }
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
              {row.getVisibleCells().map((cell, index) => {
                if (rol?.rolName !== 'Administrador' && index === 0) return
                return (
                  <TableCell
                    key={cell.id}
                    className={clsx(
                      'first:sticky first:left-0 last:sticky last:right-0'
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={desktop.length} className="h-24 text-center">
              {text.search[404]}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

const text = {
  search: {
    404: 'No se encontraron resultados',
  },
}
