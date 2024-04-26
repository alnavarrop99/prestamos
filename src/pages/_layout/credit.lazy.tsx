import { Alert, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Separator } from '@/components/ui/separator'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import clsx from 'clsx'
import {
  AlertCircle,
  Printer,
  CircleDollarSign as Pay,
  Annoyed,
} from 'lucide-react'
import { createContext, useEffect, useState } from 'react'
import {
  getCreditById,
  getCreditsFilter,
  getCreditsList,
  type TCREDIT_GET_FILTER,
  type TCREDIT_GET_FILTER_ALL,
} from '@/api/credit'
import { useStatus } from '@/lib/context/layout'
import { format } from 'date-fns'
import styles from '@/styles/global.module.css'
import { getFrecuencyById } from '@/lib/type/frecuency'
import { getClientById } from '@/api/clients'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select'
import { queryClient } from '@/pages/__root'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useToken } from '@/lib/context/login'
import { ErrorComponentProps } from '@tanstack/react-router'
import { main as text } from '@/locale/credit'

const getFilterCredit = async () => {
  // TODO: this is a temporal function to getFilter
  if (!!+import.meta.env.VITE_MSW && import.meta.env.DEV)
    return await getCreditsFilter()()
  const list = await getCreditsList()
  /* eslint-disable-next-line */
  const data: TCREDIT_GET_FILTER_ALL = await Promise.all(
    list?.map<Promise<TCREDIT_GET_FILTER>>(
      async ({
        id: creditId,
        owner_id,
        frecuencia_del_credito_id,
        cobrador_id,
      }) => {
        const { nombres, apellidos } = await getClientById({
          params: { clientId: '' + owner_id },
        })
        const { cuotas, pagos } = await getCreditById({
          params: { creditId: '' + creditId },
        })

        return {
          clientId: owner_id,
          id: creditId,
          frecuencia: getFrecuencyById({
            frecuencyId: frecuencia_del_credito_id ?? 1,
          }),
          fecha_de_cuota: cuotas?.at(pagos?.length)?.fecha_de_pago,
          valor_de_cuota: cuotas?.at(pagos?.length)?.valor_de_cuota,
          numero_de_cuota: pagos?.length,
          valor_de_la_mora: cuotas?.at(-1)?.valor_de_mora,
          nombre_del_cliente: nombres + ' ' + apellidos,
          cobrador_id,
        } as TCREDIT_GET_FILTER
      }
    )
  )
  return data
}

export const getCreditsListOpt = {
  queryKey: ['list-filter-credits'],
  queryFn: getFilterCredit,
}

export const Route = createFileRoute('/_layout/credit')({
  component: Credits,
  pendingComponent: Pending,
  errorComponent: Error,
  loader: () => ({
    credits: queryClient.ensureQueryData(queryOptions(getCreditsListOpt)),
  }),
})

/* eslint-disable-next-line */
type TOrderType = 'Nombre' | 'Fecha de creacion' | 'Frecuencia'

const STEP = 3
const LENGTH = 8
const ORDER: Record<
  keyof Omit<
    TCREDIT_GET_FILTER,
    | 'clientId'
    | 'fecha_de_cuota'
    | 'valor_de_cuota'
    | 'numero_de_cuota'
    | 'valor_de_la_mora'
    | 'cobrador_id'
    | 'estado'
  >,
  TOrderType
> = {
  id: 'Fecha de creacion',
  nombre_del_cliente: 'Nombre',
  frecuencia: 'Frecuencia',
}
export const _creditSelected = createContext<TCREDIT_GET_FILTER | undefined>(
  undefined
)
export const usePagination = create<{
  start: number
  end: number
  setPagination: (params: { start: number; end: number }) => void
}>()(
  persist(
    (set) => ({
      start: 0,
      end: STEP,
      setPagination: ({ start, end }) => set(() => ({ start, end })),
    }),
    { name: 'credit-pagination' }
  )
)
export const useOrder = create<{
  order: keyof typeof ORDER
  setOrder: (value: keyof typeof ORDER) => void
}>()(
  persist(
    (set) => ({
      order: 'id',
      setOrder: (order) => set(() => ({ order })),
    }),
    { name: 'credit-order' }
  )
)

/* eslint-disable-next-line */
export function Credits() {
  const { open, setOpen } = useStatus()
  const navigate = useNavigate()
  const { setPagination, ...pagination } = usePagination()
  const { value } = useStatus()
  const { order, setOrder } = useOrder()
  const { userId, rol } = useToken()

  const select: (data: TCREDIT_GET_FILTER_ALL) => TCREDIT_GET_FILTER_ALL = (
    data
  ) => {
    const credits = sortCredit(order, data)
    if (userId && rol?.rolName !== 'Administrador')
      return credits?.filter(({ cobrador_id }) => userId === cobrador_id)
    return credits
  }
  const { data: creditsRes, isRefetching } = useSuspenseQuery(
    queryOptions({ ...getCreditsListOpt, select })
  )
  const [credits, setCredits] = useState<TCREDIT_GET_FILTER_ALL>([])

  const onSelectOrder: (value: string) => void = (value) => {
    if (
      order !== 'id' &&
      order !== 'frecuencia' &&
      order !== 'nombre_del_cliente'
    )
      return

    if ((value as keyof typeof ORDER) === 'frecuencia') {
      setCredits(sortCredit(value as keyof typeof ORDER, creditsRes))
    }

    setCredits(sortCredit(value as keyof typeof ORDER, creditsRes))
    setOrder(value as keyof typeof ORDER)
  }

  useEffect(() => {
    document.title = import.meta.env.VITE_NAME + ' | ' + text.browser
  }, [])

  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    setOpen({ open: !open })
  }

  const onPagnation: (params: {
    prev?: boolean
    next?: boolean
    index?: number
  }) => React.MouseEventHandler<React.ComponentRef<typeof Button>> =
    ({ next, prev, index }) =>
    () => {
      if (
        prev &&
        pagination?.end - pagination?.start >= STEP &&
        pagination?.start > 1
      ) {
        setPagination({
          ...pagination,
          start: pagination?.start - 1,
          end: pagination?.end - STEP,
        })
      } else if (
        prev &&
        pagination?.start > 0 &&
        pagination?.start < pagination?.end
      ) {
        setPagination({ ...pagination, start: pagination?.start - 1 })
      } else if (
        next &&
        pagination?.start < pagination?.end - 1 &&
        pagination?.start < credits?.length / LENGTH - 1
      ) {
        setPagination({ ...pagination, start: pagination?.start + 1 })
      } else if (
        next &&
        pagination?.start === pagination?.end - 1 &&
        pagination?.start < credits?.length / LENGTH - 1
      ) {
        setPagination({
          ...pagination,
          start: pagination?.start + 1,
          end: pagination?.end + STEP,
        })
      }

      if (typeof index === 'undefined') return
      setPagination({ ...pagination, start: index })
    }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const onOpenUser: React.MouseEventHandler<
    React.ComponentRef<typeof Link>
  > = () => {
    onOpenChange(!open)
  }

  useEffect(() => {
    if (value) {
      setCredits(
        creditsRes?.filter(({ nombre_del_cliente }) =>
          nombre_del_cliente.toLowerCase().includes(value?.toLowerCase() ?? '')
        )
      )
      setPagination({ ...pagination, start: 0, end: STEP })
    }
    return () => {
      setCredits(creditsRes)
    }
  }, [value])

  useEffect(() => {
    if (!creditsRes) return () => {}
    setCredits(creditsRes)
  }, [creditsRes, isRefetching])

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="acitve-credits" className="cursor-pointer">
            <h1 className="text-2xl font-bold md:text-3xl">{text.title}</h1>
          </Label>
          {!!credits?.length && (
            <Badge className="px-3 text-lg md:text-xl">{credits?.length}</Badge>
          )}
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="ms-auto" asChild>
              <Link to={'./new'}>
                <Button variant="default">{text.button.create}</Button>
              </Link>
            </DialogTrigger>
            <Outlet />
          </Dialog>
        </div>
        <Separator />
        {!!credits?.length && (
          <div className="flex xl:items-center">
            <p className="hidden text-sm text-muted-foreground xl:block">
              {text.select({
                total: credits?.length,
              })}
            </p>
            <Select defaultValue={order} onValueChange={onSelectOrder}>
              <SelectTrigger className="!border-1 w-44 !border-ring xl:ms-auto xl:w-48">
                <SelectValue placeholder={'Orden'} />
              </SelectTrigger>
              <SelectContent className="[&_*]:cursor-pointer">
                {Object.entries(ORDER)?.map(([key, value], index) => (
                  <SelectItem key={index} value={key}>
                    {/* TODO */}
                    <span
                      onClick={(ev) => {
                        ev.preventDefault()
                      }}
                    >
                      {value}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!credits?.length && <p>{text.notfound}</p>}
        {!!credits?.length && (
          <div
            className={clsx(
              'flex flex-wrap gap-4 xl:gap-6 [&>*]:flex-auto md:[&>*]:basis-2/5'
            )}
          >
            {!!credits?.length &&
              credits
                ?.slice(
                  pagination?.start * LENGTH,
                  (pagination?.start + 1) * LENGTH
                )
                ?.map(
                  (
                    {
                      id: creditId,
                      clientId,
                      frecuencia,
                      numero_de_cuota,
                      valor_de_cuota,
                      nombre_del_cliente,
                      valor_de_la_mora,
                      fecha_de_cuota,
                    },
                    index
                  ) => {
                    const status: 'warn' | 'info' | undefined =
                      valor_de_la_mora > 0 ? 'warn' : undefined
                    return (
                      <Link
                        key={index}
                        className="group"
                        to="./$creditId"
                        params={{ creditId }}
                      >
                        <Card
                          className={clsx(
                            'justify-streetch grid h-full items-end shadow-lg transition delay-150 duration-500 group-hover:scale-105 group-hover:shadow-xl',
                            styles?.['grid__credit--card']
                          )}
                        >
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <CardTitle className="line-clamp-1 flex-row items-center">
                                <Link
                                  onClick={onOpenUser}
                                  to={'/client/$clientId/update'}
                                  params={{ clientId }}
                                  className="hover:underline"
                                >
                                  {nombre_del_cliente}
                                </Link>
                              </CardTitle>
                              <Badge className='after:duration-400 ms-auto text-base after:opacity-0 after:transition after:delay-150 group-hover:after:opacity-100 group-hover:after:content-["_\219D"]'>
                                {creditId}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {status && (
                              <Alert
                                variant={
                                  status === 'warn' ? 'destructive' : 'default'
                                }
                              >
                                {status && status === 'warn' && (
                                  <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                  {text.alert?.[status]?.title}
                                </AlertTitle>
                              </Alert>
                            )}
                            <ul className="list-inside list-disc">
                              {numero_de_cuota > 0 && (
                                <li>
                                  <b> {text.details.pay + ':'} </b>
                                  {numero_de_cuota + '.'}
                                </li>
                              )}
                              <li>
                                <b> {text.details.cuote + ':'} </b> <b>$</b>
                                {Math.round(valor_de_cuota) + '.'}
                              </li>
                              {valor_de_la_mora > 0 && (
                                <li>
                                  <b> {text.details.mora + ':'} </b>:<b>$</b>
                                  {Math.round(valor_de_la_mora) + '.'}
                                </li>
                              )}
                              {frecuencia?.id && (
                                <li>
                                  <b> {text.details.frequency + ':'} </b>
                                  {getFrecuencyById({
                                    frecuencyId: frecuencia?.id,
                                  })?.nombre + '.'}
                                </li>
                              )}
                            </ul>
                          </CardContent>
                          <CardFooter className="flex items-center gap-2">
                            <Badge>
                              {format(
                                new Date(fecha_de_cuota ?? ''),
                                'dd-MM-yyyy'
                              )}{' '}
                            </Badge>
                            <Dialog open={open} onOpenChange={onOpenChange}>
                              <DialogTrigger asChild className="ms-auto">
                                <Link
                                  to={'./print'}
                                  search={{ creditId }}
                                  disabled={numero_de_cuota <= 0}
                                >
                                  <Button
                                    variant="ghost"
                                    onClick={onClick}
                                    disabled={numero_de_cuota <= 0}
                                    className={clsx(
                                      'invisible px-3 opacity-0 hover:ring hover:ring-primary group-hover:opacity-100',
                                      {
                                        'xl:group-hover:visible':
                                          numero_de_cuota > 0,
                                      }
                                    )}
                                  >
                                    <Printer />
                                  </Button>
                                </Link>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Link
                                  to={'./pay'}
                                  search={{
                                    name: nombre_del_cliente,
                                    pay: valor_de_cuota,
                                    creditId: creditId,
                                  }}
                                >
                                  <Button
                                    onClick={onClick}
                                    variant="default"
                                    className={clsx(
                                      'invisible bg-success opacity-0 ring-success-foreground hover:bg-success hover:ring-4 group-hover:visible group-hover:opacity-100'
                                    )}
                                  >
                                    <Pay />
                                  </Button>
                                </Link>
                              </DialogTrigger>
                            </Dialog>
                          </CardFooter>
                        </Card>
                      </Link>
                    )
                  }
                )}
          </div>
        )}
      </div>
      {credits?.length > LENGTH && (
        <Pagination className="v-10 relative">
          <PaginationContent className="rounded-md bg-background ring-1 ring-border">
            <PaginationItem>
              <Button
                disabled={pagination?.start <= 0}
                onClick={onPagnation({ prev: true })}
                className="delay-0 duration-100"
                variant={'outline'}
              >
                {text.pagination.back}
              </Button>
            </PaginationItem>
            {pagination?.end - STEP > 0 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {Array.from({ length: STEP })?.map((_, index) => {
              if (
                pagination?.end + index - STEP >
                (credits?.length - 1) / LENGTH
              )
                return null
              return (
                <PaginationItem key={index}>
                  <Button
                    className={clsx('delay-0 duration-100 hover:text-muted', {
                      'text-muted-foreground hover:text-muted-foreground':
                        pagination?.start === pagination?.end + index - STEP,
                    })}
                    variant={
                      pagination?.start === pagination?.end + index - STEP
                        ? 'secondary'
                        : 'ghost'
                    }
                    onClick={onPagnation({
                      index: pagination?.end - STEP + index,
                    })}
                  >
                    {pagination?.end - STEP + index + 1}
                  </Button>
                </PaginationItem>
              )
            })}

            {pagination?.end < credits?.length / LENGTH && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <Button
                disabled={pagination?.start >= credits?.length / LENGTH - 1}
                className="delay-0 duration-100"
                variant={'outline'}
                onClick={onPagnation({ next: true })}
              >
                {text.pagination.next}
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

/* eslint-disable-next-line */
export function Pending() {
  const { rol } = useToken()
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 md:w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="ms-auto h-10 w-20 md:w-24" />
        </div>
        <Separator />
        <div className="flex items-center">
          <Skeleton className="hidden h-6 md:w-56 xl:block" />
          <Skeleton className="h-8 w-40 xl:ms-auto" />
        </div>
        <div className="flex flex-wrap gap-4 [&>*]:flex-1 md:[&>*]:basis-2/5">
          {Array.from({ length: LENGTH })?.map((_, index) => (
            <div key={index}>
              <Card
                className={clsx(
                  'justify-streetch grid h-full items-end shadow-lg'
                )}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex-row items-center">
                      <Skeleton className="h-8 w-48" />
                    </CardTitle>
                    <Skeleton className="ms-auto h-8 w-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 px-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="ms-auto h-10 w-11" />
                  {rol?.rolName === 'Administrador' && (
                    <Skeleton className="h-10 w-11" />
                  )}
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="mx-auto h-10 w-80" />
    </>
  )
}

/* eslint-disable-next-line */
export function Error({ error }: ErrorComponentProps) {
  const [errorMsg, setMsg] = useState<
    { type: number | string; msg?: string } | undefined
  >(undefined)
  useEffect(() => {
    try {
      setMsg(JSON?.parse((error as Error)?.message))
    } catch {
      setMsg({ type: 'Error', msg: (error as Error).message })
    }
  }, [error])
  const { history } = useRouter()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }
  return (
    <div className="flex h-[80dvh] flex-col items-center items-center justify-center gap-4 md:flex-row xl:h-full [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{errorMsg?.type}</h1>
        <p className="line-clamp-3 italic">{errorMsg?.msg}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.back + '.'}{' '}
        </Button>
      </div>
    </div>
  )
}

const sortCredit = (
  order: keyof typeof ORDER,
  users: TCREDIT_GET_FILTER_ALL
) => {
  return users?.sort((a, b) => {
    const valueA = a?.[order]
    const valueB = b?.[order]
    if (typeof valueA === 'string' && typeof valueB === 'string')
      return valueA.charCodeAt(0) - valueB.charCodeAt(0)
    else if (typeof valueA === 'number' && typeof valueB === 'number')
      return valueA - valueB
    else if (typeof valueA === 'object' && typeof valueB === 'object')
      return valueA.nombre?.charCodeAt(0) - valueB.nombre?.charCodeAt(0)
    return 0
  })
}

Credits.dispalyname = 'CreditsList'
Error.dispalyname = 'CreditsListError'
Pending.dispalyname = 'CreditsListPending'
