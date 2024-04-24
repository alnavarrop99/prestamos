import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from '@/styles/global.module.css'
import { Checkbox } from '@/components/ui/checkbox'
import {
  postPaymentId,
  type TPAYMENT_POST,
  type TPAYMENT_POST_BODY,
} from '@/api/payment'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { useStatus } from '@/lib/context/layout'
import { useNotifications } from '@/lib/context/notification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  _client,
  _credit,
  getCreditByIdOpt,
} from '@/pages/_layout/credit_/$creditId'
import { format } from 'date-fns'
import { getCreditsListOpt } from '../../credit'

export const postPaymentOpt = {
  mutationKey: ['create-payment'],
  mutationFn: postPaymentId,
}

export const Route = createFileRoute('/_layout/credit/$creditId/pay')({
  component: PayCreditById,
})

/* eslint-disable-next-line */
type TFormName = keyof TPAYMENT_POST_BODY

/* eslint-disable-next-line */
export function PayCreditById() {
  const form = useRef<HTMLFormElement>(null)
  const [checked, setChecked] = useState(false)
  const credit = useContext(_credit)
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const { creditId } = Route.useParams()
  const qClient = useQueryClient()

  const onSuccess: (
    data: TPAYMENT_POST,
    variables: TPAYMENT_POST_BODY,
    context: unknown
  ) => unknown = (_, items) => {
    const description = text.notification.decription({
      username: client?.nombres + ' ' + client?.apellidos,
      number: +items?.valor_del_pago,
    })

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: 'POST',
      description,
    })

    qClient?.refetchQueries({ queryKey: getCreditsListOpt?.queryKey })

    qClient?.refetchQueries({
      queryKey: getCreditByIdOpt({ creditId: '' + creditId })?.queryKey,
    })
  }
  const onError: (
    error: Error,
    variables: TPAYMENT_POST_BODY,
    context: unknown
  ) => unknown = (error) => {
    const errorMsg: { type: number; msg: string } = JSON.parse(error.message)

    toast({
      title: error.name + ': ' + errorMsg?.type,
      description: (
        <div className="text-sm">
          <p>{errorMsg?.msg as unknown as string}</p>
        </div>
      ),
      variant: 'destructive',
    })
  }
  const { mutate: createPayment } = useMutation({
    ...postPaymentOpt,
    onSuccess,
    onError,
  })

  const client = useContext(_client)

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      [...new FormData(form.current).entries()]?.map(([key, value]) => {
        if (value === '') return [key, undefined]
        return [key, value]
      })
    ) as Record<TFormName, string>

    createPayment({
      valor_del_pago: +items?.valor_del_pago,
      comentario: items?.comentario ?? '',
      credito_id: +creditId,
      fecha_de_pago: format(items?.fecha_de_pago ?? new Date(), 'yyyy-MM-dd'),
    })

    setOpen({ open: !open })

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <>
      {!open && <Navigate to={'../'} replace />}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-start text-xl md:text-2xl">
            {text.title}
          </DialogTitle>
          <Separator />
          <DialogDescription className="text-start text-xs text-muted-foreground md:text-base">
            <p>{text.descriiption}</p>
          </DialogDescription>
        </DialogHeader>
        <form
          autoFocus={false}
          autoComplete="off"
          ref={form}
          onSubmit={onSubmit}
          id="pay-credit"
          className={clsx(
            'grid-rows-subgrid grid grid-cols-none gap-3 gap-y-4 p-1 md:grid-cols-2 [&>label]:space-y-2',
            styles?.['custom-form']
          )}
        >
          <Label>
            <span>{text.form.amount.label} </span>
            <Input
              required
              min={0}
              step={1}
              name={'valor_del_pago' as TFormName}
              type="number"
              placeholder={text.form.amount.placeholder}
              defaultValue={credit?.cuotas?.at(0)?.valor_de_cuota}
            />
          </Label>
          <Label className="md:!col-span-1">
            <span>{text.form.date.label} </span>
            <DatePicker
              name={'fecha_de_pago' as TFormName}
              label={text.form.date.placeholder}
              className="!border-1 !border-ring"
            />
          </Label>
          <Label className="md:cols-span-full">
            <span>{text.form.comment.label}</span>
            <Textarea
              name={'comentario' as TFormName}
              rows={5}
              placeholder={text.form.comment.placeholder}
            />
          </Label>
        </form>
        <DialogFooter className="flex-col justify-end gap-2 md:flex-row">
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
            className={clsx('flex flex-col-reverse items-end gap-2', {
              '!flex-col': checked,
              '[&>*:last-child]:animate-pulse': !checked,
            })}
          >
            <Button
              variant="default"
              form="pay-credit"
              type="submit"
              disabled={!checked}
              className={clsx({
                'bg-success ring-success-foreground hover:bg-success hover:ring-4':
                  checked,
              })}
            >
              {text.button.pay}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className={clsx('font-bold hover:ring hover:ring-primary')}
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
  descriiption: 'Introdusca los datos correctamente para realizar un pago.',
  button: {
    close: 'No, vuelve a la pestaña anterior',
    pay: 'Si, realiza el pago',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Ejecucion de un pago',
    decription: ({ username, number }: { username: string; number: number }) =>
      'Se ha pagado la cuota con un monto de $' +
      number +
      ' del usuario ' +
      username +
      ' con exito.',
    error: (username: string) =>
      'Ha fallado el pago de la cuota del usuario ' + username,
    retry: 'Reintentar',
  },
  form: {
    amount: {
      label: 'Cantidad:',
      placeholder: 'Monto a pagar',
    },
    comment: {
      label: 'Comentario',
      placeholder: 'Escriba un comentario',
    },
    date: {
      label: 'Fecha de aprobacion',
      placeholder: 'Seleccione una fecha',
    },
  },
}
