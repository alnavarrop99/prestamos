import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { Separator } from '@radix-ui/react-separator'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'
import {
  AlertCircle,
  AlertTriangle,
  Printer,
  CircleDollarSign as Pay,
  Info,
} from 'lucide-react'
import { createContext, useMemo, useState } from 'react'
import { getCreditsRes, type TCredit } from '@/api/credit'
import { useClientStatus } from '@/lib/context/client'
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/credit')({
  component: Credits,
  loader: getCreditsRes,
})

/* eslint-disable-next-line */
interface TCreditsProps {
  credits: TCredit[]
  open?: boolean
}

export const _creditSelected = createContext<TCredit | undefined>(undefined)

/* eslint-disable-next-line */
export function Credits({
  children,
  open: _open = false,
  credits: _credits = [] as TCredit[],
}: React.PropsWithChildren<TCreditsProps>) {
  const credits = Route.useLoaderData() ?? _credits
  const [credit, setCredit] = useState<TCredit | undefined>(undefined)
  const [active, setActive] = useState<boolean>(true)
  const activeLength = useMemo(
    () => credits?.filter(({ estado }) => estado)?.length,
    [credits]
  )
  const inactiveLength = useMemo(
    () => credits?.filter(({ estado }) => !estado)?.length,
    [credits]
  )
  const { open = _open, setStatus } = useClientStatus()

  const onActive = (checked: boolean) => {
    setActive(checked)
  }

  const onClick: ({
    creditId,
  }: {
    creditId: number
  }) => React.MouseEventHandler<React.ComponentRef<typeof Button>> =
    ({ creditId }) =>
    () => {
      setStatus({ open: !open })
      setCredit(credits.find(({ id }) => id === creditId))
    }

  const onOpenChange = (checked: boolean) => {
    setStatus({ open: checked })
  }

  return (
    <_creditSelected.Provider value={credit}>
      {!children && <Navigate to={Route.to} />}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Switch
            id="acitve-credits"
            checked={active}
            onCheckedChange={onActive}
          >
            {' '}
          </Switch>
          <Label htmlFor="acitve-credits" className="cursor-pointer">
            <h1 className="text-3xl font-bold">
              {text.title + (active ? ' Activos' : ' Inactivos')}
            </h1>
          </Label>
          <Badge className="px-3 text-xl">
            {active ? activeLength : inactiveLength}
          </Badge>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="ms-auto" asChild>
              <Link to={'./new'}>
                <Button>{text.button.create}</Button>
              </Link>
            </DialogTrigger>
            {children ?? <Outlet />}
          </Dialog>
        </div>
        <div
          className={clsx('flex flex-wrap gap-6 [&>*]:flex-1 [&>*]:basis-2/5', {
            '[&>*]:basis-1/4':
              (active && !!activeLength && activeLength > 15) ||
              (!active && inactiveLength && inactiveLength > 15),
          })}
        >
          {credits
            ?.filter(({ estado }) => estado === active)
            ?.map(
              ({
                pagos,
                fecha_de_aprobacion,
                frecuencia_del_credito,
                id,
                cantidad,
                comentario,
                porcentaje,
                numero_de_cuotas,
                cuotas,
                valor_de_mora,
              }) => {
                const status: 'warn' | 'info' | undefined = valor_de_mora
                  ? 'warn'
                  : 'info'
                return (
                  <Link
                    key={id}
                    className="group"
                    to="./$creditId"
                    params={{ creditId: id }}
                  >
                    <Card className="h-fit shadow-lg transition delay-150 duration-500 group-hover:scale-105 group-hover:shadow-xl ">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CardTitle className="flex-row items-center">
                            <Link className="hover:underline">
                              {'Armando Navarro'}
                            </Link>
                          </CardTitle>
                          <HoverCard>
                            <HoverCardTrigger>
                              <Info
                                className={clsx(
                                  'duration-400 opacity-0 transition delay-150 hover:stroke-blue-500 group-hover:opacity-100',
                                  { invisible: !cuotas?.length }
                                )}
                              />
                            </HoverCardTrigger>
                            <HoverCardContent
                              align="center"
                              className="z-10 py-4"
                            >
                              <Card className="max-h-56 overflow-y-auto ring-1 ring-blue-500">
                                <CardHeader className="text-md font-bold">
                                  <CardTitle>{text.details.pay}</CardTitle>
                                  <Separator />
                                </CardHeader>
                                <CardContent>
                                  {pagos?.length && (
                                    <Timeline className="w-fit px-4 py-2 text-sm">
                                      {pagos?.map(
                                        (items) =>
                                          items && (
                                            <TimelineItem key={items?.id}>
                                              {' '}
                                              <span className="font-bold">
                                                {items?.fecha_de_pago}:{' '}
                                              </span>{' '}
                                              <Badge>
                                                ${items?.valor_del_pago}
                                              </Badge>{' '}
                                            </TimelineItem>
                                          )
                                      )}
                                    </Timeline>
                                  )}
                                </CardContent>
                              </Card>
                            </HoverCardContent>
                          </HoverCard>

                          <Badge className='text-md after:duration-400 ms-auto after:opacity-0 after:transition after:delay-150 group-hover:after:opacity-100 group-hover:after:content-["_\219D"]'>
                            {' '}
                            {id}{' '}
                          </Badge>
                        </div>
                        <CardDescription>
                          <p>{comentario}</p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {status && (
                          <Alert
                            variant={
                              status === 'warn' ? 'destructive' : 'default'
                            }
                          >
                            {status === 'warn' && (
                              <AlertCircle className="h-4 w-4" />
                            )}
                            {status === 'info' && (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                            <AlertTitle>
                              {text.alert?.[status]?.title}
                            </AlertTitle>
                            {status === 'info' && (
                              <AlertDescription>
                                {text.alert?.info?.description({
                                  date: new Date(),
                                })}
                              </AlertDescription>
                            )}
                          </Alert>
                        )}
                        <div className="flex items-center gap-8">
                          <Progress
                            className="border border-primary"
                            max={100}
                            value={porcentaje}
                          />
                          <span>
                            {' '}
                            <b>$</b>
                            {((porcentaje / 100) * cantidad).toFixed(1)}{' '}
                          </span>
                        </div>
                        <ul className="list-inside list-disc">
                          <li>
                            {' '}
                            <b> {text.details.amount} </b>: <b>$</b>
                            {cantidad}.
                          </li>
                          <li>
                            {' '}
                            <b> {text.details.pays} </b>:{' '}
                            {pagos?.length + '/' + numero_de_cuotas}.
                          </li>
                          <li>
                            {' '}
                            <b> {text.details.frecuency} </b>:{' '}
                            {frecuencia_del_credito.nombre}.
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter className="flex items-center gap-2">
                        <Badge> {fecha_de_aprobacion} </Badge>
                        <Link
                          className="ms-auto"
                          to={'./print'}
                          params={{ creditsId: id }}
                        >
                          <Button
                            variant="ghost"
                            onClick={onClick({ creditId: id })}
                            className={clsx(
                              'invisible px-3 opacity-0 transition delay-150 duration-500 hover:ring hover:ring-primary group-hover:visible group-hover:opacity-100'
                            )}
                          >
                            <Printer />
                          </Button>
                        </Link>
                        <Link to={'./pay'} params={{ creditId: id }}>
                          <Button
                            onClick={onClick({ creditId: id })}
                            variant="default"
                            className={clsx(
                              'invisible bg-green-400 px-3 opacity-0 transition delay-150 duration-500 hover:bg-green-700 group-hover:visible group-hover:opacity-100'
                            )}
                          >
                            <Pay />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </Link>
                )
              }
            )}
        </div>
      </div>
    </_creditSelected.Provider>
  )
}

Credits.dispalyname = 'CreditsList'

const text = {
  title: 'Prestamos:',
  alert: {
    info: {
      title: 'Fecha limite',
      description: ({ date }: { date: Date }) =>
        'El cobro se aproxima a su fecha limite ' + date + '.',
    },
    warn: {
      title: 'Cliente en estado moroso',
    },
  },
  button: {
    create: 'Nuevo',
    delete: 'Eliminar',
    deactivate: 'Desactivar',
  },
  details: {
    amount: 'Monto Total',
    pays: 'Pagos activos',
    frecuency: 'Frecuencia',
    pay: 'Historial de pagos',
  },
}
