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
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { Separator } from '@/components/ui/separator'
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import {
  AlertCircle,
  Printer,
  CircleDollarSign as Pay,
  Info,
} from 'lucide-react'
import { createContext, useState } from 'react'
import { getCreditsFilter, type TCREDIT_GET_FILTER_ALL, type TCREDIT_GET_FILTER } from '@/api/credit'
import { useStatus } from '@/lib/context/layout'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Progress } from '@/components/ui/progress'
import styles from "@/styles/global.module.css";

export const Route = createFileRoute('/_layout/credit')({
  component: Credits,
  loader: getCreditsFilter(),
})

/* eslint-disable-next-line */
interface TCreditsProps {
  credits: TCREDIT_GET_FILTER_ALL
  open?: boolean
}

export const _creditSelected = createContext<TCREDIT_GET_FILTER | undefined>(undefined)

/* eslint-disable-next-line */
export function Credits({
  children,
  open: _open,
  credits: _credits = [] as TCREDIT_GET_FILTER[],
}: React.PropsWithChildren<TCreditsProps>) {
  const creditsDB = Route.useLoaderData() ?? _credits
  const [selectedCredit, setSelectedCredit] = useState<TCREDIT_GET_FILTER | undefined>(undefined)
  const { open = _open, setOpen } = useStatus() 
  const navigate = useNavigate()

  const onClick: ({
    creditId,
  }: {
    creditId: number
  }) => React.MouseEventHandler<React.ComponentRef<typeof Button>> =
    ({ creditId }) =>
    () => {
      if(!creditsDB) return;
      setOpen({ open: !open })
      setSelectedCredit(creditsDB.find(({ id }) => id === creditId))
    }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      !children && navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const onOpenUser: React.MouseEventHandler< React.ComponentRef< typeof Link > > = () => {
    onOpenChange(!open)
  }

  return (
    <_creditSelected.Provider value={selectedCredit}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="acitve-credits" className="cursor-pointer">
            <h1 className="text-3xl font-bold">
              {text.title}
            </h1>
          </Label>
          <Badge className="px-3 text-xl">
            {creditsDB?.length}
          </Badge>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="ms-auto" asChild>
              <Link to={'./new'}>
                <Button variant="default">{text.button.create}</Button>
              </Link>
            </DialogTrigger>
            {children ?? <Outlet />}
          </Dialog>
        </div>
        <Separator />
        <div
          className={clsx('flex flex-wrap gap-6 [&>*]:flex-1 [&>*]:basis-2/5', {
            '[&>*]:basis-1/4': !!creditsDB?.length && creditsDB?.length > 15})}
        >
          {creditsDB?.map( ({
            id,
            cliente_id,
            frecuencia,
            valor_de_mora,
            numero_de_cuota,
            numero_de_cuotas,
            valor_de_cuota,
            nombre_del_cliente,
            fecha_de_cuota,
            monto
          }) => {
                const status: 'warn' | 'info' | undefined = valor_de_mora && valor_de_mora > 0
                  ? 'warn'
                  : undefined

                return (
                  <Link
                    key={id}
                    className="group"
                    to="./$creditId"
                    params={{ creditId: id }}
                  >
                    <Card className={clsx("h-full shadow-lg transition delay-150 duration-500 group-hover:scale-105 group-hover:shadow-xl grid justify-streetch items-end", styles?.["grid__credit--card"])}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CardTitle className="flex-row items-center">
                            <Link onClick={onOpenUser} to={"/client/$clientId/update"} params={{clientId: cliente_id}} className="hover:underline">
                              {nombre_del_cliente}
                            </Link>
                          </CardTitle>
                          { false && <HoverCard>
                            <HoverCardTrigger>
                              <Info
                                className={clsx(
                                  'duration-400 opacity-0 transition delay-150 stroke-blue-500 hover:stroke-blue-700 group-hover:opacity-100',
                                  { invisible: numero_de_cuota }
                                )}
                              />
                            </HoverCardTrigger>
                            <HoverCardContent
                              align="center"
                              className="z-10 py-4"
                            >
                              <Card>
                                <CardHeader className="text-md font-bold text-center">
                                  <CardTitle>{text.details.pay}</CardTitle>
                                  <Separator />
                                </CardHeader>
                                <CardContent>
                                  <ScrollArea className='max-h-52 w-64 overflow-y-auto'>
                                  { <Timeline className="w-fit px-4 py-2 text-sm">
                                      {[1,2,3,4]?.map(
                                        (items) =>
                                          items && (
                                            <TimelineItem key={items}>
                                              <span className="font-bold">
                                                {/*format(items?.fecha_de_pago, "dd-MM-yyyy")*/}:
                                              </span>
                                              <Badge>
                                                ${ /* items?.valor_del_pago */}
                                              </Badge>
                                            </TimelineItem>
                                          )
                                      )}
                                    </Timeline> }
                                  </ScrollArea>
                                </CardContent>
                              </Card>
                            </HoverCardContent>
                          </HoverCard> }
                          <Badge className='text-md after:duration-400 ms-auto after:opacity-0 after:transition after:delay-150 group-hover:after:opacity-100 group-hover:after:content-["_\219D"]'>
                            {id}
                          </Badge>
                        </div>
                       {/* <CardDescription>
                          <p>{comentario}</p>
                        </CardDescription> */}
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
                            {/*status && status === 'info' && (
                              <AlertTriangle className="h-4 w-4" />
                            )*/}
                            <AlertTitle>
                              {text.alert?.[status]?.title}
                            </AlertTitle>
                            {/*status && status === 'info' && (
                              <AlertDescription>
                                {text.alert?.info?.description({
                                  date: new Date(),
                                })}
                              </AlertDescription>
                            )*/}
                          </Alert>
                        )}
                        <div className="flex items-center gap-8">
                          <Progress
                            className="border border-primary"
                            max={100}
                            value={numero_de_cuota/numero_de_cuotas * 100}
                          />
                          <span>
                            <b>$</b>
                            {Math.round(monto)}
                          </span>
                        </div>
                        <ul className="list-inside list-disc">
                          <li>
                            <b> {text.details.pay} </b>:
                            {numero_de_cuota + "/" + numero_de_cuotas}.
                          </li>
                          <li>
                            <b> {text.details.cuote} </b>: <b>$</b>
                            {Math.round(valor_de_cuota)}.
                          </li>
                           {valor_de_mora && valor_de_mora > 0 && <li>
                            <b> {text.details.mora} </b>:
                            <b>$</b>{Math.round(valor_de_mora)}.
                          </li>}
                          <li>
                            <b> {text.details.frecuency} </b>:
                            {frecuencia.nombre}.
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter className="flex items-center gap-2">
                        <Badge> {format(fecha_de_cuota?.toString(), "dd-MM-yyyy")} </Badge>
                        <Dialog open={open} onOpenChange={onOpenChange}>
                          <DialogTrigger asChild className="ms-auto" >
                            <Link
                              to={'./print'}
                              params={{ creditsId: id }}
                            >
                              <Button
                                variant="ghost"
                                onClick={onClick({ creditId: id })}
                                className={clsx(
                                  'invisible px-3 opacity-0 hover:ring hover:ring-primary group-hover:visible group-hover:opacity-100'
                                )}
                              >
                                <Printer />
                              </Button>
                            </Link>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <Link to={'./pay'} params={{ creditId: id }}>
                              <Button
                                onClick={onClick({ creditId: id })}
                                variant="default"
                                className={clsx(
                                  'invisible bg-green-400 px-3 opacity-0 hover:bg-green-700 group-hover:visible group-hover:opacity-100'
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
    pay: 'Numero de cuotas',
    cuote: 'Valor Cuota',
    mora: 'Valor Mora',
    frecuency: 'Frecuencia',
    history: 'Historial de pagos',
  },
}
