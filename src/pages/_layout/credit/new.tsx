import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import React, { ComponentRef, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getClientsRes, type TClient } from "@/api/clients";
import styles from "@/styles/global.module.css"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'
import { TCredit } from '@/api/credit'
import users from '@/__mock__/USERS.json'
import { useNotifications } from '@/lib/context/notification'
import { useClientStatus } from '@/lib/context/client'

export const Route = createFileRoute('/_layout/credit/new')({
  component: NewCredit,
  loader: getClientsRes
})

/* eslint-disable-next-line */
interface TNewCreditProps {
  clients?: TClient[]
}

/* eslint-disable-next-line */
interface TCuotesState {
  value?: number
  type: "value" | "porcentage"
}

/* eslint-disable-next-line */
type TCuoteStateType = "value" | "porcentage"


const initialCuotes: TCuotesState = {
  type: "porcentage" 
}

/* eslint-disable-next-line */
export function NewCredit( { clients: _clients = [] as TClient[] }: TNewCreditProps ) {
  const form = useRef<HTMLFormElement>(null)
  const clients = Route.useLoaderData() ?? _clients
  const [ installmants, setInstallmants ] = useState< TCuotesState>(initialCuotes)
  const [ { coute, interest, amount }, setCuote ] = useState<{ coute?: number, interest?: number, amount?: number }>({ })
  const { setNotification } = useNotifications()
  const { open, setStatus } = useClientStatus()

  const onChangeType: React.ChangeEventHandler< HTMLInputElement >  = ( ev ) => {
    const { checked, value } = ev.target as { checked: boolean, value: TCuoteStateType }
    if(checked && value){
      setInstallmants( { ...installmants, type: value } )
    }
  }

  const onChangeValue: ( prop: "coute" | "interest" | "amount" ) => React.ChangeEventHandler< ComponentRef< typeof Input > > = (prop) => (ev) => {
    const { value } = ev.target
    if(Number.parseInt(value) === 0 && prop === "coute") return;
    setCuote( { ...{ interest, coute, amount }, [prop]: Number.parseInt(value) } ) 
  }

  const onSubmit: React.FormEventHandler = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      new FormData(form.current).entries()
    ) as Record<keyof TClient, string>

    const { nombres: firstName, apellidos: lastName } = items
    const description = text.notification.decription({
      username: firstName + ' ' + lastName,
    })

    const action =
      ({ ...props }: Record<keyof TClient, string>) =>
      () => {
        console.table(props)
        setNotification({
          notification: {
            date: new Date(),
            action: "POST",
            description,
          }
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setStatus({ open: !open })

    const onClick = () => {
      clearTimeout(timer)
    }

    if ( true) {
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
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle className="text-2xl">{text.title}</DialogTitle>
        <Separator />
        <DialogDescription className='text-muted-foreground'>{text.descriiption}</DialogDescription>
      </DialogHeader>
      <form
        autoComplete="off"
        ref={form}
        onSubmit={onSubmit}
        id="new-credit"
        className={clsx(
          'grid-rows-subgrid grid grid-cols-3 gap-4 items-end [&>label]:space-y-2',
          styles?.["custom-form"]
        )}
      >
        <Label className='!col-span-1'>
          <span>{text.form.cliente.label} </span>
          <Input
            required
            name={'client' as keyof TCredit}
            type="text"
            placeholder={text.form.cliente.placeholder}
            list='credit-clients'
          />
          <datalist id='credit-clients' >
            {clients?.map( ( { nombres, apellidos, id } ) => <option key={id} value={[nombres, apellidos].join(" ")} />  )}
          </datalist>
        </Label>
        <Label>
          <span>{text.form.date.label} </span>
          <DatePicker
            name={"fecha_de_aprobacion" as keyof TCredit}
            label={text.form.date.placeholder}
            className='border border-primary' 
          />
        </Label>
        <Label>
          <span>{text.form.ref.label} </span>
          <Input
            required
            name={'garante' as keyof TCredit}
            type="text"
            placeholder={text.form.ref.placeholder}
          />
        </Label>
        <Label className='row-start-2'>
          <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
            <span className='after:content-["_*_"] after:text-red-500'>{text.form.amount.label} </span>
            <Badge>$</Badge>
          </div>
          <Input
            required
            min={0}
            step={50}
            value={amount}
            onChange={onChangeValue("amount")}
            name={'cantidad' as keyof TCredit}
            type="number"
            placeholder={text.form.amount.placeholder}
          />
        </Label>
        <Label htmlFor='credit-cuote' className='row-start-2'>
           <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
            <span className='after:content-["_*_"] after:text-red-500'>{text.form.interest.label} </span>
            <Badge>%</Badge>
          </div>
          <Input
            id='credit-cuote'
            required
            min={0}
            max={100}
            step={1}
            name={'porcentaje' as keyof TCredit}
            value={interest}
            onChange={onChangeValue("interest")}
            type="number"
            placeholder={text.form.interest.placeholder}
          />
        </Label>
        <Label htmlFor='credit-pay' className='row-start-2'>
          <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
            <span className='after:content-["_*_"] after:text-red-500'>{text.form.cuote.label} </span>
            <Badge>#</Badge>
          </div>
          <Input
            id='credit-pay'
            required
            min={0}
            max={25}
            step={1}
            name={'numero_de_cuotas' as keyof TCredit}
            value={coute}
            onChange={onChangeValue("coute")}
            type="number"
            placeholder={text.form.cuote.placeholder}
          />
        </Label>
        <Label className='[&>span]:after:content-["_*_"] [&>span]:after:text-red-500 row-start-3'>
          <span>{text.form.frecuency.label} </span>
          <Select required name={'frecuencia_del_credito' as keyof TCredit} defaultValue={text.form.frecuency.items?.[0]}>
            <SelectTrigger className="w-full border border-primary">
              <SelectValue placeholder={text.form.frecuency.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              { text.form.frecuency.items.map( ( item ) => <SelectItem key={item} value={item}>{item}</SelectItem> ) }
            </SelectContent>
          </Select>
        </Label>
        <Label className='row-start-3'>
          <span>{text.form.user.label} </span>
          <Input
            required
            name={'user' as keyof TCredit}
            type="text"
            placeholder={text.form.user.placeholder}
            list='credit-user'
          />
          <datalist id='credit-user' >
            {users?.map( ( { nombre, id } ) => <option key={id} value={nombre} />  )}
          </datalist>
        </Label>
        <Label htmlFor='credit-installments' className='row-start-4'>
          <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
          <span className='after:content-["_*_"] after:text-red-500'>{text.form.installments.label} </span>
          <RadioGroup name='coute-type' defaultValue={'porcentage' as keyof typeof text.form.installments.placeholder} onChange={onChangeType}  >
            <Label><RadioGroupItem value={'value' as keyof typeof text.form.installments.placeholder} /> <Badge>$</Badge> </Label>
            <Label><RadioGroupItem value={'porcentage' as keyof typeof text.form.installments.placeholder} /> <Badge>%</Badge> </Label>
          </RadioGroup>
          </div>
          <Input
            id='credit-installments'
            required
            min={0}
            max={installmants?.type === "porcentage" ? 100 : undefined}
            step={installmants?.type === "porcentage" ? 1 : 50}
            name={installmants?.type === "porcentage" ? 'porcentaje' as keyof TCredit : 'valor_de_mora' as keyof TCredit}
            type="number"
            value={installmants.value}
            placeholder={text.form.installments.placeholder?.[installmants.type]}
          />
        </Label>
        <Label className='row-start-4'>
          <span>{text.form.aditionalDays.label} </span>
          <Input
            min={0}
            max={10}
            name={'dias_adicionales' as keyof TCredit}
            type="number"
            placeholder={text.form.aditionalDays.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.comment.label}</span>
          <Textarea
            rows={5}
            name={'comentario' as keyof TCredit}
            placeholder={text.form.comment.placeholder}
          />
        </Label>
      </form>
      <DialogFooter className="!justify-between !items-center">
        <ul className={clsx('[&_span]:font-bold [&>li]:list-disc [&>li]:list-inside transition delay-150 duration-500', { 
          "opacity-0": !interest || !coute || !amount || interest === 0 || coute === 0 || amount === 0,
          "opacity-1": interest && coute && amount
        })}>
          <li><span>Monto Total</span>: { "$" + getAmountTotal({ amount, interest, coute })}.</li>
          <li><span>Monto por cuota</span>: {"$" + getAmountCuote({ interest, amount, coute })}. </li>
        </ul>
        <div className='space-x-2'>
          <Button variant="default" form="new-credit" type="submit" className='self-end'>
            {text.button.update}
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
  )
}

NewCredit.dispalyname = 'NewClient'

const getAmountTotal = ( { interest, coute, amount }: { amount?: number, coute?: number, interest?: number }) => {
  if( !amount || !coute || !interest ) return 0;
  if( coute === 0 ) return 0;

  return  Math.ceil(((getAmountCuote({ coute, amount, interest })) * coute));
}

const getAmountCuote = ( { interest, amount, coute }: { amount?: number, interest?: number, coute?: number }) => {
  if(  !amount || !interest || !coute ) return 0;
  if(  coute === 0 ) return 0;

  return Math.ceil(((amount / coute) + (amount / coute  * interest/100)));
}

const text = {
  title: 'Crear prestamo:',
  descriiption:
    'Introdusca los datos correctamente para la creacion de un prestamo en la plataforma',
  button: {
    close: 'Cerrar',
    update: 'Crear',
  },
  notification: {
    titile: 'Creacion de un nuevos prestamo',
    decription: ({ username }: { username: string }) =>
      'Se ha creado el prestamo para el usuario ' + username + ' con exito.',
    error: 'Error: la creacion del prestamo ha fallado',
    undo: 'Deshacer',
  },
  form: {
    cliente: {
      label: 'Cliente:',
      placeholder: 'Nombre del cliente',
    },
    ref: {
      label: 'Garante:',
      placeholder: 'Nombre del garante del cliente',
    },
    user: {
      label: 'Cobrador:',
      placeholder: 'Nombre del cobrador',
    },
    comment: {
      label: 'Comentario:',
      placeholder: 'Escriba un commentario',
    },
    amount: {
      label: 'Monto:',
      placeholder: 'Monto total del prestamo',
    },
    frecuency: {
      label: 'Frecuencia:',
      placeholder: 'Seleccione una opcion',
      items: [
        "Anual",
        "Quincenal",
        "Mensual",
        "Semanal",
      ]
    },
    aditionalDays: {
      label: 'Dias Adicionales:',
      placeholder: 'Cantidad de dias',
    },
    date: {
      label: 'Fecha de aprobacion:',
      placeholder: 'Seleccione la fecha',
    },
    interest: {
      label: 'Tasa de Interes:',
      placeholder: "Porcentaje de interes por cuota",
    },
    installments: {
      label: 'Mora:',
      placeholder:{
        value: "Monto adicional en cada cuota",
        porcentage: "Porcentaje adicional en cada cuota",
      },
    },
    cuote: {
      label: 'Cuotas:',
      placeholder: "Cantidad de cuotas",
    }
  },
}
