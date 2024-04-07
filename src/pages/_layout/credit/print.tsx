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
import { useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from "@/styles/global.module.css"
import { TCREDIT_GET_FILTER, getCreditById  } from '@/api/credit'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { PrintCredit, _creditSelected } from "@/pages/_layout/credit";
import { useStatus } from '@/lib/context/layout'
import { useReactToPrint } from "react-to-print";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { getClientById } from '@/api/clients'
import { Input } from '@/components/ui/input'

type TSearch = {
  creditId: number
}
export const Route = createFileRoute('/_layout/credit/print')({
  component: PrintSelectedCredit,
  validateSearch: ( searh: TSearch ) => ( searh as TSearch ),
  loader: async ({ location: { search } }) => {
    const credit = await getCreditById({ params: { creditId: "" + (search as TSearch)?.creditId  } })
    const client = await getClientById({ params: { clientId: "" + credit?.owner_id } })
    return ({ credit, client })
  }
})

const options = { last: "Ultimo pago", especific: "Pago especifico" }

/* eslint-disable-next-line */
interface TPrintSelectedCreditProps {
  credit?: TCREDIT_GET_FILTER
}

/* eslint-disable-next-line */
type TOptState = keyof typeof options

/* eslint-disable-next-line */
export function PrintSelectedCredit( { credit: _credit = {} as TCREDIT_GET_FILTER }: TPrintSelectedCreditProps ) {
  const form = useRef<HTMLFormElement>(null)
  const [ { opt, payIndex }, setOpt ] = useState<{ payIndex?: number, opt?: TOptState }>({})
  const { client, credit: creditDB } = Route.useLoaderData()
  const { open, setOpen } = useStatus()
  const ref = useRef< React.ComponentRef< typeof PrintCredit > >(null)

  const onValueChange = ( value: string ) => {
    setOpt({opt: value as TOptState })
  }

  const onChange: React.ChangeEventHandler< React.ComponentRef< typeof Input > > = ( ev ) => {
    const value = +ev.target.value - 1
    if( value < 0 && value >= creditDB?.pagos?.length) return; 
    setOpt( { opt, payIndex: value })
  }

  const handlePrint = useReactToPrint({
    content: () => ref?.current,
    documentTitle: "Pago-" + new Date(),
  })

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current || !opt || !ref?.current) return

    console.table(creditDB)
    setOpen({ open: !open })

    handlePrint()

    form.current.reset()
    ev.preventDefault()
  }

  const pay = useMemo( () => creditDB?.pagos?.at( payIndex ?? -1 ), [payIndex] ) 
  const mora = useMemo( () => creditDB?.cuotas?.at( payIndex ?? -1 )?.valor_de_mora, [payIndex] )

  return (
    <>
    {!open && <Navigate to={"../"} replace />}
    <DialogContent className="max-w-lg">
      <DialogHeader>
          <div className='flex gap-2 center'>
            <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        </div>
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
          <Select required name={'options'} value={opt} onValueChange={onValueChange}>
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
            <Input 
                required
                onChange={onChange}
                type='number'
                min={1}
                max={creditDB?.pagos?.length }
                placeholder={text.form.pay.placeholder} 
             />
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
              <Button form="print-credit" type="submit"  
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
                  // TODO: date: format( pay?.fecha_de_pago ?? "",  "dd-MM-yyyy / hh:mm aaaa" ),
                  date: pay?.fecha_de_pago?.slice(0,10) ?? "",
                  pay: +(pay?.valor_del_pago ?? 0)?.toFixed(2),
                  mora: mora ? +mora.toFixed(2) : undefined,
                  cuoteNumber: (payIndex ?? creditDB?.pagos?.length - 1) + 1,
                  pending: +(creditDB?.monto - creditDB?.pagos?.slice( 0, payIndex ? payIndex + 1 : -1)?.reduce( (prev, acc) => {
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

PrintSelectedCredit.dispalyname = 'PayCreditById'

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
      placeholder: 'Escriba el numero del pago',
    },
    options: {
      label: 'Opciones:',
      placeholder: 'Seleccione la opcion de impresion',
    },
  }
}
