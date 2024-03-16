import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import styles from "@/styles/global.module.css"
import { Checkbox } from '@/components/ui/checkbox'
import { type TPayment } from "@/api/payment";
import { type TCredit, getCreditIdRes } from '@/api/credit'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_layout/credit/$creditId/pay')({
  component: PayCreditById,
  loader: getCreditIdRes
})

/* eslint-disable-next-line */
interface TPaymentCreditByIdProps {
  amount?: number,
  credit?: TCredit
}

/* eslint-disable-next-line */
export function PayCreditById( { amount: _amount = 0, credit: _credit = {} as TCredit }: TPaymentCreditByIdProps ) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const [amount, setAmount] = useState(_amount)
  // TODO

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onChange: React.ChangeEventHandler< React.ComponentRef< typeof Input > > = (ev) => {
    const { value } = ev.target
    setAmount( Number.parseFloat(Number.parseFloat(value).toFixed(2)) )
  }


  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof TPayment, string>

    const action =
      ({ ...props }: Record<keyof TPayment, string>) =>
      () => {
        console.table(props)
      }

    const timer = setTimeout(action(items), 6 * 1000)

    const onClick = () => {
      clearTimeout(timer)
    }

    if ( true) {
      // const { nombres: firstName, apellidos: lastName } = items
      toast({
        title: text.notification.titile,
        description: text.notification.decription({
          // username: firstName + ' ' + lastName,
          username: "",
          number: 0,
        }),
        variant: 'default',
        action: (
          <ToastAction altText="action from new user">
            <Button variant="default" onClick={onClick}>
              {text.notification.undo}
            </Button>
          </ToastAction>
        ),
      })
    }

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>{text.descriiption}</DialogDescription>
      </DialogHeader>
      <form
        autoComplete="on"
        ref={form}
        onSubmit={onSubmit}
        id="new-client-form"
        className={clsx(
          'grid-rows-subgrid grid gap-3 grid-cols-2 gap-y-4 [&>label]:space-y-2',
          styles?.["custom-form"]
        )}
      >
        <Label>
          <span>{text.form.amount.label} </span>
          <Input
            required
            value={amount}
            min={0}
            step={50}
            name={'valor_del_pago' as keyof TPayment}
            type="number"
            placeholder={text.form.amount.placeholder}
            onChange={onChange}
          />
        </Label>
        <Label className='!col-span-1'>
          <span>{text.form.date.label} </span>
          <DatePicker label={text.form.date.placeholder} className='border border-primary' />
        </Label>
        <Label className='cols-span-full'>
          <span>{text.form.comment.label}</span>
          <Textarea
            rows={5}
            name={'' as keyof TCredit}
            placeholder={text.form.comment.placeholder}
          />
        </Label>
      </form>
      <DialogFooter className="justify-end">
        <div className="flex items-center gap-2 font-bold italic">
          <Checkbox
            id="switch-updates-client"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="switch-updates-client"
            className={clsx('cursor-pointer')}
          >
            {text.button.checkbox}
          </Label>
          
        </div>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            className="font-bold hover:ring-1 hover:ring-primary"
          >
            {text.button.close}
          </Button>
        </DialogClose>
        <Button form="new-client-form" type="submit" disabled={!checked} className={clsx({
          "bg-green-700": checked,
        })}>
          {text.button.pay}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

PayCreditById.dispalyname = 'PayCreditById'

const text = {
  title: 'Ejecutar un pago:',
  descriiption:
    'Introdusca los datos de la ejucucion de un pago',
  button: {
    close: 'Cerrar',
    pay: 'Pagar',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Ejecucion de un pago',
    decription: ({ username, number }: { username: string, number: number }) =>
      'Se ha pagado la cuota ' + number + "del usuario " + username + ' con exito.',
    error: 'Error: en el pago de la cuota',
    undo: 'Deshacer',
  },
  form: {
    amount: {
      label: 'Cantidad:',
      placeholder: 'Especifique cantidad de monto a pagar',
    },
    comment: {
      label: 'Comentario',
      placeholder: "Escriba un comentario"
    },
    date: {
      label: 'Fecha de aprobacion',
      placeholder: "Seleccione una fecha"
    }
  },
}
