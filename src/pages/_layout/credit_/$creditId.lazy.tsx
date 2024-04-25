import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { type TCREDIT_GET, getCreditById } from '@/api/credit'
import { Separator } from '@/components/ui/separator'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'
import { Annoyed, Printer } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CircleDollarSign as Pay } from 'lucide-react'
import { format } from 'date-fns'
import { useStatus } from '@/lib/context/layout'
import { getFrecuencyById } from '@/lib/type/frecuency'
import { createContext, useEffect, useMemo, useState } from 'react'
import { getMoraTypeById } from '@/lib/type/moraType'
import { type TCLIENT_GET } from '@/api/clients'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from '@tanstack/react-router'
import { queryClient } from '@/pages/__root'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import {} from '@/pages/_layout/credit_/$creditId_/update.confirm'
import { useToken } from '@/lib/context/login'
import { PaymentTable } from './-table'
import { ErrorComponentProps } from '@tanstack/react-router'
import { credit_by_id as text } from "@/locale/credit";

export const getCreditByIdOpt = ({ creditId }: { creditId: string }) => ({
  queryKey: ['get-credit-by-id', { creditId }],
  queryFn: () => getCreditById({ params: { creditId } }),
})

export const Route = createFileRoute('/_layout/credit/$creditId')({
  component: CreditById,
  pendingComponent: Pending,
  errorComponent: Error,
  loader: async ({ params }) => {
    const credit = queryClient.ensureQueryData(
      queryOptions(getCreditByIdOpt(params))
    )
    const client = queryClient.ensureQueryData(
      queryOptions(
        getClientByIdOpt({ clientId: '' + (await credit)?.owner_id })
      )
    )

    // const { userId, rol } = useToken.getState()
    // TODO:
    // const ownerId = (await credit)?.cobrador_id
    // if (ownerId !== userId && rol?.rolName !== 'Administrador') {
    //   throw redirect({ to: '/credit' })
    // }

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
  const { data: creditRes } = useSuspenseQuery(
    queryOptions(getCreditByIdOpt({ creditId }))
  )
  const { data: clientRes } = useSuspenseQuery(
    queryOptions(getClientByIdOpt({ clientId: '' + creditRes.owner_id }))
  )
  const { open, setOpen } = useStatus()
  const navigate = useNavigate()
  const { userId, rol } = useToken()

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const table = useMemo(
    () =>
      creditRes?.pagos?.map((_, i, list) => ({
        payment: list?.[i],
        cuote: creditRes?.cuotas?.[i],
      })),
    [creditRes?.pagos, creditRes?.cuotas]
  )

  const mora = creditRes?.cuotas?.at(-1)?.valor_de_mora
  const moraType = getMoraTypeById({ moraTypeId: creditRes?.tipo_de_mora_id })
    ?.nombre
  const moraStatus = !!mora && mora > 0

  const cuoteValue = creditRes?.cuotas?.at(-1)?.valor_de_cuota
  const interestValue = (creditRes?.tasa_de_interes / 100) * (cuoteValue ?? 1)
  const moreValue =
    moraType === 'Porciento'
      ? ((creditRes?.valor_de_mora + creditRes?.tasa_de_interes) / 100) *
        (cuoteValue ?? 1)
      : creditRes?.valor_de_mora

  return (
    <_client.Provider value={clientRes}>
      <_credit.Provider value={creditRes}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <h1 className="text-2xl font-bold md:text-3xl">{text.title}</h1>
            <Dialog open={open} onOpenChange={onOpenChange}>
              <DialogTrigger asChild className="hidden xl:ms-auto xl:block">
                <Link to={'./print'} disabled={creditRes?.pagos?.length <= 0}>
                  <Button
                    variant="outline"
                    className="hover:ring hover:ring-primary"
                    disabled={creditRes?.pagos?.length <= 0}
                  >
                    <Printer />
                  </Button>
                </Link>
              </DialogTrigger>
              <DialogTrigger
                asChild
                className={clsx('ms-auto xl:ms-0', {
                  'invisible order-1': userId !== creditRes?.cobrador_id,
                })}
              >
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
              <b>{text.details.name + ':'}</b>{' '}
              <span>
                {clientRes?.nombres + ' ' + clientRes?.apellidos + '.'}
              </span>
            </li>
            <li>
              <b>{text.details.date + ':'}</b>{' '}
              <span>
                {format(
                  new Date(creditRes?.fecha_de_aprobacion ?? ''),
                  'dd/MM/yyyy'
                ) + '.'}
              </span>
            </li>
            <li>
              <b>{text.details.additionalDays + ':'}</b>{' '}
              <span>{creditRes?.dias_adicionales + '.'}</span>
            </li>
            <li>
              <b>{text.details.amount + ':'}</b>{' '}
              <span>{'$' + creditRes?.monto + '.'}</span>
            </li>
            <li>
              <b>{text.details.cuote + ':'}</b>{' '}
              <span>{'$' + cuoteValue + '.'}</span>
            </li>
            <li>
              <b>{text.details.cuoteNumber + ':'}</b>{' '}
              <span>
                {creditRes.pagos?.length +
                  '/' +
                  creditRes.numero_de_cuotas +
                  '.'}
              </span>
            </li>
            <li>
              <b>{text.details.frequency + ':'}</b>{' '}
              <span>
                {getFrecuencyById({
                  frecuencyId: creditRes?.frecuencia_del_credito_id,
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
                {creditRes?.tasa_de_interes + '% de $' + cuoteValue + '.'}
              </span>
            </li>
            <li
              className={clsx({
                '[&>b]:text-destructive': moraStatus,
                '[&>b]:line-through': !moraStatus,
              })}
            >
              <b>{text.details.installments(moraType) + ':'}</b>
              {moraType === 'Valor fijo' ? (
                <span>{'$' + moreValue + '.'}</span>
              ) : (
                <span>
                  {creditRes?.valor_de_mora +
                    '% de $' +
                    (cuoteValue ?? 0) +
                    '.'}
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
              <p className="text-sm md:text-base">{creditRes?.comentario}</p>
            </li>
          </ul>
          <Separator />
          {!!creditRes?.cuotas?.length && !!creditRes?.pagos?.length && (
            <h2 className="text-xl font-bold md:text-2xl">
              {' '}
              {text.cuotes.title}{' '}
            </h2>
          )}
          {!!creditRes?.cuotas?.length && !!creditRes?.pagos?.length && (
            <div className="rounded-xl bg-background ring-2 ring-border">
              <PaymentTable credit={creditRes} table={table} />
            </div>
          )}
        </div>
      </_credit.Provider>
    </_client.Provider>
  )
}

/* eslint-disable-next-line */
export function Pending() {
  const { rol } = useToken()
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24 md:w-48" />
        <Skeleton className="ms-auto h-10 w-16" />
        {rol?.rolName === 'Administrador' && <Skeleton className="h-10 w-16" />}
        {rol?.rolName === 'Administrador' && (
          <Skeleton className="h-10 w-20 md:w-24" />
        )}
        <Skeleton className="hidden h-10 w-20 md:w-24 xl:block" />
      </div>
      <Separator />
      <Skeleton className="h-8 w-40 md:w-64" />
      <div className="space-y-4 px-4 [&>div:last-child]:flex-col [&>div]:flex [&>div]:gap-2">
        <div className="flex items-end">
          {' '}
          <Skeleton className="h-6 w-24 md:w-20" />{' '}
          <Skeleton className="h-8 w-24 md:w-16" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36 md:w-24" />{' '}
          <Skeleton className="h-6 w-24 md:w-20" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-32 md:w-20" />{' '}
          <Skeleton className="h-6 w-10" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-32 md:w-20" />{' '}
          <Skeleton className="h-6 w-16 md:w-12" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36 md:w-24" />{' '}
          <Skeleton className="h-6 w-24 md:w-20" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-32 md:w-20" />{' '}
          <Skeleton className="h-6 w-10" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36 md:w-24" />{' '}
          <Skeleton className="h-6 w-24 md:w-20" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-36 md:w-20" />{' '}
          <Skeleton className="h-6 w-24 md:w-20" />{' '}
        </div>
        <div>
          {' '}
          <Skeleton className="h-6 w-24" /> <Skeleton className="h-6 w-24" />{' '}
        </div>
        <div>
          <Skeleton className="h-6 w-36 md:w-24" />
          <Skeleton className="mx-4 h-6 w-full" />
          <Skeleton className="mx-4 h-6 w-full" />
          <Skeleton className="mx-4 h-6 w-full" />
        </div>
      </div>
      <Separator />
      <Skeleton className="md:40 h-8 w-64" />

      <div className="divide-y-2 rounded-xl ring-2 ring-muted">
        <table className="hidden w-full border-separate border-spacing-2 divide-y-2 rounded-xl bg-background ring-2 ring-muted xl:table">
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

        <div className="divide-y-2 rounded-xl ring-2 ring-muted xl:hidden">
          {Array.from({ length: ROW })?.map((_, row) => (
            <div key={row} className="w-full bg-background">
              <div
                className={clsx('flex items-center gap-2 bg-muted px-4 py-2 ', {
                  'rounded-t-xl': row === 0,
                })}
              >
                <Skeleton className="h-6 w-24 !bg-background" />
                <Skeleton className="ms-auto h-6 w-6 rounded-full !bg-background" />
                <Skeleton className="h-6 w-12 rounded-full !bg-background" />
              </div>

              <div className="flex flex-col gap-1 px-8 py-2 [&>*]:flex [&>*]:gap-2">
                <div>
                  {' '}
                  <Skeleton className="h-6 w-28" />{' '}
                  <Skeleton className="h-6 w-12" />{' '}
                </div>
                <div>
                  {' '}
                  <Skeleton className="h-6 w-32" />{' '}
                  <Skeleton className="h-6 w-12" />{' '}
                </div>
                <div>
                  {' '}
                  <Skeleton className="h-6 w-24" />{' '}
                  <Skeleton className="h-6 w-16" />{' '}
                </div>
              </div>
            </div>
          ))}
          <div
            className={clsx(
              'flex items-center gap-2 rounded-b-xl bg-muted px-4 py-2'
            )}
          >
            <Skeleton className="h-4 w-24 !bg-background" />
            <Skeleton className="ms-auto h-6 w-16 !bg-background" />
            <Skeleton className="h-6 w-16 !bg-background" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* eslint-disable-next-line */
export function Error({ error }: ErrorComponentProps) {
  const [ errorMsg, setMsg ] = useState<{ type: number | string; msg?: string } | undefined>( undefined )
  useEffect( () => {
    try{
      setMsg(JSON?.parse((error as Error)?.message))
    }
    catch{
      setMsg({ type: "Error", msg: (error as Error).message })
    }
  }, [error] )
  const { history } = useRouter()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }
  return (
    <div className="flex xl:h-full h-[80dvh] flex-col items-center items-center justify-center gap-4 md:flex-row [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{errorMsg?.type}</h1>
        <p className="italic">{errorMsg?.msg}</p>
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
