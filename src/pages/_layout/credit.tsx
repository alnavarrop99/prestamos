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
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import {
  AlertCircle,
  Printer,
  CircleDollarSign as Pay,
} from 'lucide-react'
import { createContext, useEffect, useState } from 'react'
import { getCreditById, getCreditsList, type TCREDIT_GET_FILTER, type TCREDIT_GET_FILTER_ALL } from '@/api/credit'
import { useStatus } from '@/lib/context/layout'
import { format, isValid } from 'date-fns'
import styles from "@/styles/global.module.css";
import { getFrecuencyById } from '@/lib/type/frecuency'
import { getClientById } from '@/api/clients'

export const Route = createFileRoute('/_layout/credit')({
  component: Credits,
  loader: async () => {
    // TODO: this is a temporal function to getFilter
    const list = await getCreditsList()
    const data: TCREDIT_GET_FILTER_ALL = await Promise.all( list?.map<Promise<TCREDIT_GET_FILTER>>( async ({ id: creditId, owner_id, frecuencia_del_credito_id }) => {
      const { nombres, apellidos } = await getClientById({ params: { clientId: "" + owner_id } })
      const { cuotas } = await getCreditById({ params: { creditId: "" + creditId } })
      return ({
        clientId: owner_id,
        id: creditId,
        frecuencia: getFrecuencyById({ frecuencyId: frecuencia_del_credito_id ?? 1 }),
        fecha_de_cuota: cuotas?.at(-1)?.fecha_de_pago ,
        valor_de_cuota: cuotas?.at(-1)?.valor_de_cuota,
        numero_de_cuota: cuotas?.at(-1)?.numero_de_cuota,
        valor_de_la_mora: cuotas?.at(-1)?.valor_de_mora,
        nombre_del_cliente: nombres + " " + apellidos,
      }) as TCREDIT_GET_FILTER
    }))
    return data
  },
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
  credits: _credits = [] as TCREDIT_GET_FILTER_ALL,
}: React.PropsWithChildren<TCreditsProps>) {
  const creditsDB = Route.useLoaderData() ?? _credits
  const [selectedCredit, setSelectedCredit] = useState<TCREDIT_GET_FILTER | undefined>(undefined)
  const { open = _open, setOpen } = useStatus() 
  const navigate = useNavigate()

  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  const onClick: (index: number) => React.MouseEventHandler<React.ComponentRef<typeof Button>> = (index) => () => {
    if(!creditsDB || !creditsDB?.[index]) return;
    setOpen({ open: !open })
    setSelectedCredit(creditsDB?.[index])
  }

  const onLink: (index: number) => React.MouseEventHandler<React.ComponentRef<typeof Link>> = (index) => () => {
    if(!creditsDB || !creditsDB?.[index]) return;
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
          {!!creditsDB?.length && <Badge className="px-3 text-xl">
            {creditsDB?.length}
          </Badge>}
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
        { !creditsDB?.length && <p>{text.notfound}</p> }
        { !!creditsDB?.length && <div
          className={clsx('flex flex-wrap gap-6 [&>*]:flex-1 [&>*]:basis-2/5', {
            '[&>*]:basis-1/4': !!creditsDB?.length && creditsDB?.length > 15})}
        >
          {creditsDB?.map( ({
            id: creditId,
            clientId,
            frecuencia,
            numero_de_cuota,
            valor_de_cuota,
            nombre_del_cliente,
            valor_de_la_mora,
            fecha_de_cuota
          }, index) => {
                const status: 'warn' | 'info' | undefined = valor_de_la_mora > 0 ? 'warn' : undefined
                return (
                  <Link
                    key={creditId}
                    className="group"
                    to="./$creditId"
                    params={{ creditId }}
                    onClick={onLink(index)}
                  >
                    <Card className={clsx("h-full shadow-lg transition delay-150 duration-500 group-hover:scale-105 group-hover:shadow-xl grid justify-streetch items-end", styles?.["grid__credit--card"])}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CardTitle className="flex-row items-center">
                            <Link onClick={onOpenUser} to={"/client/$clientId/update"} params={{clientId}} className="hover:underline">
                              {nombre_del_cliente}
                            </Link>
                          </CardTitle>
                          <Badge className='text-md after:duration-400 ms-auto after:opacity-0 after:transition after:delay-150 group-hover:after:opacity-100 group-hover:after:content-["_\219D"]'>
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
                        {numero_de_cuota > 0 && <li>
                            <b> {text.details.pay + ":"} </b>
                            {numero_de_cuota + "."}
                          </li>}
                          <li>
                            <b> {text.details.cuote+ ":"} </b> <b>$</b>
                            {Math.round(valor_de_cuota) + "."}
                          </li>
                           {valor_de_la_mora > 0 && <li>
                            <b> {text.details.mora+ ":"} </b>:
                            <b>$</b>{Math.round(valor_de_la_mora) + "."}
                          </li>}
                          {frecuencia?.id && <li>
                            <b> {text.details.frecuency+ ":"} </b>
                            {getFrecuencyById( { frecuencyId: frecuencia?.id } )?.nombre + "." }
                          </li>}
                        </ul>
                      </CardContent>
                      <CardFooter className="flex items-center gap-2">
                        { isValid(fecha_de_cuota) && <Badge> {format(fecha_de_cuota , "dd-MM-yyyy")} </Badge>}
                        <Dialog open={open} onOpenChange={onOpenChange}>
                          <DialogTrigger asChild className="ms-auto" >
                            <Link
                              to={'./print'}
                              params={{ creditId }}
                            >
                              <Button
                                variant="ghost"
                                onClick={onClick(index)}
                                className={clsx(
                                  'invisible px-3 opacity-0 hover:ring hover:ring-primary group-hover:visible group-hover:opacity-100'
                                )}
                              >
                                <Printer />
                              </Button>
                            </Link>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <Link to={'./pay'} params={{ creditId }}>
                              <Button
                                onClick={onClick(index)}
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
        </div>}
      </div>
    </_creditSelected.Provider>
  )
}

Credits.dispalyname = 'CreditsList'

const text = {
  title: 'Prestamos:',
  browser: 'Prestamos',
  notfound: 'No existen prestamos activos.',
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
    cuote: 'Monto por cuota',
    mora: 'Monto por mora',
    frecuency: 'Frecuencia',
    history: 'Historial de pagos',
  },
}
