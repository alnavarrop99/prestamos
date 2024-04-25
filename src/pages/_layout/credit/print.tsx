import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { DialogDescription } from '@radix-ui/react-dialog'
import {
  ErrorComponentProps,
  Navigate,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from '@/styles/global.module.css'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { PrintCredit } from '@/pages/_layout/-print'
import { useStatus } from '@/lib/context/layout'
import { useReactToPrint } from 'react-to-print'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { format } from 'date-fns'
import { queryClient } from '@/pages/__root'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { getCreditByIdOpt } from '@/pages/_layout/credit_/$creditId.lazy'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import { defer } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { SpinLoader } from '@/components/ui/loader'
import { toast } from '@/components/ui/use-toast'
import { print_selected as text } from '@/locale/credit'

type TSearch = {
  creditId: number
}

export const Route = createFileRoute('/_layout/credit/print')({
  component: PrintSelectedCredit,
  errorComponent: ErrorComp,
  validateSearch: (searh: TSearch) => searh as TSearch,
  loader: ({ location: { search } }) => {
    const credit = queryClient.ensureQueryData(
      queryOptions(
        getCreditByIdOpt({ creditId: '' + (search as TSearch)?.creditId })
      )
    )
    return { credit: defer(credit) }
  },
})

const options = { last: 'Ultimo pago', especific: 'Pago especifico' }

/* eslint-disable-next-line */
type TOptState = keyof typeof options

/* eslint-disable-next-line */
export function PrintSelectedCredit() {
  const form = useRef<HTMLFormElement>(null)
  const [{ opt, payIndex }, setOpt] = useState<{
    payIndex?: number
    opt?: TOptState
  }>({
    opt: 'last',
  })
  const { creditId } = Route.useSearch()
  const {
    data: creditRes,
    isSuccess: okCredits,
    isFetching: pendingCredits,
  } = useQuery(queryOptions(getCreditByIdOpt({ creditId: '' + creditId })))

  const {
    data: client,
    isSuccess,
    isError,
  } = useQuery(
    queryOptions({
      ...getClientByIdOpt({ clientId: '' + creditRes?.owner_id }),
      enabled: !!creditRes,
    })
  )

  useEffect(() => {
    if (!creditRes && isError) throw Error('not load')
  }, [isError])

  const { open, setOpen } = useStatus()
  const ref = useRef<React.ComponentRef<typeof PrintCredit>>(null)

  const onValueChange = (value: string) => {
    setOpt({ opt: value as TOptState })
  }

  const onChange = (value: string) => {
    if (!creditRes?.pagos?.length) return
    const pay = +value
    if (pay < 0 && pay >= creditRes?.pagos?.length) return
    setOpt({ opt, payIndex: pay })
  }

  const handlePrint = useReactToPrint({
    content: () => ref?.current,
    documentTitle: 'Pago-' + new Date(),
  })

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current || !opt || !ref?.current) return

    setOpen({ open: !open })
    handlePrint()

    form.current.reset()
    ev.preventDefault()
  }

  const pay = useMemo(
    () => creditRes?.pagos?.at(payIndex ?? -1),
    [payIndex, creditRes]
  )
  const mora = useMemo(
    () => creditRes?.cuotas?.at(payIndex ?? -1)?.valor_de_mora,
    [payIndex, creditRes]
  )

  return (
    <>
      {!open && <Navigate to={'../'} replace />}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="center flex gap-2">
            <DialogTitle className="text-2xl">{text.title}</DialogTitle>
          </div>
          <Separator />
          <DialogDescription className="text-muted-foreground">
            {text.description}
          </DialogDescription>
        </DialogHeader>
        <form
          autoFocus={false}
          autoComplete="on"
          ref={form}
          onSubmit={onSubmit}
          id="print-credit"
          className={clsx(
            'grid-rows-subgrid grid gap-3 gap-y-4 [&>label]:space-y-2',
            styles?.['custom-form']
          )}
        >
          <Label className='[&>span]:after:text-red-500 [&>span]:after:content-["_*_"]'>
            <span>{text.form.options.label} </span>
            {pendingCredits && <Skeleton className="h-10 w-full" />}
            {okCredits && (
              <Select
                required
                name={'options'}
                value={opt}
                onValueChange={onValueChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={text.form.options.placeholder} />
                </SelectTrigger>
                <SelectContent className="[&_*]:cursor-pointer">
                  {Object.entries(options).map(([key, value], index) => (
                    <SelectItem key={index} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Label>
          {opt === 'especific' && (
            <Label>
              <span>{text.form.pay.label}</span>
              {pendingCredits && <Skeleton className="h-10 w-full" />}
              {okCredits && (
                <Select
                  required
                  name={'payment'}
                  onValueChange={onChange}
                  defaultValue={
                    typeof payIndex !== 'undefined' ? '' + payIndex : undefined
                  }
                >
                  <SelectTrigger className="!border-1 w-full !border-ring">
                    <SelectValue placeholder={text.form.pay.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="[&_*]:cursor-pointer">
                    {creditRes?.pagos?.map((_, index) => (
                      <SelectItem key={index} value={'' + index}>
                        {' '}
                        {format(
                          new Date(
                            creditRes?.cuotas?.[index].fecha_de_pago ?? ''
                          ),
                          'dd/MM/yyyy'
                        )}{' '}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Label>
          )}
        </form>
        <DialogFooter>
          <div
            className={clsx('flex gap-2', {
              '!flex-row-reverse':
                opt === 'last' ||
                (opt === 'especific' && typeof payIndex !== 'undefined'),
              '[&>*:last-child]:animate-pulse':
                !opt ||
                (opt === 'especific' && typeof payIndex === 'undefined'),
            })}
          >
            {pendingCredits && (
              <>
                <Skeleton className="inline-block h-12 w-24" />
                <Skeleton className="inline-block h-12 w-64" />
              </>
            )}
            {okCredits && (
              <>
                <HoverCard openDelay={0} closeDelay={0.5 * 1000}>
                  <HoverCardTrigger
                    asChild
                    className={clsx(
                      '[&>svg]:cursor-pointer [&>svg]:stroke-primary',
                      {}
                    )}
                  >
                    <Button
                      form="print-credit"
                      type="submit"
                      disabled={
                        !client ||
                        !opt ||
                        (opt === 'especific' && typeof payIndex === 'undefined')
                      }
                    >
                      {text.button.print}
                      {!isSuccess && <SpinLoader />}
                    </Button>
                  </HoverCardTrigger>
                  {client && opt && pay?.fecha_de_pago && (
                    <HoverCardContent
                      side="right"
                      className="rounded-md bg-secondary-foreground"
                    >
                      <PrintCredit
                        {...{
                          client: client?.nombres + ' ' + client?.apellidos,
                          ssn: client?.numero_de_identificacion,
                          telephone: client?.telefono,
                          phone: client?.celular,
                          date: format(
                            new Date(pay.fecha_de_pago ?? ''),
                            'dd/MM/yyyy'
                          ),
                          pay: +(pay?.valor_del_pago ?? 0)?.toFixed(2),
                          mora: mora ? +mora.toFixed(2) : undefined,
                          cuoteNumber:
                            (payIndex ?? creditRes?.pagos?.length) + 1,
                          pending: +(
                            creditRes?.monto -
                            creditRes?.pagos
                              ?.slice(0, payIndex ? payIndex + 1 : -1)
                              ?.reduce(
                                (prev, acc) => {
                                  const res: typeof acc = { ...acc }
                                  res.valor_del_pago += prev?.valor_del_pago
                                  return res
                                },
                                { valor_del_pago: 0 }
                              )?.valor_del_pago
                          )?.toFixed(2),
                          comment:
                            pay?.comentario === ''
                              ? pay?.comentario
                              : undefined,
                        }}
                        ref={ref}
                      />
                    </HoverCardContent>
                  )}
                </HoverCard>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="font-bold hover:ring hover:ring-primary"
                  >
                    {text.button.close}
                  </Button>
                </DialogClose>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}

/* eslint-disable-next-line */
export function ErrorComp({ error }: ErrorComponentProps) {
  const navigate = useNavigate()
  const [errorMsg, setMsg] = useState<
    { type: number | string; msg?: string } | undefined
  >(undefined)
  useEffect(() => {
    try {
      setMsg(JSON?.parse((error as Error)?.message))
    } catch {
      setMsg({ type: (error as Error)?.name, msg: (error as Error).message })
    }
  }, [error])

  useEffect(() => {
    navigate({ to: '../' })
    toast({
      title: '' + errorMsg?.type,
      description: (
        <div className="text-sm">
          <p>{errorMsg?.msg}</p>
        </div>
      ),
      variant: 'destructive',
    })
  }, [])
  return
}

PrintSelectedCredit.dispalyname = 'PayCreditById'
ErrorComp.dispalyname = 'PayCreditByIdError'
