import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import styles from "@/styles/global.module.css"
import { Checkbox } from '@/components/ui/checkbox'
import { postPaymentId, type TPAYMENT_POST_BODY } from "@/api/payment";
import { getCreditById, type TCREDIT_GET } from '@/api/credit'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { useMutation } from '@tanstack/react-query'
import { _clientContext } from '@/pages/_layout/credit_/$creditId'
import { TCLIENT_GET } from '@/api/clients'

export const Route = createFileRoute('/_layout/credit/$creditId/pay')({
  component: PayCreditById,
  loader: getCreditById
})

/* eslint-disable-next-line */
interface TPaymentCreditByIdProps {
  credit?: TCREDIT_GET
}

/* eslint-disable-next-line */
type TFormName = keyof TPAYMENT_POST_BODY

/* eslint-disable-next-line */
export function PayCreditById( { credit: _credit = {} as TCREDIT_GET }: TPaymentCreditByIdProps ) {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const credit = Route.useLoaderData() ?? _credit
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const { mutate: createPayment } = useMutation({
    mutationKey: ["create-pay"],
    mutationFn: postPaymentId,
  })
  const [client] = useContext(_clientContext) ?? [{} as TCLIENT_GET]

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler< HTMLFormElement > = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      [...new FormData(form.current).entries()]?.map( ([ key, value ]) => {
      if( value === "" ) return [ key, undefined ]
      return [ key, value ]
    })) as Record<TFormName, string>

    const description = text.notification.decription({
      username: client?.nombres + " " + client?.apellidos,
      number: +items?.valor_del_pago,
    })

    const action =
      (items: Record<TFormName, string>) =>
      () => {
        createPayment({
          valor_del_pago: +items?.valor_del_pago,
          comentario: items?.comentario ?? "",
          credito_id: credit?.id,
          fecha_de_pago: items?.fecha_de_pago
      })
        pushNotification({
          date: new Date(),
          action: "POST",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setOpen({ open: !open })

    const onClick = () => {
      clearTimeout(timer)
    }

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

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <>
    {!open && <Navigate to={"../"} replace  />}
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
            name={'valor_del_pago' as TFormName}
            type="number"
            placeholder={text.form.amount.placeholder}
              defaultValue={credit?.cuotas?.at(0)?.valor_de_cuota}
          />
        </Label>
        <Label className='!col-span-1'>
          <span>{text.form.date.label} </span>
          <DatePicker name={"fecha_de_pago" as TFormName}
            label={text.form.date.placeholder}
            className='border border-primary'
          />
        </Label>
        <Label className='cols-span-full'>
          <span>{text.form.comment.label}</span>
          <Textarea
            name={"comentario" as TFormName}
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
          <Button variant="default" form="pay-credit" type="submit" disabled={!checked} className={clsx({
            "bg-success hover:bg-success hover:ring-4 ring-success-foreground": checked,
          })}>
            {text.button.pay}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className={clsx("font-bold hover:ring hover:ring-primary")}
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
