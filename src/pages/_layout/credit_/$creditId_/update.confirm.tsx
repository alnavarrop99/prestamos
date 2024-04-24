import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import clsx from 'clsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle  } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useStatus } from '@/lib/context/layout'
import { patchCreditsById, type TCREDIT_GET, type TCREDIT_PATCH_BODY, type TCREDIT_GET_FILTER_ALL, type TCREDIT_PATCH } from '@/api/credit'
import { useNotifications } from '@/lib/context/notification'
import { _client, _credit, _creditChange, _payDelete } from '@/pages/_layout/credit_/$creditId_/update'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type TPAYMENT_GET_BASE, deletePaymentById, patchPaymentById, type TPAYMENT_PATCH_BODY } from "@/api/payment";
import { format } from 'date-fns'
import { getCreditsListOpt } from '../../credit'
import { getCreditByIdOpt } from '../$creditId'

export const updateCreditByIdOpt = {
    mutationKey: ["update-credit"],
    mutationFn: patchCreditsById,
}

export const updatePaymentByIdOpt = {
    mutationKey: ["update-payment"],
    mutationFn: patchPaymentById,
}

export const deletePaymentByIdOpt = {
    mutationKey: ["delete-payment"],
    mutationFn: deletePaymentById,
}

export const Route = createFileRoute('/_layout/credit/$creditId/update/confirm')({
  component: UpdateConfirmationCredit,
})

/* eslint-disable-next-line */
export function UpdateConfirmationCredit() {
  const [checked, setChecked] = useState(false)
  const credit = useContext(_credit)
  const creditChange = useContext(_creditChange)
  const deletePayment = useContext(_payDelete)
  const { open, setOpen } = useStatus()
  const { pushNotification } = useNotifications()
  const client = useContext(_client) 
  const { creditId } = Route.useParams()
  const qClient = useQueryClient()

  const onSuccessUpdateCredit: ((data: TCREDIT_PATCH, variables: { creditId: number; updateCredit?: TCREDIT_PATCH_BODY | undefined; }, context: unknown) => unknown) = ( newData ) => {
    const description = text.notification.credit.decription({
      username: client?.nombres + " " + client?.apellidos,
    })

    toast({
      title: text.notification.credit.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: "PATH",
      description,
    })

    const updateList: (data: TCREDIT_GET_FILTER_ALL) => TCREDIT_GET_FILTER_ALL = (data) => {
      const res = data
      return res?.map(({ id }, index, list) => {
        if (id === +creditId)
          return {
            ...list?.[index],
            ...newData,
          }
        return list?.[index]
      })
    }

    const updateCredit: (data: TCREDIT_PATCH) => TCREDIT_PATCH = (data) => {
      return { ...newData, ...data }
    }

    qClient?.setQueryData(getCreditsListOpt?.queryKey, updateList)
    qClient?.setQueryData(
      getCreditByIdOpt({ creditId })?.queryKey,
      updateCredit
    )
  }

  const onErrorUpdateCredit: ((error: Error, variables: { creditId: number; updateCredit?: TCREDIT_PATCH_BODY | undefined; }, context: unknown) => unknown) = (error) => {
    const errorMsg: {type: number, msg: string} = JSON.parse( error.message )

    toast({
      title: error.name + ": " + errorMsg?.type,
      description: (<div className='text-sm'>
        <p>{ errorMsg?.msg as unknown as string }</p>
      </div>),
      variant: 'destructive',
    })
  }
  const { mutate: updateCredit } = useMutation({
    ...updateCreditByIdOpt,
    onSuccess: onSuccessUpdateCredit,
    onError: onErrorUpdateCredit
  })

  const onSuccessUpdatePayment: ((data: TPAYMENT_GET_BASE, variables: { paymentId: number; updatePayment?: TPAYMENT_PATCH_BODY | undefined }, context: unknown) => unknown) = () => {
    const description = text.notification.payment.decription({
      username: client?.nombres + " " + client?.apellidos,
    })

    toast({
      title: text.notification.payment.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: "PATH",
      description,
    })

    qClient?.refetchQueries({ queryKey: getCreditsListOpt?.queryKey })

    qClient?.refetchQueries({
      queryKey: getCreditByIdOpt({ creditId: '' + creditId })?.queryKey,
    })
  }
  const onErrorUpdatePayment: ((error: Error, variables: { paymentId: number; updatePayment?: TPAYMENT_PATCH_BODY | undefined; }, context: unknown) => unknown) = (error) => {
    const errorMsg: {type: number, msg: string} = JSON.parse( error.message )

    toast({
      title: error.name + ": " + errorMsg?.type,
      description: (<div className='text-sm'>
        <p>{ errorMsg?.msg as unknown as string }</p>
      </div>
      ),
      variant: 'destructive',
    })
  }
  const { mutate: updatePayment } = useMutation({
    ...updatePaymentByIdOpt,
    onSuccess: onSuccessUpdatePayment,
    onError: onErrorUpdatePayment
  })

  const onSuccessRemovePayment: ((data: TPAYMENT_GET_BASE, variables: { paymentId: number; }, context: unknown) => unknown) = () => {
    const description = text.notification.deletePayment.decription({
      username: client?.nombres + " " + client?.apellidos,
    })

    toast({
      title: text.notification.deletePayment.titile,
      description,
      variant: 'default',
    })

    pushNotification({
      date: new Date(),
      action: "DELETE",
      description,
    })

    qClient?.refetchQueries({ queryKey: getCreditsListOpt?.queryKey })

    qClient?.refetchQueries({
      queryKey: getCreditByIdOpt({ creditId: '' + creditId })?.queryKey,
    })

  }
  const onErrorRemovePayment: ((error: Error, variables: { paymentId: number; }, context: unknown) => unknown) = (error) => {
    const errorMsg: {type: number, msg: string} = JSON.parse( error.message )

    toast({
      title: error.name + ": " + errorMsg?.type,
      description: (<div className='text-sm'>
        <p>{ errorMsg?.msg as unknown as string }</p>
      </div>),
      variant: 'destructive',
    })
  }
  const { mutate: removePaymentById } = useMutation({
    ...deletePaymentByIdOpt,
    onSuccess: onSuccessRemovePayment,
    onError: onErrorRemovePayment
  })

  const onCheckedChange: (checked: boolean) => void = () => {
    setChecked(!checked)
  }

  if ( !creditChange || !credit ) return;
  const onSubmit: React.FormEventHandler< React.ComponentRef< typeof Button > > = (ev) => {
    

    const creditItems = Object.fromEntries( 
      Object.entries( creditChange )?.map( ( [key, value], i ) => {
        if(key === "cuotas" as keyof TCREDIT_GET || key === "pagos" as keyof TCREDIT_GET || key === "tipo_de_mora" as keyof TCREDIT_GET || key === "frecuencia_del_credito" as keyof TCREDIT_GET || ( value === Object.values( credit )?.[i] && key !== "id" as keyof TCREDIT_GET) ) return [key, undefined];
        return [key, value]
      } )?.filter( ([, value]) => !!value )
    ) as Record< keyof TCREDIT_GET, string> & { id: number }

    const paymentItems = creditChange?.pagos?.map( (_, i) => Object.fromEntries( Object.entries( creditChange?.pagos?.[i] )?.map( ( [key, value], k ) => {
        if( key !== "id" as keyof TPAYMENT_GET_BASE && value === Object.values( credit?.pagos?.[i] )?.[k] ) return [key, undefined];
        return [key, value]
      } )?.filter( ([, value]) => !!value )
    ) as Record< keyof TPAYMENT_GET_BASE, string> & { id: number } )?.filter( ( { id, ...items } ) => ( Object.values( items ).some( ( item ) => ( !!item ) ) ) )

    const deleteItems = Object.values( deletePayment ?? {} )
    const stateItem = creditChange?.estado

    if(creditId && Object?.values( credit )?.length > 1) {
      updateCredit({
        creditId: +creditId,
        updateCredit: {
          valor_de_mora:  +creditItems?.valor_de_mora || undefined,
          cobrador_id: +creditItems?.cobrador_id || undefined,
          garante_id: +creditItems?.garante_id || undefined,
          comentario: creditItems?.comentario,
          estado: stateItem || undefined,
          monto: +creditItems?.monto || undefined,
          tasa_de_interes: +creditItems?.tasa_de_interes || undefined,
          tipo_de_mora_id: +creditItems?.tipo_de_mora_id || undefined,
          dias_adicionales: +creditItems?.dias_adicionales || undefined,
          numero_de_cuotas: +creditItems?.numero_de_cuotas || undefined,
          fecha_de_aprobacion: creditItems?.fecha_de_aprobacion ? format( creditItems?.fecha_de_aprobacion, "yyyy-MM-dd" ) : undefined,
          frecuencia_del_credito_id: +creditItems?.frecuencia_del_credito_id || undefined,
        }
      })
    }
    for ( const pay of paymentItems ){
      if( !pay?.id || ( pay?.id && deleteItems?.includes(pay?.id)) ) continue;;
      updatePayment({
        paymentId: pay?.id,
        updatePayment: {
          valor_del_pago: +pay?.valor_del_pago || undefined,
          comentario: pay?.comentario,
          fecha_de_pago: format( pay?.fecha_de_pago, "yyyy-MM-dd" )
        }
      })
    }
    for ( const pay of deleteItems ){
      if( !pay ) continue;
      removePaymentById({ paymentId: pay })
    }

    setOpen({open: !open})
    
    ev.preventDefault()
  }

  return (
    <>
    {!open && <Navigate to={"../../"} replace /> }
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-start text-xl md:text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription>
          <Alert variant="destructive" >
            <AlertCircle className="h-4 w-4 hidden md:block" />
            <AlertTitle className='text-sm md:text-base text-start max-sm:!px-0'>{text.alert.title}</AlertTitle>
            <AlertDescription className='text-xs md:text-base text-start max-sm:!px-0'>
              {text.alert.description({ 
                username: ""+credit?.owner_id 
              })}
            </AlertDescription>
          </Alert>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="!justify-between flex-col md:flex-row">
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
    payment: {
      titile: 'Actualizacion de un pago',
      decription: ({ username }: { username?: string }) =>
        'Se ha actualizado el pago del cliente ' + username + ' con exito.',
      error: ({ username }: { username: string }) =>
      'Ha fallado la actualizacion pago para el usuario ' + username + '.',
    },
    deletePayment: {
      titile: 'Elminacion de un pago',
      decription: ({ username }: { username?: string }) =>
        'Se ha eliminado el pago del cliente ' + username + ' con exito.',
      error: ({ username }: { username: string }) =>
        'Ha fallado la eliminacion del prestamo para el usuario ' + username + '.',
    },
    credit: {
      titile: 'Actualizacion de un prestamo',
      decription: ({ username }: { username?: string }) =>
        'Se ha actualizado el prestamo del cliente ' + username + ' con exito.',
      error: ({ username }: { username: string }) =>
        'Ha fallado la actualizacion del prestamo para el usuario ' + username + '.',
    },
    retry: 'Reintentar',
  },
}
