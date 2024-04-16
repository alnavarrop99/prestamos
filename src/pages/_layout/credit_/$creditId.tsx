import {
  Link,
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
import { Annoyed, Printer } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CircleDollarSign as Pay } from 'lucide-react'
import { format, isValid } from 'date-fns'
import { useStatus } from '@/lib/context/layout'
import { getFrecuencyById } from '@/lib/type/frecuency'
import { createContext, useEffect, useMemo, useState } from 'react'
import { type TMORA_TYPE, getMoraTypeById } from '@/lib/type/moraType'
import { type TCLIENT_GET } from '@/api/clients'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@tanstack/react-router'
import { queryClient } from '@/pages/__root'
import { queryOptions, useIsMutating, useSuspenseQuery } from '@tanstack/react-query'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import { deletePaymentByIdOpt, updateCreditByIdOpt } from '@/pages/_layout/credit_/$creditId_/update.confirm'
import { postCreditOpt } from '@/pages/_layout/credit/new'
import { deleteCreditByIdOpt } from '@/pages/_layout/credit_/$creditId/delete'

export const getCreditByIdOpt = ( { creditId }: { creditId: string }  ) => ({
  queryKey: ["get-credit-by-id", { creditId }],
  queryFn: () => getCreditById({ params: { creditId } }),
})

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  pendingComponent: Pending,
  errorComponent: Error,
  loader: async ({ params }) => {
    const credit = queryClient.ensureQueryData( queryOptions(getCreditByIdOpt( params )))
    const client = queryClient.ensureQueryData( queryOptions(getClientByIdOpt( { clientId: "" + (await credit)?.owner_id } )))
    return ({ credit, client })
  },
})

const ROW = 8
const COL = 6
export const _credit = createContext<TCREDIT_GET | undefined>(undefined)
export const _client = createContext<TCLIENT_GET | undefined>(undefined)

/* eslint-disable-next-line */
export function CreditById() {
  const { creditId } = Route.useParams()
  const  { data: creditRes, refetch: refetchCredit } = useSuspenseQuery( queryOptions( getCreditByIdOpt({ creditId }) ) )
  const  { data: clientRes, refetch: refetchClient } = useSuspenseQuery( queryOptions( getClientByIdOpt( { clientId: "" + creditRes.owner_id } ) ) )
  const [ credit, setCredit ] = useState(creditRes)
  const [ client, setClient ] = useState(clientRes)
  const { open, setOpen } = useStatus() 
  const navigate = useNavigate()

  const isUpdateCredit = useIsMutating( { status: "success", mutationKey: updateCreditByIdOpt.mutationKey } )
  const isNewCredit = useIsMutating( { status: "success", mutationKey: postCreditOpt.mutationKey } )
  const isDeleteCredit = useIsMutating( { status: "success", mutationKey: deleteCreditByIdOpt.mutationKey } )
  const isNewPayment = useIsMutating( { status: "success", mutationKey: deletePaymentByIdOpt.mutationKey } )
  const isDeletePayment = useIsMutating( { status: "success", mutationKey: deletePaymentByIdOpt.mutationKey } )
  const isUpdatePayment = useIsMutating( { status: "success", mutationKey: updateCreditByIdOpt.mutationKey } )

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

  useEffect(() => {
    if( creditRes ){
      refetchCredit()?.then( ({ data }) => {
        if( !data ) return;
        setCredit(data)
      } )
    }

    if( clientRes ){
      refetchClient()?.then( ({ data }) => {
        if( !data ) return;
        setClient(data)
      } )
    }
        return () => {
    }
  }, [ isUpdateCredit, isNewCredit, isDeleteCredit, isNewPayment, isDeletePayment, isUpdatePayment ])

  const mora = credit?.cuotas?.at(-1)?.valor_de_mora
  const moraType = getMoraTypeById({ moraTypeId: credit?.tipo_de_mora_id })?.nombre
  const moraStatus = !!mora && mora > 0

  const cuoteValue = credit?.cuotas?.at(-1)?.valor_de_cuota
  const interestValue = (credit?.tasa_de_interes/100) * (cuoteValue ?? 1)
  const moreValue = moraType === "Porciento" ? ((credit?.valor_de_mora + credit?.tasa_de_interes)/100 * (cuoteValue ?? 1)) : credit?.valor_de_mora

  return (
    <_client.Provider value={client}>
    <_credit.Provider value={credit}>
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
            <Outlet />
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
              { isValid( credit?.fecha_de_aprobacion ) &&
          <li>
              <b>{text.details.date + ":"}</b> <span>{ format(credit?.fecha_de_aprobacion, 'dd-MM-yyyy') + '.'}</span> 
          </li>
              }
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
          <Table className="px-4 py-2">
            <TableHeader className='bg-muted [&_th]:text-center'>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{text.cuotes.payDate}</TableHead>
                <TableHead>{text.cuotes.payValue}</TableHead>
                <TableHead>{text.cuotes.installmantsDate}</TableHead>
                <TableHead>{text.cuotes.payInstallmants}</TableHead>
                <TableHead>{text.cuotes.payStatus}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='[&_td>*]:text-center'>
              {  table?.map( ( {payment, cuote}, index ) =>  (
                <TableRow key={index} className='group'>
                  <TableCell className='flex justify-center items-center w-20 relative'>
                    <p className='font-bold opacity-100 group-hover:opacity-0 trasition delay-150 duration-300'>{index+1}</p>
                    <Link to={'./print'} search={{ index }} className='absolute z-index' >
                      <Button 
                          onClick={onPrint}
                          variant="ghost"
                          className='hover:ring hover:ring-primary opacity-0 group-hover:opacity-100' 
                          disabled={credit?.pagos?.length <= 0}>
                        <Printer />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {/* fix this date because returt a invalid date time */}
                    { isValid(cuote?.fecha_de_pago) && isValid(payment?.fecha_de_pago) && <ul>
                      <li className='before:content-["_-_"] before:font-bold before:text-destructive'>{format(cuote?.fecha_de_pago, "dd/MM/yyyy")}</li>
                      <li className='before:content-["_+_"] before:font-bold before:text-success'>{format(payment?.fecha_de_pago, 'dd/MM/yyyy')}</li>
                    </ul>
                    }
                  </TableCell>
                  <TableCell>
                    <p><b>$</b>
                    {payment?.valor_del_pago?.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                      { isValid(cuote?.fecha_de_aplicacion_de_mora) &&  <p>{cuote?.valor_de_mora > 0 ? format(cuote?.fecha_de_aplicacion_de_mora ?? "", 'dd-MM-yyyy') : "-"}</p>
 }
                  </TableCell>
                  <TableCell>
                    <p>{cuote?.valor_de_mora > 0 ? <><b>$</b> {cuote?.valor_de_mora?.toFixed(2) }</> : "-"}</p>
                  </TableCell>
                  <TableCell className='flex justify-center'>
                    <Switch
                      checked={cuote?.pagada}
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
                  <GetPay credit={credit} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
      </_credit.Provider>
      </_client.Provider>
  )
}

/* eslint-disable-next-line */
export function Pending() {
  return <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton className='w-48 h-8' />
      <Skeleton className='w-8 h-8 rounded-full' />
      <Skeleton className='ms-auto w-10 h-10' />
      <Skeleton className='w-10 h-10' />
      <Skeleton className='w-24 h-10' />
      <Skeleton className='w-24 h-10' />
    </div>
    <Separator />
    <Skeleton className='w-64 h-8' />
    <div className='px-4 space-y-4 [&>div]:flex [&>div:last-child]:flex-col [&>div]:gap-2'>
      <div className='flex items-end'> <Skeleton className='w-24 h-6' /> <Skeleton className='w-24 h-8' /> </div>
      <div> <Skeleton className='w-36 h-6' /> <Skeleton className='w-24 h-6' /> </div>
      <div> <Skeleton className='w-32 h-6' /> <Skeleton className='w-10 h-6' /> </div>
      <div> <Skeleton className='w-32 h-6' /> <Skeleton className='w-16 h-6' /> </div>
      <div> <Skeleton className='w-36 h-6' /> <Skeleton className='w-24 h-6' /> </div>
      <div> <Skeleton className='w-32 h-6' /> <Skeleton className='w-10 h-6' /> </div>
      <div> <Skeleton className='w-36 h-6' /> <Skeleton className='w-24 h-6' /> </div>
      <div> <Skeleton className='w-36 h-6' /> <Skeleton className='w-24 h-6' /> </div>
      <div> <Skeleton className='w-24 h-6' /> <Skeleton className='w-24 h-6' /> </div>
      <div> 
        <Skeleton className='w-36 h-6' />
        <Skeleton className='mx-4 w-[50rem] h-6' />
        <Skeleton className='mx-4 w-[50rem] h-6' />
        <Skeleton className='mx-4 w-[12rem] h-6' />
      </div>
    </div>
    <Separator />
    <Skeleton className='w-64 h-8' />
    <div className='px-4'>
      <table className='ring-4 ring-transparent rounded-md w-full border-separate border-spacing-2'>
      {Array.from( { length: ROW } )?.map( (_, index) => 
        <tr key={index}>
          {Array.from( { length: COL } )?.map( (_, index) => 
            <td key={index} className='last:w-12 first:w-24'> <Skeleton className='w-full h-9' /> </td>
          )}
        </tr>
        )}
      </table>
    </div>

  </div>
}

/* eslint-disable-next-line */
export function Error() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    history.back()
  }
  return <div className='flex items-center h-full [&>svg]:w-32 [&>svg]:stroke-destructive [&>svg]:h-32 items-center justify-center gap-4 [&_h1]:text-2xl'>
      <Annoyed  className='animate-bounce' />
      <div className='space-y-2'>
        <h1 className='font-bold'>{text.error}</h1>
        <p className='italic'>{text.errorDescription}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className='text-sm'> {text.back + "."} </Button>
      </div>
    </div>
}

/* eslint-disable-next-line */
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

CreditById.dispalyname = 'CreditById'
Pending.dispalyname = 'CreditByIdPending'
Error.dispalyname = 'CreditByIdError'


const text = {
  title: 'Detalles:',
  error: 'Ups!!! ha ocurrido un error',
  errorDescription: 'Los detalles del prestamo ha fallado.',
  back: 'Intente volver a la pestaña anterior',
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
