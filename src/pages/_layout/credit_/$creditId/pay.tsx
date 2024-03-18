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
import { getCreditIdRes, type TCredit } from '@/api/credit'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { useClientStatus } from '@/lib/context/client'

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
export function PayCreditById( { credit: _credit = {} as TCredit }: TPaymentCreditByIdProps ) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const credit = Route.useLoaderData() ?? _credit
  const { open, setStatus } = useClientStatus()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
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
        console.table(credit)
      }

    setStatus({ open: !open })

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

  if(!credit) return;

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription className='text-muted-foreground'><p>{text.descriiption}</p></DialogDescription>
      </DialogHeader>
      <form
        autoComplete="on"
        ref={form}
        onSubmit={onSubmit}
        id="pay-credit-by-id"
        className={clsx(
          'grid-rows-subgrid grid gap-3 grid-cols-2 gap-y-4 [&>label]:space-y-2',
          styles?.["custom-form"]
        )}
      >
        <Label>
          <span>{text.form.amount.label} </span>
          <Input
            required
            min={0}
            step={50}
            name={'valor_del_pago' as keyof TPayment}
            type="number"
            placeholder={text.form.amount.placeholder}
          />
        </Label>
        <Label className='!col-span-1'>
          <span>{text.form.date.label} </span>
          <DatePicker name={"fecha_de_pago" as keyof TPayment}
            label={text.form.date.placeholder}
            className='border border-primary'
          />
        </Label>
        <Label className='cols-span-full'>
          <span>{text.form.comment.label}</span>
          <Textarea
            name={"comentario" as keyof TPayment}
            rows={5}
            placeholder={text.form.comment.placeholder}
          />
        </Label>
      </form>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Checkbox
            id="checkbox-payment"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="checkbox-payment"
            className={clsx('cursor-pointer')}
          >
            {text.button.checkbox}
          </Label>
          
        </div>
        <div
          className={clsx( 'flex flex-col-reverse items-end gap-2',
            {
              '!flex-col': checked,
              '[&>*:last-child]:animate-pulse': !checked,
            }
          )}
        >
          <Button form="pay-credit-by-id" type="submit" disabled={!checked} className={clsx({
            "hover:bg-green-700": checked,
          })}>
            {text.button.pay}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className={clsx("font-bold hover:ring-1 hover:ring-primary")}
            >
              {text.button.close}
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

PayCreditById.dispalyname = 'PayCreditById'

const text = {
  title: 'Realizar un pago:',
  descriiption:
    'Introdusca los datos correctamente para realizar un pago.',
  button: {
    close: 'No, vuelve a la pestaña anterior',
    pay: 'Si, realiza el pago',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Ejecucion de un pago',
    decription: ({ username, number }: { username: string, number: number }) =>
      'Se ha pagado la cuota con un monto de $' + number + " del usuario " + username + ' con exito.',
    error: 'Error: en el pago de la cuota',
    undo: 'Deshacer',
  },
  form: {
    amount: {
      label: 'Cantidad:',
      placeholder: 'Monto a pagar',
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
