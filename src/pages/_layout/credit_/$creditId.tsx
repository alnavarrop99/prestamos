import {
  Link,
  Navigate,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { type TCREDIT_GET, getCreditById, TCREDIT_GET_FILTER } from '@/api/credit'
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
import { getFrecuencyById } from '@/lib/type/frecuency'
import { createContext } from 'react'
import { TMORA_TYPE, getMoraTypeById } from '@/lib/type/moraType'
import { _creditSelected, useCreditFilter } from '@/pages/_layout/credit'

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  loader: getCreditById,
})

/* eslint-disable-next-line */
interface TCreditByIdProps {
  credit?: TCREDIT_GET
  open?: boolean
}

export const _selectedCredit = createContext<[TCREDIT_GET] | undefined>(undefined)

/* eslint-disable-next-line */
export function CreditById({
  children,
  open: _open,
  credit: _credit = {} as TCREDIT_GET,
}: React.PropsWithChildren<TCreditByIdProps>) {
  const  creditDB = Route.useLoaderData() ?? _credit
  const { open = _open, setOpen } = useStatus() 
  const navigate = useNavigate()
  const { creditFilter } = useCreditFilter() 

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const mora = creditDB?.cuotas?.at(-1)?.valor_de_mora
  const moraType = getMoraTypeById({ moraTypeId: creditDB?.tipo_de_mora_id })?.nombre
  const moraStatus = !!mora && mora > 0

  const cuoteValue = creditDB?.cuotas?.at(-1)?.valor_de_cuota
  const interestValue = (creditDB?.tasa_de_interes/100) * (cuoteValue ?? 1)
  const moreValue = moraType === "Porciento" ? ((creditDB?.valor_de_mora + creditDB?.tasa_de_interes)/100 * (cuoteValue ?? 1)) : creditDB?.valor_de_mora

  return (
    <_selectedCredit.Provider value={[ creditDB ]}>
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
        <ul className="flex flex-col gap-2 px-2 [&>li]:space-x-2">
          <li>
            <b>{text.details.status + ":"}</b>
            <Switch
              className={'cursor-not-allowed'}
              checked={!!creditDB?.estado}
            >
            </Switch>
          </li>
          <li>
            <b>{text.details.name + ":"}</b> <span>{ creditFilter?.nombre_del_cliente + "." }</span>
          </li>
          <li>
            <b>{text.details.date + ":"}</b> <span>{ format(creditDB?.fecha_de_aprobacion, 'dd-MM-yyyy') + '.'}</span>
          </li>
          <li>
            <b>{text.details.aditionalsDays + ":"}</b> <span>{creditDB?.dias_adicionales + '.'}</span>
          </li>
          <li>
            <b>{text.details.amount + ":"}</b> <span>{'$' + creditDB?.monto + '.'}</span>
          </li>
          <li> 
            <b>{text.details.cuote + ":"}</b> <span>{'$' + cuoteValue + '.'}</span>
          </li>
          <li>
            <b>{text.details.cuoteNumber + ":"}</b> <span>{creditDB.pagos?.length + '/' + creditDB.numero_de_cuotas + '.'}</span>
          </li>
          <li>
            <b>{text.details.frecuency + ":"}</b> <span>{getFrecuencyById({ frecuencyId: creditDB?.frecuencia_del_credito_id })?.nombre  + '.'}</span>
          </li>
          <li className={clsx({ "[&>b]:text-green-700": !moraStatus, "[&>b]:line-through": moraStatus })}>
            <b>{text.details.interest + ":"}</b> <span>{creditDB?.tasa_de_interes + '% de $' + cuoteValue + "."}</span>
          </li>
          <li className={clsx({ "[&>b]:text-destructive": moraStatus, "[&>b]:line-through": !moraStatus })}>
            <b>{text.details.installmants(moraType) + ":"}</b> 
            { moraType === "Valor fijo" ?
              <span >{'$' + moreValue + '.'}</span> :
              <span>{creditDB?.valor_de_mora + "% de $" + ((cuoteValue ?? 0)) + '.'}</span> }
          </li>
          <li> 
            <b>{text.details.pay + ":"}</b> <span>{'$' + ( (moraStatus ? ( (cuoteValue ?? 0) + moreValue ) : ( (cuoteValue ?? 0) + interestValue ))).toFixed(2) + '.'}</span>
          </li>
          <li>
            <b>{text.details.comment + ":"}</b> <p>{creditDB?.comentario}</p>
          </li>
        </ul>
        <Separator />
        {!!creditDB?.cuotas?.length && !!creditDB?.pagos?.length && (
          <h2 className="text-2xl font-bold"> {text.cuotes.title} </h2>
        )}
        {!!creditDB?.cuotas?.length && !!creditDB?.pagos?.length && (
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
              {creditDB?.cuotas.map(({id, fecha_de_pago, valor_pagado, valor_de_cuota, valor_de_mora, pagada, numero_de_cuota, fecha_de_aplicacion_de_mora}) => (
                <TableRow key={id}>
                  <TableCell>
                    <p><b>{numero_de_cuota}</b></p>
                  </TableCell>
                  <TableCell>
                    <p>{format(fecha_de_pago, 'MM-dd-yyyy')}</p>
                  </TableCell>
                  <TableCell>
                    <p><b>$</b>
                    {valor_pagado?.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <p><b>$</b>
                    {valor_de_cuota?.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{ valor_de_mora > 0 ? format(fecha_de_aplicacion_de_mora ?? "", 'MM-dd-yyyy') : "-"}</p>
                  </TableCell>
                  <TableCell>
                    <p>{valor_de_mora > 0 ? <><b>$</b> {valor_de_mora?.toFixed(2) }</> : "-"}</p>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={pagada}
                      className={'cursor-not-allowed'}
                    ></Switch>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="font-bold">
                  <p>{text.cuotes.total + ":"}</p>
                </TableCell>
                <TableCell colSpan={2} className="text-right">
                  <GetPay credit={creditDB} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
      </_selectedCredit.Provider>
  )
}

CreditById.dispalyname = 'CreditById'

function GetPay({ credit }: { credit: TCREDIT_GET }) {
  if (!credit.cuotas || !credit.pagos) return;

  return (
    <p>
      <b>$</b>
      {credit.pagos
        .map(({ valor_del_pago }) => valor_del_pago)
        .reduce((prev, acc) => (acc += prev))?.toFixed(2)}
      <b>&#8193;/&#8193;</b>
      <b>$</b>
      {credit?.monto}
    </p>
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
    cuoteNumber: 'Numero de cuotas',
    cuote: 'Monto por cuota',
    pay: 'Monto a pagar',
    installmants: ( type: TMORA_TYPE ) => type === "Valor fijo" ? 'Monta por mora' : "Tasa por mora",
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
    installmantsDate: 'Fecha de aplicacion de mora',
    payValue: 'Monto del pago',
    payCuote: 'Monto cuota',
    payInstallmants: 'Monto de la mora',
    payStatus: 'Pagada',
    total: 'Monto total',
  },
  pay: {
    title: 'Historial de pagos:',
  },
}
