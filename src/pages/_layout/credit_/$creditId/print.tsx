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
import { createFileRoute } from '@tanstack/react-router'
import { useContext, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from "@/styles/global.module.css"
import { type TCREDIT_GET } from '@/api/credit'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { useStatus } from '@/lib/context/layout'
import { Navigate } from '@tanstack/react-router'
import { PrintCredit, _creditSelected } from '../../credit'
import { useReactToPrint } from 'react-to-print'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { _clientContext, _selectedCredit } from '../$creditId'
import { TCLIENT_GET } from '@/api/clients'
import { format } from 'date-fns'

export const Route = createFileRoute('/_layout/credit/$creditId/print')({
  component: PrintCreditById,
  validateSearch: ( search ) => ( search as { index: number } )
})

/* eslint-disable-next-line */
interface TPaymentCreditByIdProps {
  credit?: TCREDIT_GET
}

/* eslint-disable-next-line */
const options = { last: "Ultimo pago", especific: "Pago especifico" }
type TOptState = keyof typeof options
  

/* eslint-disable-next-line */
export function PrintCreditById( { credit: _credit = {} as TCREDIT_GET }: TPaymentCreditByIdProps ) {
  const form = useRef<HTMLFormElement>(null)
  const [ credit ] = useContext(_selectedCredit) ?? [ {} as TCREDIT_GET ]
  const [ client ] = useContext(_clientContext) ?? [ {} as TCLIENT_GET ]
  const { open, setOpen } = useStatus()
  const ref = useRef< React.ComponentRef< typeof PrintCredit > >(null)
  const search = Route.useSearch()
  const [ { opt, payIndex }, setOpt ] = useState<{ payIndex?: number, opt?: TOptState }>({
    opt: !!Object?.values(search)?.length ? "especific" : undefined,
    payIndex: search?.index,
  })

  const handlePrint = useReactToPrint({
    content: () => ref?.current,
    documentTitle: "Pago-" + new Date(),
  })

  const onChange = ( value: string ) => {
     const pay = +value 
     if( pay < 0 && pay >= credit?.pagos?.length) return; 
     setOpt({ opt, payIndex: pay })
  }

  const onValueChange = ( value: string ) => {
    setOpt({opt: value as TOptState })
  }

  const onSubmit: React.FormEventHandler< HTMLFormElement > = (ev) => {
    if (!form.current || !opt) return

    console.table(credit)
    setOpen({ open: !open })

    handlePrint()

    form.current.reset()
    ev.preventDefault()
  }

  const pay = useMemo( () => credit?.pagos?.at( payIndex ?? -1 ), [payIndex] ) 
  const mora = useMemo( () => credit?.cuotas?.at( payIndex ?? -1 )?.valor_de_mora, [payIndex] )

  return (
    <>
    { !open && <Navigate to={"../"} replace /> }
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription className='text-muted-foreground'>{text.description}</DialogDescription>
      </DialogHeader>
      <form
        autoComplete="on"
        ref={form}
        onSubmit={onSubmit}
        id="print-credit"
        className={clsx(
          'grid-rows-subgrid grid gap-3 gap-y-4 [&>label]:space-y-2',
          styles?.["custom-form"]
        )}
      >
        <Label className='[&>span]:after:content-["_*_"] [&>span]:after:text-red-500'>
          <span>{text.form.options.label} </span>
          <Select 
              required
              name={'options'}
              value={opt}
              onValueChange={onValueChange}
              defaultValue={opt}
            >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={text.form.options.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              { Object.entries(options).map( ( [ key, value ], i ) => <SelectItem key={i} value={key}>{value}</SelectItem> ) }
            </SelectContent>
          </Select>
        </Label>
        { opt === "especific" &&
        <Label>
          <span>{text.form.pay.label}</span>
            <Select 
              required
              name={'payment'} 
              onValueChange={onChange}
              defaultValue={typeof payIndex !== "undefined" ? ""+payIndex : undefined}
            >
            <SelectTrigger className="w-full !border-ring !border-1">
              <SelectValue placeholder={text.form.pay.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              { credit?.pagos?.map( ( { fecha_de_pago }, index ) => ( <SelectItem value={""+index}> {format(credit?.cuotas?.[index].fecha_de_pago, "dd/MM/yyyy")} </SelectItem> ) ) }
            </SelectContent>
          </Select>
        </Label> }
      </form>
      <DialogFooter >
        <div className={clsx("flex gap-2",
        {
          '!flex-row-reverse': opt === "last" || ( opt === "especific" &&  typeof payIndex !== "undefined" ),
          '[&>*:last-child]:animate-pulse': !opt ||  (opt === "especific" && typeof payIndex === "undefined"),

        }
      )}>
        <HoverCard openDelay={0} closeDelay={0.5 * 1000}> 
            <HoverCardTrigger asChild className={clsx('[&>svg]:stroke-primary [&>svg]:cursor-pointer', {
            })}>
                <Button
                  variant="default"
                  form="print-credit"
                  type="submit"  
                  disabled={!opt || ( opt === "especific" && typeof payIndex === "undefined")}
                >
                  {text.button.print}
              </Button>
            </HoverCardTrigger>
          { opt && <HoverCardContent side='right' className='bg-secondary-foreground rounded-md'>
              <PrintCredit
                {...{
                  client: client?.nombres + " " + client?.apellidos,
                  ssn: client?.numero_de_identificacion,
                  telephone: client?.telefono,
                  phone: client?.celular,
                  date: format( pay?.fecha_de_pago ?? "",  "dd/MM/yyyy - hh:mm aaaa" ),
                  // date: pay?.fecha_de_pago ?? "",
                  pay: +(pay?.valor_del_pago ?? 0)?.toFixed(2),
                  mora: mora ? +mora.toFixed(2) : undefined,
                  cuoteNumber: (payIndex ?? credit?.pagos?.length - 1) + 1,
                  pending: +(credit?.monto - credit?.pagos?.slice( 0, payIndex ? payIndex + 1 : -1)?.reduce( (prev, acc) => {
                    const res: typeof acc = { ...acc } 
                    res.valor_del_pago += prev?.valor_del_pago
                    return res
                  }, { valor_del_pago: 0 } )?.valor_del_pago)?.toFixed(2),
                    comment: pay?.comentario === "" ? pay?.comentario : undefined,
                }}
                ref={ref} />
          </HoverCardContent>}
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
        </div>
      </DialogFooter>
    </DialogContent>
    </>
  )
}

PrintCreditById.dispalyname = 'PayCreditById'

const text = {
  title: 'Opciones de impresion:',
  description: "Seleccione la opcion deseada para la impresion del pago.",
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
      items: [ "Ultimo pago","Pago especifico" ]
    },
  }
}
