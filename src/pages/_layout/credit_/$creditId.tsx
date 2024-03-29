import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { type TCREDIT_GET, getCreditById } from '@/api/credit'
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
import { useStatus } from '@/lib/context/layout'
import { useEffect } from 'react'
import { useContextCredit } from '@/pages/_layout/credit_/-hook'
import { getFrecuencyById } from '@/api/frecuency'

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  loader: getCreditById,
})

/* eslint-disable-next-line */
interface TCreditByIdProps {
  credit?: TCREDIT_GET
  open?: boolean
}

/* eslint-disable-next-line */
export function CreditById({
  children,
  open: _open,
  credit: _credit = {} as TCREDIT_GET,
}: React.PropsWithChildren<TCreditByIdProps>) {
  const creditDB = Route.useLoaderData() ?? _credit
  const { open = _open, setOpen } = useStatus() 
  const navigate = useNavigate()
  const { creditById, setCreditById } = useContextCredit()
  useEffect( () => {
    if(!creditById){
      setCreditById(creditDB) 
    }
  }, [creditDB])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  if( !creditById ) return <></>;

  return (
    <>
      {!children && <Navigate to={Route.to} />}
      <div className="space-y-4">
        <div className="flex gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="ms-auto" asChild>
              <Link to={'./print'}>
                <Button variant="ghost" className='hover:ring hover:ring-primary'>
                  <Printer />
                </Button>
              </Link>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Link to={'./pay'}>
                <Button
                  variant="default"
                  className={clsx('bg-green-500 hover:bg-green-700')}
                >
                  
                  <Pay />
                </Button>
              </Link>
            </DialogTrigger>
            <Link to={'./update'}>
              <Button variant="default"> {text.button.update} </Button>
            </Link>

            <DialogTrigger asChild>
              <Link to={'./delete'}>
                <Button variant="default" className="hover:bg-destructive">
                  
                  {text.button.delete}
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
            
            <b>{text.details.status}:</b>
            <Switch
              className={'cursor-not-allowed'}
              checked={!!creditById?.estado}
            >
              {creditById?.estado}
            </Switch>
          </div>
          <div>
            
            <b>{text.details.name}:</b> { creditById?.nombre_del_cliente + "." }
          </div>
          <div>
            
            <b>{text.details.amount}:</b> {'$' + Math.round(creditById?.monto) + '.'}
          </div>
          <div>
            
            <b>{text.details.cuote}:</b>
            {'$' + Math.round(creditById?.valor_de_cuota) + '.'}
          </div>
          <div>
            
            <b>{text.details.interest}:</b> {Math.round(creditById?.tasa_de_interes * 100) + '%'}
          </div>
          <div>
            
            <b>{text.details.pay}:</b>
            {creditById.pagos?.length + '/' + creditById.numero_de_cuotas + '.'}
          </div>
          <div>
            
            <b>{text.details.frecuency}:</b>
            {getFrecuencyById({ frecuencyId: creditById?.frecuencia_del_credito_id })?.nombre  + '.'}
          </div>
          <div>
            
            <b>{text.details.date}:</b>
            {creditById?.fecha_de_aprobacion
              ? format(creditById?.fecha_de_aprobacion, 'dd-MM-yyyy') + '.'
              : null}
          </div>
          <div>
            
            <b>{text.details.comment}:</b> {creditById?.comentario}
          </div>
          { creditById?.valor_de_mora && <div>
            
            <b>{text.details.installmants}:</b>
            {'$' + Math.round(creditById?.valor_de_mora) + '.'}
          </div>}
          <div>
            
            <b>{text.details.aditionalsDays}:</b>
            {creditById?.dias_adicionales + '.'}
          </div>
        </div>
        <Separator />
        {!!creditById?.cuotas?.length && !!creditById?.pagos?.length && (
          <h2 className="text-2xl font-bold"> {text.cuotes.title} </h2>
        )}
        {!!creditById?.cuotas?.length && !!creditById?.pagos?.length && (
          <Table className="w-full px-4 py-2">
            <TableHeader className='bg-muted'>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{text.cuotes.payDate}</TableHead>
                <TableHead>{text.cuotes.payValue}</TableHead>
                <TableHead>{text.cuotes.payCuote}</TableHead>
                <TableHead>{text.cuotes.installmantsDate}</TableHead>
                <TableHead>{text.cuotes.payInstallmants}</TableHead>
                <TableHead>{text.cuotes.payStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditById?.pagos.map((payment, i) => (
                <TableRow key={payment?.id}>
                  <TableCell>
                    
                    <b>{creditById?.cuotas?.[i]?.numero_de_cuota}</b>
                  </TableCell>
                  <TableCell>
                    
                    {payment?.fecha_de_pago
                      ? format(payment?.fecha_de_pago, 'MM-dd-yyyy')
                      : null}
                  </TableCell>
                  <TableCell>
                    
                    <b>$</b>
                    {Math.round(payment?.valor_del_pago)}
                  </TableCell>
                  <TableCell>
                    
                    <b>$</b>
                    {Math.round(creditById?.cuotas?.[i]?.valor_de_cuota ?? 0)}
                  </TableCell>
                  <TableCell>
                    
                    {creditById?.cuotas?.[i]?.fecha_de_aplicacion_de_mora
                      ? format(creditById?.cuotas?.[i]?.fecha_de_aplicacion_de_mora ?? "", 'MM-dd-yyyy')
                      : null}
                  </TableCell>
                  <TableCell>
                    
                    <b>$</b>
                    {creditById?.cuotas?.[i]?.valor_de_mora ? Math.round(creditById?.cuotas?.[i]?.valor_de_mora ?? 0) : "-"}
                  </TableCell>
                  <TableCell>
                    
                    <Switch
                      checked={creditById?.cuotas?.[i]?.pagada}
                      className={'cursor-not-allowed'}
                    ></Switch>
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
                  <GetPay credit={creditById} />
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

function GetPay({ credit }: { credit: TCREDIT_GET }) {
  if (!credit.cuotas || !credit.pagos) return;

  return (
    <>
      <b>$</b>
      {Math.round(credit.cuotas
        .map((pay) => pay?.valor_pagado)
        .reduce((prev, acc) => (acc += prev)))}
      <b>&#8193;/&#8193;</b>
      <b>$</b>
      {Math.round(credit?.monto)}
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
    name: 'Nombre del cliente',
    amount: 'Monto total',
    interest: 'Tasa de interes',
    pay: 'Pagos realizados',
    cuote: 'Monta Cuota',
    installmants: 'Monta Mora',
    frecuency: 'Frecuencia del credito',
    status: 'Estado',
    date: 'Fecha de aprobacion',
    comment: 'Comentario',
    cuotes: 'Numero de Cuotas',
    aditionalsDays: 'Dias adicionales',
  },
  cuotes: {
    title: 'Historial de pagos:',
    payDate: 'Fecha de pago',
    installmantsDate: 'Fecha de aplicacion de mora',
    payValue: 'Monto del Pago',
    payCuote: 'Monto Cuota',
    payInstallmants: 'Monto de la mora',
    payStatus: 'Pagada',
    total: 'Monto Total',
  },
  pay: {
    title: 'Historial de pagos:',
  },
}
