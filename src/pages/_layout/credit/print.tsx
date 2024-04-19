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
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from '@/styles/global.module.css'
import { type TCREDIT_GET } from '@/api/credit'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { PrintCredit } from '@/pages/_layout/credit'
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
import { getCreditByIdOpt } from '@/pages/_layout/credit_/$creditId'
import { getClientByIdOpt } from '@/pages/_layout/client/$clientId/update'
import { defer } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { Await } from '@tanstack/react-router'
import { SpinLoader } from '@/components/ui/loader'
import { toast } from '@/components/ui/use-toast'

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
  const { credit: creditRes } = Route.useLoaderData()
  const [credit, setCredit] = useState<TCREDIT_GET | undefined>(undefined)

  const {
    data: client,
    isSuccess,
    isError,
  } = useQuery(
    queryOptions({
      ...getClientByIdOpt({ clientId: '' + credit?.owner_id }),
      enabled: !!credit,
    })
  )

  useEffect(() => {
    if (!creditRes) throw Error()
  }, [isError])

  useEffect(() => {
    if (!credit) {
      creditRes?.then((data) => {
        setCredit(data)
        return
      })
    }
    return () => {}
  }, [creditRes])

  useEffect(() => {
    if (isError) {
      throw new Error('not load client')
    }
  }, [isError])

  const { open, setOpen } = useStatus()
  const ref = useRef<React.ComponentRef<typeof PrintCredit>>(null)

  const onValueChange = (value: string) => {
    setOpt({ opt: value as TOptState })
  }

  const onChange = (value: string) => {
    if (!credit?.pagos?.length) return
    const pay = +value
    if (pay < 0 && pay >= credit?.pagos?.length) return
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
    () => credit?.pagos?.at(payIndex ?? -1),
    [payIndex, credit]
  )
  const mora = useMemo(
    () => credit?.cuotas?.at(payIndex ?? -1)?.valor_de_mora,
    [payIndex, credit]
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
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <Await promise={creditRes}>
                {() => (
                  <Select
                    required
                    name={'options'}
                    value={opt}
                    onValueChange={onValueChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={text.form.options.placeholder}
                      />
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
              </Await>
            </Suspense>
          </Label>
          {opt === 'especific' && (
            <Label>
              <span>{text.form.pay.label}</span>
              <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                <Await promise={creditRes}>
                  {(credit) => (
                    <Select
                      required
                      name={'payment'}
                      onValueChange={onChange}
                      defaultValue={
                        typeof payIndex !== 'undefined'
                          ? '' + payIndex
                          : undefined
                      }
                    >
                      <SelectTrigger className="!border-1 w-full !border-ring">
                        <SelectValue placeholder={text.form.pay.placeholder} />
                      </SelectTrigger>
                      <SelectContent className="[&_*]:cursor-pointer">
                        {credit?.pagos?.map((_, index) => (
                          <SelectItem key={index} value={'' + index}>
                            {' '}
                            {format(
                              credit?.cuotas?.[index].fecha_de_pago,
                              'dd/MM/yyyy'
                            )}{' '}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Await>
              </Suspense>
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
            <Suspense
              fallback={
                <>
                  <Skeleton className="inline-block h-12 w-24" />
                  <Skeleton className="inline-block h-12 w-64" />
                </>
              }
            >
              <Await promise={creditRes}>
                {(credit) => (
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
                            (opt === 'especific' &&
                              typeof payIndex === 'undefined')
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
                              // TODO: date: format( pay?.fecha_de_pago ?? "",  "dd-MM-yyyy / hh:mm aaaa" ),
                              date: format(
                                new Date(pay.fecha_de_pago),
                                'dd/MM/yyyy - hh:mm aaaa'
                              ),
                              pay: +(pay?.valor_del_pago ?? 0)?.toFixed(2),
                              mora: mora ? +mora.toFixed(2) : undefined,
                              cuoteNumber:
                                (payIndex ?? credit?.pagos?.length - 1) + 1,
                              pending: +(
                                credit?.monto -
                                credit?.pagos
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
              </Await>
            </Suspense>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}

/* eslint-disable-next-line */
export function ErrorComp() {
  useEffect(() => {
    toast({
      title: text.error.title,
      description: (
        <div className="flex flex-row items-center gap-2">
          <h2 className="text-2xl font-bold">:&nbsp;(</h2>
          <p className="text-base"> {text.error.descriiption} </p>
        </div>
      ),
      variant: 'destructive',
    })
  }, [])
  return
}

PrintSelectedCredit.dispalyname = 'PayCreditById'

const text = {
  title: 'Opciones de impresion:',
  description: 'Seleccione la opcion deseada para la impresion del pago.',
  error: {
    title: 'Obtencion de datos',
    descriiption: 'Ha ocurrido un error inesperado',
  },
  button: {
    close: 'Volver a la pestaña anterior',
    print: 'Imprimir',
  },
  form: {
    pay: {
      label: 'Numero del pago:',
      placeholder: 'Seleccione el pago',
    },
    options: {
      label: 'Opciones:',
      placeholder: 'Seleccione la opcion de impresion',
    },
  },
}
