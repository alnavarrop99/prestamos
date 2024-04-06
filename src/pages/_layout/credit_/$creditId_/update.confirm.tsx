import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle  } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { patchCreditsById, type TCREDIT_GET, getCreditById } from '@/api/credit'
import { useNotifications } from '@/lib/context/notification'
import { _clientContext, _creditChangeContext, _paymentDeleteContext } from './update'
import { useMutation } from '@tanstack/react-query'
import { TPAYMENT_GET_BASE, deletePaymentById, patchPaymentById } from "@/api/payment";
import { TCLIENT_GET_BASE } from '@/api/clients'

export const Route = createFileRoute('/_layout/credit/$creditId/update/confirm')({
  component: UpdateConfirmationCredit,
  loader: getCreditById
})

/* eslint-disable-next-line */
interface TUpdateConfirmationCreditProps {
  credit?: TCREDIT_GET
}

/* eslint-disable-next-line */
export function UpdateConfirmationCredit({ credit: _credit = {} as TCREDIT_GET }: TUpdateConfirmationCreditProps) {
  const [checked, setChecked] = useState(false)
  const creditDB = Route.useLoaderData()
  const [ creditChange ] = useContext(_creditChangeContext) ?? [ _credit ]
  const [ deletePayment, setPaymentDelete ] = useContext(_paymentDeleteContext) ?? [ {}, (() => {}) ]
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const [ client ] = useContext(_clientContext) ?? [{} as TCLIENT_GET_BASE]

  const { mutate: updateCredit } = useMutation({
    mutationKey: ["update-credit"],
    mutationFn: patchCreditsById,
  })

  const { mutate: updatePayment } = useMutation({
    mutationKey: ["update-payment"],
    mutationFn: patchPaymentById,
  })

  const { mutate: removePaymentById } = useMutation({
    mutationKey: ["delete-payment"],
    mutationFn: deletePaymentById,
  })

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }


  const onSubmit: React.FormEventHandler< React.ComponentRef< typeof Button > > = (ev) => {
    const description = text.notification.decription({
      username: client?.nombres + " " + client?.apellidos,
    })

    const creditItems = Object.fromEntries( 
      Object.entries( creditChange )?.map( ( [key, value], i ) => {
        if(key === "cuotas" as keyof TCREDIT_GET || key === "pagos" as keyof TCREDIT_GET || key === "tipo_de_mora" as keyof TCREDIT_GET || key === "frecuencia_del_credito" as keyof TCREDIT_GET || ( value === Object.values( creditDB )?.[i] && key !== "id" as keyof TCREDIT_GET) ) return [key, undefined];
        return [key, value]
      } )?.filter( ([, value]) => !!value )
    ) as Record< keyof TCREDIT_GET, string> & { id: number }

    const paymentItems = creditChange?.pagos?.map( (_, i) => Object.fromEntries( Object.entries( creditChange?.pagos?.[i] )?.map( ( [key, value], k ) => {
        if( key !== "id" as keyof TPAYMENT_GET_BASE && value === Object.values( creditDB?.pagos?.[i] )?.[k] ) return [key, undefined];
        return [key, value]
      } )?.filter( ([, value]) => !!value )
    ) as Record< keyof TPAYMENT_GET_BASE, string> & { id: number } )?.filter( ( { id, ...items } ) => ( Object.values( items ).some( ( item ) => ( !!item ) ) ) )

    const deleteItems = Object.values( deletePayment )

    const action = (credit: Record< keyof TCREDIT_GET, string> & { id: number }, payment: (Record< keyof TPAYMENT_GET_BASE, string> & { id: number })[], deletePay: number[]) => () => {
      if(credit?.id && Object?.values( credit )?.length > 1) {
        updateCredit({
          creditId: credit.id,
          updateCredit: {
            valor_de_mora:  +credit?.valor_de_mora || undefined,
            cobrador_id: +credit?.cobrador_id || undefined,
            garante_id: +credit?.garante_id || undefined,
            comentario: credit?.comentario,
            estado: +credit?.estado || undefined,
            monto: +credit?.monto || undefined,
            tasa_de_interes: +credit?.tasa_de_interes || undefined,
            tipo_de_mora_id: +credit?.tipo_de_mora_id || undefined,
            dias_adicionales: +credit?.dias_adicionales || undefined,
            numero_de_cuotas: +credit?.numero_de_cuotas || undefined,
            fecha_de_aprobacion: credit?.fecha_de_aprobacion,
            frecuencia_del_credito_id: +credit?.frecuencia_del_credito_id || undefined,
          }
      })
     }
      for ( const pay of payment ){
        if( !pay?.id ) continue;
        updatePayment({
          paymentId: pay?.id,
          updatePayment: {
            valor_del_pago: +pay?.valor_del_pago || undefined,
            comentario: pay?.comentario,
            fecha_de_pago: pay?.fecha_de_pago
          }
        })
      }
      for ( const pay of deletePay ){
        if( !pay ) continue;
        removePaymentById({ paymentId: pay })
      }
      setPaymentDelete({})
      pushNotification({
          date: new Date(),
          action: "PATH",
          description,
        })
    }

    const timer = setTimeout(action(creditItems, paymentItems, deleteItems), 6 * 1000)
    setOpen({open: !open})
    
    const onClick = () => {
      clearTimeout(timer)
      setPaymentDelete(deletePayment)
    }

    toast({
      title: text.notification.titile,
      description,
      variant: 'default',
      action: (
        <ToastAction altText="action from delete client">
          <Button variant="default" onClick={onClick}>
            {text.notification.undo}
          </Button>
        </ToastAction>
      ),
    })

    ev.preventDefault()
  }

  return (
    <>
    {!open && <Navigate to={"../../"} replace /> }
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>
          <Alert variant="destructive" >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{text.alert.title}</AlertTitle>
            <AlertDescription>
              {text.alert.description({ 
                username: ""+creditDB?.owner_id 
              })}
            </AlertDescription>
          </Alert>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="!justify-between">
        <div className="flex items-center gap-2 font-bold italic">
          <Checkbox
            id="confirmation"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <Label
            htmlFor="confirmation"
            className={clsx('cursor-pointer')}
          >
            {text.button.checkbox}
          </Label>
        </div>
        <div
          className={clsx(
            'flex flex-col items-end gap-2 space-x-2 [&>*]:w-fit',
            {
              'flex-col-reverse': !checked,
              'flex-col': checked,
              '[&>*:last-child]:animate-pulse': !checked,
            }
          )}
        >
          <DialogClose asChild>
            <Button
              variant="default"
              form="confirm-update"
              type="submit"
              disabled={!checked}
              onClick={onSubmit}
            >
              {text.button.delete}
            </Button>
          </DialogClose>
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

UpdateConfirmationCredit.dispalyname = 'DeleteCreditById'

const text = {
  title: 'Actualizacion del prestamo',
  alert: {
    title: 'Se actualizara el prestamo de la base de datos',
    description: ({ username }: { username: string }) =>
      'Estas seguro de actualizar el prestamo del cliente ' + username + ' de la basde de datos?. Esta accion es irreversible y se actualizara los datos relacionados con el prestamo.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, actualiza el prestamo.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Actualizacion de un prestamo',
    decription: ({ username }: { username?: string }) =>
      'Se ha actualizado el prestamo del cliente ' + username + ' con exito.',
    error: 'Error: la actualizacion del prestamo ha fallado',
    undo: 'Deshacer',
  },
}
