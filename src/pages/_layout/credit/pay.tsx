import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useContext, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import styles from "@/styles/global.module.css"
import { Checkbox } from '@/components/ui/checkbox'
import { type TPAYMENT_GET } from "@/api/payment";
import { type TCREDIT_GET } from '@/api/credit'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { _creditSelected } from "@/pages/_layout/credit";
import { useNotifications } from '@/lib/context/notification'
import { useStatus } from '@/lib/context/layout'

export const Route = createFileRoute('/_layout/credit/pay')({
  component: PaySelectedCredit,
})

/* eslint-disable-next-line */
interface TPaySelectedCreditProps {
  credit?: TCREDIT_GET
}

/* eslint-disable-next-line */
export function PaySelectedCredit( { credit: _credit = {} as TCREDIT_GET }: TPaySelectedCreditProps ) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const credit = useContext(_creditSelected) ?? _credit
  const { setNotification } = useNotifications()
  const { open, setOpen } = useStatus()
  const navigate = useNavigate()

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof TPAYMENT_GET, string>

    const description = text.notification.decription({
      username: credit.nombre_del_cliente,
      number: +items?.valor_del_pago,
    })

    const action =
      ({ ...props }: Record<keyof TPAYMENT_GET, string>) =>
      () => {
      console.table(props)
      console.table(credit)
      setNotification({
          date: new Date(),
          action: "POST",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setOpen({ open: !open })
    navigate({to: "../"})

    const onClick = () => {
      clearTimeout(timer)
    }

    if ( true) {
      // const { nombres: firstName, apellidos: lastName } = items
      toast({
        title: text.notification.titile,
        description,
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
        <DialogDescription className='text-muted-foreground'><p>{text.descriiption}</p></DialogDescription>
      </DialogHeader>
      <form
        autoComplete="off"
        ref={form}
        onSubmit={onSubmit}
        id="pay-credit"
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
            name={'valor_del_pago' as keyof TPAYMENT_GET}
            type="number"
            placeholder={text.form.amount.placeholder}
          />
        </Label>
        <Label className='!col-span-1'>
          <span>{text.form.date.label} </span>
          <DatePicker name={"fecha_de_pago" as keyof TPAYMENT_GET}
            label={text.form.date.placeholder}
            className='border border-primary'
          />
        </Label>
        <Label className='cols-span-full'>
          <span>{text.form.comment.label}</span>
          <Textarea
            name={"comentario" as keyof TPAYMENT_GET}
            rows={5}
            placeholder={text.form.comment.placeholder}
          />
        </Label>
      </form>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Checkbox
            id="checkbox-payment-credit"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="checkbox-payment-credit"
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
          <Button form="pay-credit" type="submit" disabled={!checked} className={clsx({
            "bg-green-500 hover:bg-green-700": checked,
          })}>
            {text.button.pay}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className={clsx("font-bold hover:ring hover:ring-primary")}
            >
              {text.button.close}
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

PaySelectedCredit.dispalyname = 'PayCreditById'

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
