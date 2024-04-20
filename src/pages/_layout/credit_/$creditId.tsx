import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { type TCREDIT_GET, getCreditById } from '@/api/credit'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { Annoyed, Printer } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CircleDollarSign as Pay } from 'lucide-react'
import { format } from 'date-fns'
import { useStatus } from '@/lib/context/layout'
import { getFrecuencyById } from '@/lib/type/frecuency'
import { createContext, useEffect, useMemo, useState } from 'react'
import { type TMORA_TYPE, getMoraTypeById } from '@/lib/type/moraType'
import { type TCLIENT_GET } from '@/api/clients'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@tanstack/react-router'
import { queryClient } from '@/pages/__root'
import {
  queryOptions,
  useIsMutating,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import {
  deletePaymentByIdOpt,
  updateCreditByIdOpt,
} from '@/pages/_layout/credit_/$creditId_/update.confirm'
import { postCreditOpt } from '@/pages/_layout/credit/new'
import { deleteCreditByIdOpt } from '@/pages/_layout/credit_/$creditId/delete'
import { useToken } from '@/lib/context/login'
import { redirect } from '@tanstack/react-router'
import { PaymentTable } from './-table'

export const getCreditByIdOpt = ({ creditId }: { creditId: string }) => ({
  queryKey: ['get-credit-by-id', { creditId }],
  queryFn: () => getCreditById({ params: { creditId } }),
})

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  pendingComponent: Pending,
  errorComponent: Error,
  loader: async ({ params }) => {
    const { userId, rol } = useToken.getState()
    const credit = queryClient.ensureQueryData(
      queryOptions(getCreditByIdOpt(params))
    )
    const client = queryClient.ensureQueryData(
      queryOptions(
        getClientByIdOpt({ clientId: '' + (await credit)?.owner_id })
      )
    )

    const ownerId = (await credit)?.cobrador_id
    if (ownerId !== userId && rol?.rolName !== 'Administrador') {
      throw redirect({ to: '/credit' })
    }

    return { credit, client }
  },
})

const ROW = 8
const COL = 6
export const _credit = createContext<TCREDIT_GET | undefined>(undefined)
export const _client = createContext<TCLIENT_GET | undefined>(undefined)

/* eslint-disable-next-line */
export function CreditById() {
  const { creditId } = Route.useParams()
  const { data: creditRes, refetch: refetchCredit } = useSuspenseQuery(
    queryOptions(getCreditByIdOpt({ creditId }))
  )
  const { data: clientRes, refetch: refetchClient } = useSuspenseQuery(
    queryOptions(getClientByIdOpt({ clientId: '' + creditRes.owner_id }))
  )
  const [credit, setCredit] = useState(creditRes)
  const [client, setClient] = useState(clientRes)
  const { open, setOpen } = useStatus()
  const navigate = useNavigate()
  const { userId, rol } = useToken()

  const isUpdateCredit = useIsMutating({
    status: 'success',
    mutationKey: updateCreditByIdOpt.mutationKey,
  })
  const isNewCredit = useIsMutating({
    status: 'success',
    mutationKey: postCreditOpt.mutationKey,
  })
  const isDeleteCredit = useIsMutating({
    status: 'success',
    mutationKey: deleteCreditByIdOpt.mutationKey,
  })
  const isNewPayment = useIsMutating({
    status: 'success',
    mutationKey: deletePaymentByIdOpt.mutationKey,
  })
  const isDeletePayment = useIsMutating({
    status: 'success',
    mutationKey: deletePaymentByIdOpt.mutationKey,
  })
  const isUpdatePayment = useIsMutating({
    status: 'success',
    mutationKey: updateCreditByIdOpt.mutationKey,
  })

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const table = useMemo(
    () =>
      credit?.pagos?.map((_, i, list) => ({
        payment: list?.[i],
        cuote: credit?.cuotas?.[i],
      })),
    [credit?.pagos, credit?.cuotas]
  )

  useEffect(() => {
    if (creditRes) {
      refetchCredit()?.then(({ data }) => {
        if (!data) return
        setCredit(data)
      })
    }

    if (clientRes) {
      refetchClient()?.then(({ data }) => {
        if (!data) return
        setClient(data)
      })
    }
    return () => {}
  }, [
    isUpdateCredit,
    isNewCredit,
    isDeleteCredit,
    isNewPayment,
    isDeletePayment,
    isUpdatePayment,
  ])

  const mora = credit?.cuotas?.at(-1)?.valor_de_mora
  const moraType = getMoraTypeById({ moraTypeId: credit?.tipo_de_mora_id })
    ?.nombre
  const moraStatus = !!mora && mora > 0

  const cuoteValue = credit?.cuotas?.at(-1)?.valor_de_cuota
  const interestValue = (credit?.tasa_de_interes / 100) * (cuoteValue ?? 1)
  const moreValue =
    moraType === 'Porciento'
      ? ((credit?.valor_de_mora + credit?.tasa_de_interes) / 100) *
        (cuoteValue ?? 1)
      : credit?.valor_de_mora

  return (
    <_client.Provider value={client}>
      <_credit.Provider value={credit}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <h1 className="text-2xl font-bold md:text-3xl">{text.title}</h1>
            <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogTrigger asChild>
                <Link
                  to={'./print'}
                  disabled={credit?.pagos?.length <= 0}
                  className="hidden xl:ms-auto xl:block"
                >
                  <Button
                    variant="outline"
                    className="hover:ring hover:ring-primary"
                    disabled={credit?.pagos?.length <= 0}
                  >
                    <Printer />
                  </Button>
                </Link>
              </DialogTrigger>
              <DialogTrigger asChild className="ms-auto xl:ms-0">
                <Link to={'./pay'}>
                  <Button
                    variant="default"
                    className={clsx(
                      'bg-success ring-success-foreground hover:bg-success hover:ring-4'
                    )}
                  >
                    <Pay />
                  </Button>
                </Link>
              </DialogTrigger>
              {userId && rol?.rolName === 'Administrador' && (
                <Link to={'./update'}>
                  <Button variant="default"> {text.button.update} </Button>
                </Link>
              )}
              {userId && rol?.rolName === 'Administrador' && (
                <DialogTrigger asChild>
                  <Link to={'./delete'}>
                    <Button variant="default" className="hover:bg-destructive">
                      {text.button.delete}
                    </Button>
                  </Link>
                </DialogTrigger>
              )}
              <Outlet />
            </Dialog>
          </div>
          <Separator />
          <h2 className="text-xl font-bold md:text-2xl">
            {' '}
            {text.details.title}{' '}
          </h2>
          <ul className="flex flex-col gap-2 px-2 [&>li]:space-x-2">
            <li>
              <b>{text.details.status + ':'}</b>
              <Switch
                className={'cursor-not-allowed'}
                checked={!!credit?.estado}
              ></Switch>
            </li>
            <li>
              <b>{text.details.name + ':'}</b>{' '}
              <span>{client?.nombres + ' ' + client?.apellidos + '.'}</span>
            </li>
            <li>
              <b>{text.details.date + ':'}</b>{' '}
              <span>
                {format(new Date(credit?.fecha_de_aprobacion), 'dd/MM/yyyy') +
                  '.'}
              </span>
            </li>
            <li>
              <b>{text.details.aditionalsDays + ':'}</b>{' '}
              <span>{credit?.dias_adicionales + '.'}</span>
            </li>
            <li>
              <b>{text.details.amount + ':'}</b>{' '}
              <span>{'$' + credit?.monto + '.'}</span>
            </li>
            <li>
              <b>{text.details.cuote + ':'}</b>{' '}
              <span>{'$' + cuoteValue + '.'}</span>
            </li>
            <li>
              <b>{text.details.cuoteNumber + ':'}</b>{' '}
              <span>
                {credit.pagos?.length + '/' + credit.numero_de_cuotas + '.'}
              </span>
            </li>
            <li>
              <b>{text.details.frecuency + ':'}</b>{' '}
              <span>
                {getFrecuencyById({
                  frecuencyId: credit?.frecuencia_del_credito_id,
                })?.nombre + '.'}
              </span>
            </li>
            <li
              className={clsx({
                '[&>b]:text-success': !moraStatus,
                '[&>b]:line-through': moraStatus,
              })}
            >
              <b>{text.details.interest + ':'}</b>{' '}
              <span>
                {credit?.tasa_de_interes + '% de $' + cuoteValue + '.'}
              </span>
            </li>
            <li
              className={clsx({
                '[&>b]:text-destructive': moraStatus,
                '[&>b]:line-through': !moraStatus,
              })}
            >
              <b>{text.details.installmants(moraType) + ':'}</b>
              {moraType === 'Valor fijo' ? (
                <span>{'$' + moreValue + '.'}</span>
              ) : (
                <span>
                  {credit?.valor_de_mora + '% de $' + (cuoteValue ?? 0) + '.'}
                </span>
              )}
            </li>
            <li>
              <b>{text.details.pay + ':'}</b>{' '}
              <span>
                {'$' +
                  (moraStatus
                    ? (cuoteValue ?? 0) + moreValue
                    : (cuoteValue ?? 0) + interestValue
                  ).toFixed(2) +
                  '.'}
              </span>
            </li>
            <li>
              <b>{text.details.comment + ':'}</b>{' '}
              <p className="text-sm md:text-base">{credit?.comentario}</p>
            </li>
          </ul>
          <Separator />
          {!!credit?.cuotas?.length && !!credit?.pagos?.length && (
            <h2 className="text-xl font-bold md:text-2xl">
              {' '}
              {text.cuotes.title}{' '}
            </h2>
          )}
          {!!credit?.cuotas?.length && !!credit?.pagos?.length && (
            <div className="rounded-xl bg-background ring-2 ring-border">
              <PaymentTable credit={credit} table={table} />
            </div>
          )}
        </div>
      </_credit.Provider>
    </_client.Provider>
  )
}

/* eslint-disable-next-line */
export function Pending() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="ms-auto h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Separator />
      <Skeleton className="h-8 w-64" />
      <div className="space-y-4 px-4 [&>div:last-child]:flex-col [&>div]:flex [&>div]:gap-2">
        <div className="flex items-end">
          {' '}
          <Skeleton className="h-6 w-24" /> <Skeleton className="h-8 w-24" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36" /> <Skeleton className="h-6 w-24" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-32" /> <Skeleton className="h-6 w-10" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-32" /> <Skeleton className="h-6 w-16" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36" /> <Skeleton className="h-6 w-24" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-32" /> <Skeleton className="h-6 w-10" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36" /> <Skeleton className="h-6 w-24" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36" /> <Skeleton className="h-6 w-24" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-24" /> <Skeleton className="h-6 w-24" />{' '}
        </div>
        <div>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mx-4 h-6 w-[50rem]" />
          <Skeleton className="mx-4 h-6 w-[50rem]" />
          <Skeleton className="mx-4 h-6 w-[12rem]" />
        </div>
      </div>
      <Separator />
      <Skeleton className="h-8 w-64" />
      <div className="px-4">
        <table className="w-full border-separate border-spacing-2 rounded-md ring-4 ring-transparent">
          {Array.from({ length: ROW })?.map((_, index) => (
            <tr key={index}>
              {Array.from({ length: COL })?.map((_, index) => (
                <td key={index} className="first:w-24 last:w-12">
                  {' '}
                  <Skeleton className="h-9 w-full" />{' '}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}

/* eslint-disable-next-line */
export function Error() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }
  return (
    <div className="flex h-full items-center items-center justify-center gap-4 [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{text.error}</h1>
        <p className="italic">{text.errorDescription}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.back + '.'}{' '}
        </Button>
      </div>
    </div>
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
    installmants: (type: TMORA_TYPE) =>
      type === 'Valor fijo' ? 'Monta por mora' : 'Tasa por mora',
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
