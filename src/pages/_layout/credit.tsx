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
import { Link, Outlet, createFileRoute, useMatch, useNavigate, useRouter } from '@tanstack/react-router'
import clsx from 'clsx'
import {
  AlertCircle,
  Printer,
  CircleDollarSign as Pay,
  Annoyed,
} from 'lucide-react'
import { createContext, forwardRef, useEffect, useState } from 'react'
import { getCreditById, getCreditsFilter, getCreditsList, type TCREDIT_GET_FILTER, type TCREDIT_GET_FILTER_ALL } from '@/api/credit'
import { useStatus } from '@/lib/context/layout'
import { format, isValid } from 'date-fns'
import styles from "@/styles/global.module.css";
import { getFrecuencyById } from '@/lib/type/frecuency'
import { getClientById } from '@/api/clients'
import brand from '@/assets/menu-brand.avif'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

export const Route = createFileRoute('/_layout/credit')({
  component,
  pendingComponent,
  errorComponent,
  loader: async () => {
    // TODO: this is a temporal function to getFilter
    if(!!+import.meta.env.VITE_MSW && import.meta.env.DEV) return (await getCreditsFilter()());
    const list = await getCreditsList()
    const data: TCREDIT_GET_FILTER_ALL = await Promise.all( list?.map<Promise<TCREDIT_GET_FILTER>>( async ({ id: creditId, owner_id, frecuencia_del_credito_id }) => {
      const { nombres, apellidos } = await getClientById({ params: { clientId: "" + owner_id } })
      const { cuotas, pagos } = await getCreditById({ params: { creditId: "" + creditId } })
      return ({
        clientId: owner_id,
        id: creditId,
        frecuencia: getFrecuencyById({ frecuencyId: frecuencia_del_credito_id ?? 1 }),
        fecha_de_cuota: cuotas?.at(-1)?.fecha_de_pago ,
        valor_de_cuota: cuotas?.at(-1)?.valor_de_cuota,
        numero_de_cuota: pagos?.length,
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

const STEP = 3
const LENGTH = 8
export const _creditSelected = createContext<TCREDIT_GET_FILTER | undefined>(undefined)

/* eslint-disable-next-line */
export function component({
  children,
  open: _open,
  credits: _credits = [] as TCREDIT_GET_FILTER_ALL,
}: React.PropsWithChildren<TCreditsProps>) {
  const credits = Route.useLoaderData() ?? _credits
  const [selectedCredit, setSelectedCredit] = useState<TCREDIT_GET_FILTER | undefined>(undefined)
  const { open = _open, setOpen } = useStatus() 
  const navigate = useNavigate()
  const [ pagination, setPagination ] = useState<{ start: number, end: number }>({ end: STEP, start: 0 })

  useEffect( () => {
    document.title = import.meta.env.VITE_NAME + " | " + text.browser
  }, [] )

  const onClick: (index: number) => React.MouseEventHandler<React.ComponentRef<typeof Button>> = (index) => () => {
    if(!credits || !credits?.[index]) return;
    setOpen({ open: !open })
    setSelectedCredit(credits?.[index])
  }

  const onPagnation: (params:{ prev?: boolean, next?: boolean, index?: number }) => React.MouseEventHandler< React.ComponentRef< typeof Button > > = ({ next, prev, index }) => () => {
    if( prev && pagination?.end - pagination?.start >= STEP && pagination?.start > 1 ){
      setPagination({ ...pagination, start: pagination?.start - 1, end: pagination?.end - STEP })
    }
    else if( prev && pagination?.start > 0 && pagination?.start < pagination?.end ){
      setPagination({ ...pagination, start: pagination?.start - 1 })
    }
    else if( next && pagination?.start < pagination?.end - 1 && pagination?.start < credits?.length/LENGTH -1 ){
      setPagination({ ...pagination, start: pagination?.start + 1 })
    }
    else if( next && pagination?.start === pagination?.end - 1 && pagination?.start < credits?.length/LENGTH -1){
      setPagination({ ...pagination, start: pagination?.start + 1,  end: pagination?.end + STEP })
    }
    else if( index ) {

    }

    if( typeof index === "undefined" ) return;
    setPagination( { ...pagination, start: index } )
  }

  const onLink: (index: number) => React.MouseEventHandler<React.ComponentRef<typeof Link>> = (index) => () => {
    if(!credits || !credits?.[index]) return;
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
          {!!credits?.length && <Badge className="px-3 text-xl">
            {credits?.length}
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
        { credits?.length > LENGTH && <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                disabled={ pagination?.start <= 0 }
                onClick={onPagnation({ prev: true })}
                className='delay-0 duration-100'
                variant={"outline"}
              >
                Atras
              </Button>
            </PaginationItem>
            { pagination?.end - STEP > 0 && <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>}
            {Array.from({ length: 3 })?.map( (_, index) => {
              if( pagination?.end + index - STEP > (credits?.length - 1)/LENGTH ) return null;
              return <PaginationItem key={index} >
                <Button
                  className='delay-0 duration-100'
                  variant={ pagination?.start === pagination?.end + index - STEP  ? "secondary" : "ghost"}
                  onClick={onPagnation({ index: pagination?.end - STEP + index })}
                >
                  { pagination?.end - STEP + index + 1 }
                </Button>
             </PaginationItem>
            })}
           
            { pagination?.end < (credits?.length)/LENGTH  && <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem> }

            <PaginationItem >
              <Button
                disabled={pagination?.start >= credits?.length/LENGTH - 1}
                className='delay-0 duration-100'
                variant={"outline"} 
                onClick={onPagnation({ next: true })}> Siguiente </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>}
        { !credits?.length && <p>{text.notfound}</p> }
        { !!credits?.length && <div
          className={clsx('flex flex-wrap gap-6 [&>*]:flex-1 [&>*]:basis-2/5', {
            '[&>*]:basis-1/4': !!credits?.length && credits?.length > 15})}
        >
          {credits?.slice( pagination?.start * LENGTH, (pagination?.start + 1) * LENGTH )?.map( ({
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
                        { isValid(fecha_de_cuota) && <Badge> {format(fecha_de_cuota , "dd/MM/yyyy")} </Badge>}
                        <Dialog open={open} onOpenChange={onOpenChange}>
                          <DialogTrigger asChild className="ms-auto" >
                            {<Link
                              to={'./print'}
                              search={{ creditId }}
                              disabled={numero_de_cuota <= 0}
                            >
                              <Button
                                variant="ghost"
                                onClick={onClick(index)}
                                disabled={numero_de_cuota <= 0}
                                className={clsx(
                                  'invisible px-3 opacity-0 hover:ring hover:ring-primary  group-hover:opacity-100',
                                { "group-hover:visible": numero_de_cuota > 0 }
                                )}
                              >
                                <Printer />
                              </Button>
                            </Link>}
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <Link to={'./pay'} params={{ creditId }}>
                              <Button
                                onClick={onClick(index)}
                                variant="default"
                                className={clsx(
                                  'invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-success hover:bg-success hover:ring-4 ring-success-foreground'
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

component.dispalyname = 'CreditsList'



interface TPrintCredit extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  client: string
  ssn: string
  telephone: string
  phone: string
  date: string
  pay: number
  mora?: number
  cuoteNumber: number
  pending: number
  comment?: string
}

export const PrintCredit = forwardRef<HTMLDivElement, TPrintCredit>( function ({ client, cuoteNumber, mora, pay, date, comment, pending, telephone, ssn, phone }, ref) {
  return <main ref={ref} className='p-4 py-6 text-sm [&>section>p]:font-bold [&>section>p>span]:italic [&>section>p>span]:font-normal space-y-3 divide-y-2 divide-gray-900 dark:divide-gray-300'>
    <header>
      <img alt='brand' src={brand} className='filter grayscale light:brightness-50 dark:brightness-200 mx-auto' width={160} />
      <h4 className='text-sm font-bold'>{text.print.title + ":"}</h4>
    </header>
    <section>
      <p>{text.print.client + ":"}<span>{client + "."}</span> </p>
      <p >{text.print.ssn + ":"}<span>{ssn + "."}</span> </p>
      <p>{text.print.telephone + ":"}<span>{telephone + "."}</span> </p>
      <p>{text.print.phone + ":"}<span>{phone + "."}</span> </p>
      <p>{text.print.date + ":"}<span>{date + "."}</span></p>
      <p>{text.print.cuoteNumber + ":"}<span>{cuoteNumber + "."}</span></p>
      <p>{text.print.pay + ":"}<span> $ {pay + "."} </span></p>
      {  mora &&  <p>{text.print.mora + ":"}<span> $ {mora + "."}</span></p> }
    </section>
    <section>
      <p>{text.print.pending + ""} <span>$ {pending + "."}</span></p>
      { comment && <>
        <p>{text.print.comment + ":"}</p>
        <p className='italic !font-normal line-clamp-3'>{comment}</p>
      </>}
    </section>
    <footer>
      <p className='my-4 ms-auto w-fit italic underline'> {text.print.services} <span className='font-bold not-italic'>{import.meta.env.VITE_NAME}</span></p>
    </footer>
  </main>
}  )  

function pendingComponent() {
  return <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Skeleton className='w-48 h-8' />
      <Skeleton className='w-8 h-8 rounded-full' />
      <Skeleton className='ms-auto w-24 h-10' />
    </div>
    <Separator />
    <Skeleton className='w-80 h-10 mx-auto' />
    <div className='flex flex-wrap'>
      {Array.from( { length: LENGTH } )?.map( (_, index) => 
        <div className='basis-1/2  p-4' key={index} >
        <Card className={clsx("h-full shadow-lg grid justify-streetch items-end")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="flex-row items-center">
                <Skeleton className='w-48 h-8' />
              </CardTitle>
              <Skeleton className='ms-auto w-8 h-8 rounded-full' />
            </div>
        </CardHeader>
          <CardContent>
            <div className="space-y-2 px-4">
              <Skeleton className='w-48 h-6' /> 
              <Skeleton className='w-48 h-6' />
              <Skeleton className='w-48 h-6' />
            </div>
          </CardContent>
          <CardFooter className="flex items-center gap-2">
              <Skeleton className='w-32 h-6' /> 
            <Skeleton className='ms-auto w-11 h-10' />
            <Skeleton className='w-11 h-10' />
          </CardFooter>
        </Card>
        </div>
        )}
    </div>
  </div>
}

function errorComponent() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler< React.ComponentRef< typeof Button > > = () => {
    history.back()
  }
  return <div className='flex h-[60vh] [&>svg]:w-32 [&>svg]:stroke-destructive [&>svg]:h-32 items-center justify-center gap-4 text-2xl'>
      <Annoyed  className='animate-bounce' />
      <div className='space-y-2'>
        <h1 className='font-bold'>{text.error}</h1>
        <Separator />
        <Button variant="ghost" onClick={onClick} className='text-sm'> {text.back + "."} </Button>
      </div>
    </div>
}

const text = {
  title: 'Prestamos:',
  error: 'Ups!!! ha ocurrido un error inesperado',
  back: 'Intente volver a la pestaña anterior',
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
  print: {
    title: "Comprobante de pago",
    client: "Cliente",
    ssn: "Cédula",
    telephone: "Teléfono",
    phone: "Celular",
    date: "Fecha",
    pay: "Pago cuota",
    mora: "Mora",
    cuoteNumber: "Número de cuota",
    pending: "Pendiente",
    comment: "Comentario",
    services: "Servicios",
  }
}
