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
import { getFrecuencyById } from '@/lib/type/frecuency'
import { createContext, useMemo } from 'react'
import { TMORA_TYPE, getMoraTypeById } from '@/lib/type/moraType'
import { _creditSelected } from '@/pages/_layout/credit'
import { TCLIENT_GET, getClientById } from '@/api/clients'

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  loader: async ({ params }) => {
    const credit = await getCreditById({ params })
    const client = await getClientById({ params: { clientId: ""+credit?.owner_id } })
    return ({
      credit,
      client
    })
  },
})

/* eslint-disable-next-line */
interface TCreditByIdProps {
  credit?: TCREDIT_GET
  open?: boolean
}

export const _selectedCredit = createContext<[TCREDIT_GET] | undefined>(undefined)
export const _clientContext = createContext<[TCLIENT_GET] | undefined>(undefined)

/* eslint-disable-next-line */
export function CreditById({
  children,
  open: _open,
  credit: _credit = {} as TCREDIT_GET,
}: React.PropsWithChildren<TCreditByIdProps>) {
  const  { credit, client } = Route.useLoaderData() ?? _credit
  const { open = _open, setOpen } = useStatus() 
  const navigate = useNavigate()

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const onPrint: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    onOpenChange(!open)
  }

  const table = useMemo( () => ( credit?.pagos?.map( ( _, i, list ) => ( { payment: list?.[i], cuote: credit?.cuotas?.[ i ] }))), [ credit?.pagos, credit?.cuotas ])

  const mora = credit?.cuotas?.at(-1)?.valor_de_mora
  const moraType = getMoraTypeById({ moraTypeId: credit?.tipo_de_mora_id })?.nombre
  const moraStatus = !!mora && mora > 0

  const cuoteValue = credit?.cuotas?.at(-1)?.valor_de_cuota
  const interestValue = (credit?.tasa_de_interes/100) * (cuoteValue ?? 1)
  const moreValue = moraType === "Porciento" ? ((credit?.valor_de_mora + credit?.tasa_de_interes)/100 * (cuoteValue ?? 1)) : credit?.valor_de_mora

  return (
    <_clientContext.Provider value={[ client ]}>
    <_selectedCredit.Provider value={[ credit ]}>
      {!children && <Navigate to={Route.to} />}
      <div className="space-y-4">
        <div className="flex gap-2">
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="ms-auto" asChild>
              <Link to={'./print'} 
                disabled={credit?.pagos?.length <= 0}>
                <Button variant="outline"
                    className='hover:ring hover:ring-primary' 
                    disabled={credit?.pagos?.length <= 0}>
                  <Printer />
                </Button>
              </Link>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Link to={'./pay'}>
                <Button
                  variant="default"
                  className={clsx('bg-success hover:bg-success hover:ring-4 ring-success-foreground')}
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
              checked={!!credit?.estado}
            >
            </Switch>
          </li>
          <li>
            <b>{text.details.name + ":"}</b> <span>{ client?.nombres + " " + client?.apellidos + "." }</span>
          </li>
          <li>
            <b>{text.details.date + ":"}</b> <span>{ format(credit?.fecha_de_aprobacion, 'dd-MM-yyyy') + '.'}</span>
          </li>
          <li>
            <b>{text.details.aditionalsDays + ":"}</b> <span>{credit?.dias_adicionales + '.'}</span>
          </li>
          <li>
            <b>{text.details.amount + ":"}</b> <span>{'$' + credit?.monto + '.'}</span>
          </li>
          <li> 
            <b>{text.details.cuote + ":"}</b> <span>{'$' + cuoteValue + '.'}</span>
          </li>
          <li>
            <b>{text.details.cuoteNumber + ":"}</b> <span>{credit.pagos?.length + '/' + credit.numero_de_cuotas + '.'}</span>
          </li>
          <li>
            <b>{text.details.frecuency + ":"}</b> <span>{getFrecuencyById({ frecuencyId: credit?.frecuencia_del_credito_id })?.nombre  + '.'}</span>
          </li>
          <li className={clsx({ "[&>b]:text-success": !moraStatus, "[&>b]:line-through": moraStatus })}>
            <b>{text.details.interest + ":"}</b> <span>{credit?.tasa_de_interes + '% de $' + cuoteValue + "."}</span>
          </li>
          <li className={clsx({ "[&>b]:text-destructive": moraStatus, "[&>b]:line-through": !moraStatus })}>
            <b>{text.details.installmants(moraType) + ":"}</b> 
            { moraType === "Valor fijo" ?
              <span >{'$' + moreValue + '.'}</span> :
              <span>{credit?.valor_de_mora + "% de $" + ((cuoteValue ?? 0)) + '.'}</span> }
          </li>
          <li> 
            <b>{text.details.pay + ":"}</b> <span>{'$' + ( (moraStatus ? ( (cuoteValue ?? 0) + moreValue ) : ( (cuoteValue ?? 0) + interestValue ))).toFixed(2) + '.'}</span>
          </li>
          <li>
            <b>{text.details.comment + ":"}</b> <p>{credit?.comentario}</p>
          </li>
        </ul>
        <Separator />
        {!!credit?.cuotas?.length && !!credit?.pagos?.length && (
          <h2 className="text-2xl font-bold"> {text.cuotes.title} </h2>
        )}
        {!!credit?.cuotas?.length && !!credit?.pagos?.length && (
          <Table className="w-full px-4 py-2">
            <TableHeader className='bg-muted'>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{text.cuotes.payDate}</TableHead>
                <TableHead>{text.cuotes.payValue}</TableHead>
                <TableHead>{text.cuotes.installmantsDate}</TableHead>
                <TableHead>{text.cuotes.payInstallmants}</TableHead>
                <TableHead>{text.cuotes.payStatus}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {  table?.map( ( {payment, cuote}, index ) =>  (
                <TableRow key={index} className='group'>
                  <TableCell>
                    <p><b>{index}</b></p>
                  </TableCell>
                  <TableCell>
                    {/* fix this date because returt a invalid date time */}
                    <ul>
                      <li className='before:content-["_-_"] before:font-bold before:text-destructive'>{cuote?.fecha_de_pago?.slice(0,10)}</li>
                      <li className='before:content-["_+_"] before:font-bold before:text-success'>{format(payment?.fecha_de_pago, 'yyyy-MM-dd')}</li>
                    </ul>
                  </TableCell>
                  <TableCell>
                    <p><b>$</b>
                    {payment?.valor_del_pago?.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{cuote?.valor_de_mora > 0 ? format(cuote?.fecha_de_aplicacion_de_mora ?? "", 'dd-MM-yyyy') : "-"}</p>
                  </TableCell>
                  <TableCell>
                    <p>{cuote?.valor_de_mora > 0 ? <><b>$</b> {cuote?.valor_de_mora?.toFixed(2) }</> : "-"}</p>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={cuote?.pagada}
                      className={'cursor-not-allowed'}
                    ></Switch>
                  </TableCell>
                  <TableCell>
                    <Link to={'./print'} search={{ index }} >
                      <Button 
                          onClick={onPrint}
                          variant="ghost"
                          className='hover:ring hover:ring-primary opacity-0 group-hover:opacity-100' 
                          disabled={credit?.pagos?.length <= 0}>
                        <Printer />
                      </Button>
                    </Link>
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
                  <GetPay credit={credit} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
      </_selectedCredit.Provider>
      </_clientContext.Provider>
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
    user: 'Cobrador',
    ref: 'Referencia',
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
    payInstallmants: 'Monto de la mora',
    payStatus: 'Pagada',
    total: 'Monto total',
  },
  pay: {
    title: 'Historial de pagos:',
  },
}
