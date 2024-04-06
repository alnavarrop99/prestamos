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
import { useRef, useState } from 'react'
import clsx from 'clsx'
import styles from "@/styles/global.module.css"
import { type TCREDIT_GET, getCreditById } from '@/api/credit'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { useStatus } from '@/lib/context/layout'
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/credit/$creditId/print')({
  component: PrintCreditById,
  loader: getCreditById
})

/* eslint-disable-next-line */
interface TPaymentCreditByIdProps {
  credit?: TCREDIT_GET
}

/* eslint-disable-next-line */
type TOptState = "last" | "especific"
  

/* eslint-disable-next-line */
export function PrintCreditById( { credit: _credit = {} as TCREDIT_GET }: TPaymentCreditByIdProps ) {
  const form = useRef<HTMLFormElement>(null)
  const [ opt, setOpt ] = useState<TOptState | undefined>(undefined)
  const credit = Route.useLoaderData() ?? _credit
  const { open, setOpen } = useStatus()

  const onValueChange = ( value: string ) => {
    setOpt(value as TOptState)
  }

  const onSubmit: React.FormEventHandler< HTMLFormElement > = (ev) => {
    if (!form.current || !opt) return

    console.table(credit)
    setOpen({ open: !open })

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <>
    { !open && <Navigate to={"../"} /> }
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
          <Select required name={'options' as keyof typeof text.form} value={opt} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={text.form.options.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              { text.form.options.items.map( ( item ) => <SelectItem key={item} value={item}>{item}</SelectItem> ) }
            </SelectContent>
          </Select>
        </Label>
      </form>
      <DialogFooter >
        <div className={clsx("flex gap-2",
        {
          '!flex-row-reverse': opt,
          '[&>*:last-child]:animate-pulse': !opt,
        }
      )}>
        <Button
          variant="default"
          form="print-credit"
          type="submit"  
          disabled={!opt}
        >
          {text.button.print}
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
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
    options: {
      label: 'Opciones:',
      placeholder: 'Seleccione la opcion de impresion',
      items: [ "Ultimo pago","Pago especifico" ]
    },
  }
}
