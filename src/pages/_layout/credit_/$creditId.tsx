import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { type TCredit, getCreditIdRes } from '@/api/credit'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CircleDollarSign as Pay } from 'lucide-react'
import { format } from 'date-fns'
import { useClientStatus } from '@/lib/context/client'

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  loader: getCreditIdRes,
})

/* eslint-disable-next-line */
interface TCreditByIdProps {
  credit?: TCredit
  open?: boolean
}

/* eslint-disable-next-line */
export function CreditById({
  children,
  open: _open = false,
  credit: _credit = {} as TCredit,
}: React.PropsWithChildren<TCreditByIdProps>) {
  const credit = Route.useLoaderData() ?? _credit
  const { open = _open, setStatus } = useClientStatus()
  const navigate = useNavigate()

  const onOpenChange = (checked: boolean) => {
    if (open) {
      navigate({ to: Route.to })
    }
    setStatus({ open: checked })
  }

  return (
    <>
      {!children && <Navigate to={Route.to} />}
      <div className="space-y-4">
        <div className="flex gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="ms-auto" asChild>
              <Link to={'./print'}>
                <Button variant="ghost">
                  {' '}
                  <Printer />{' '}
                </Button>
              </Link>
            </DialogTrigger>

            <DialogTrigger asChild>
              <Link to={'./pay'}>
                <Button
                  variant="default"
                  className={clsx('bg-green-500 hover:bg-green-700')}
                >
                  {' '}
                  <Pay />{' '}
                </Button>
              </Link>
            </DialogTrigger>

            <DialogTrigger asChild>
              <Link to={'./update'}>
                <Button> {text.button.update} </Button>
              </Link>
            </DialogTrigger>

            <DialogTrigger asChild>
              <Link to={'./delete'}>
                <Button className="hover:bg-destructive">
                  {' '}
                  {text.button.delete}{' '}
                </Button>
              </Link>
            </DialogTrigger>

            {children ?? <Outlet />}
          </Dialog>
        </div>
        <Separator />
        <h2 className="text-2xl font-bold"> {text.details.title} </h2>
        <div className="flex flex-col gap-2 px-2 [&>div]:flex [&>div]:gap-2">
          <div>
            {' '}
            <b>{text.details.status}:</b>{' '}
            <Switch
              className={clsx({ 'cursor-not-allowed': true })}
              checked={credit?.estado}
            >
              {credit?.estado}
            </Switch>
          </div>
          <div>
            {' '}
            <b>{text.details.amount}:</b> {'$' + credit?.cantidad + '.'}
          </div>
          <div>
            {' '}
            <b>{text.details.cuote}:</b>{' '}
            {'$' + credit?.cuotas?.[0]?.valor_de_cuota + '.'}
          </div>
          <div>
            {' '}
            <b>{text.details.interest}:</b> {credit?.porcentaje + '%'}
          </div>
          <div>
            {' '}
            <b>{text.details.pay}:</b>{' '}
            {credit.pagos.length + '/' + credit.numero_de_cuotas + '.'}
          </div>
          <div>
            {' '}
            <b>{text.details.frecuency}:</b>{' '}
            {credit?.frecuencia_del_credito?.nombre + '.'}
          </div>
          <div>
            {' '}
            <b>{text.details.date}:</b>{' '}
            {credit?.fecha_de_aprobacion
              ? format(credit?.fecha_de_aprobacion, 'MM-dd-yyyy') + '.'
              : null}
          </div>
          <div>
            {' '}
            <b>{text.details.comment}:</b> {credit?.comentario}
          </div>
          <div>
            {' '}
            <b>{text.details.installmants}:</b>{' '}
            {'$' + credit?.valor_de_mora + '.'}
          </div>
          <div>
            {' '}
            <b>{text.details.aditionalsDays}:</b>{' '}
            {credit?.dias_adicionales + '.'}
          </div>
        </div>
        <Separator />
        {credit?.cuotas?.length && credit?.pagos?.length && (
          <h2 className="text-2xl font-bold"> {text.cuotes.title} </h2>
        )}
        {credit?.cuotas?.length && credit?.pagos?.length && (
          <Table className="w-fit px-4 py-2">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{text.cuotes.payDate}</TableHead>
                <TableHead>{text.cuotes.installmantsDate}</TableHead>
                <TableHead>{text.cuotes.payValue}</TableHead>
                <TableHead>{text.cuotes.payCuote}</TableHead>
                <TableHead>{text.cuotes.payInstallmants}</TableHead>
                <TableHead>{text.cuotes.payStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credit?.cuotas.map((cuota) => (
                <TableRow key={cuota?.id}>
                  <TableCell>
                    {' '}
                    <b>{cuota?.id}</b>{' '}
                  </TableCell>
                  <TableCell>
                    {' '}
                    {cuota?.fecha_de_pago
                      ? format(cuota?.fecha_de_pago, 'MM-dd-yyyy')
                      : null}{' '}
                  </TableCell>
                  <TableCell>
                    {' '}
                    {cuota?.fecha_de_aplicacion_de_mora
                      ? format(cuota?.fecha_de_aplicacion_de_mora, 'MM-dd-yyyy')
                      : null}{' '}
                  </TableCell>
                  <TableCell>
                    {' '}
                    <b>$</b>
                    {cuota?.valor_pagado}{' '}
                  </TableCell>
                  <TableCell>
                    {' '}
                    <b>$</b>
                    {cuota?.valor_de_cuota}{' '}
                  </TableCell>
                  <TableCell>
                    {' '}
                    <b>$</b>
                    {cuota?.valor_de_mora}{' '}
                  </TableCell>
                  <TableCell>
                    {' '}
                    <Switch
                      checked={cuota?.pagada}
                      className={clsx('cursor-not-allowed')}
                    ></Switch>{' '}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="font-bold">
                  {text.cuotes.total}:
                </TableCell>
                <TableCell colSpan={2} className="text-right">
                  {' '}
                  <GetPay credit={credit} />{' '}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </>
  )
}

CreditById.dispalyname = 'CreditById'

function GetPay({ credit }: { credit: TCredit }) {
  if (!credit.cuotas || !credit.pagos) return

  return (
    <>
      {' '}
      <b>$</b>{' '}
      {credit.pagos
        .map((pay) => pay?.valor_del_pago ?? 0)
        .reduce((prev, acc) => (acc += prev))
        .toFixed(2)}
      <b>&#8193;/&#8193;</b>
      <b>$</b>{' '}
      {credit.cuotas
        .map((cuote) => cuote?.valor_de_cuota ?? 0)
        .reduce((prev, acc) => (acc += prev))
        .toFixed(2)}{' '}
    </>
  )
}

const text = {
  title: 'Detalles:',
  button: {
    update: 'Editar',
    delete: 'Eliminar',
  },
  details: {
    title: 'Detalles del prestamo:',
    id: 'Numero del credito',
    amount: 'Monto total',
    interest: 'Tasa de interes',
    pay: 'Pagos realizados',
    cuote: 'Monta de la cuota',
    installmants: 'Monta de la mora',
    frecuency: 'Frecuencia del credito',
    status: 'Estado',
    date: 'Fecha de aprobacion',
    comment: 'Comentario',
    cuotes: 'Numero de cuotas',
    aditionalsDays: 'Dias adicionales',
  },
  cuotes: {
    title: 'Historial de pagos:',
    payDate: 'Fecha de pago',
    installmantsDate: 'Fecha de mora',
    payValue: 'Monto del pago',
    payCuote: 'Monto de la cuota',
    payInstallmants: 'Monto de la mora',
    payStatus: 'Pagada',
    total: 'Monto Total',
  },
  pay: {
    title: 'Historial de pagos:',
  },
}
