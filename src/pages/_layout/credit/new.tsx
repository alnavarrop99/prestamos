import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { type  TCREDIT_GET, TCREDIT_GET_ALL, postCredit, TCREDIT_POST } from '@/api/credit'
import { useNotifications } from '@/lib/context/notification'
import { useStatus } from '@/lib/context/layout'
import { getMoraTypeById, getMoraTypeByName } from '@/api/moraType'
import { getFrecuency, getFrecuencyById, getFrecuencyByName } from '@/api/frecuency'
import { useContextCredit } from '@/pages/_layout/credit_/-hook'
import { useMutation } from '@tanstack/react-query'

type TSearch = {
  clientId: number
}

export const Route = createFileRoute('/_layout/credit/new')({
  component: NewCredit,
  loader: getClientsRes,
  validateSearch: ( search: TSearch ) => {
    if(!search) return ({} as TSearch)
    return search
  }
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
  // const clientsDB = Route.useLoaderData() ?? _clients
  const [ installmants, setInstallmants ] = useState< TCuotesState>(initialCuotes)
  const [ { coute, interest, amount }, setCuote ] = useState<{ coute?: number, interest?: number, amount?: number }>({ })
  const { setNotification } = useNotifications()
  const { open, setOpen } = useStatus()
  const navigate = useNavigate()
  const { clientId } = Route.useSearch()
  const { creditsAll = [] as TCREDIT_GET_ALL, setCreditsAll } = useContextCredit()

  const onSuccess: ( data: TCREDIT_POST ) => unknown = (newCredit) => {
    setCreditsAll( [ ...creditsAll?.slice(0, -1), { ...(creditsAll?.at(-1) ?? {} as TCREDIT_GET), ...newCredit   }  ] )
  }

  const { mutate: createCredit } = useMutation({
    mutationKey: ["create-crdit"],
    mutationFn: postCredit,
    onSuccess
  })

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
    ) as Record<keyof TCREDIT_GET, string>

    const { nombre_del_cliente } = items
    const description = text.notification.decription({
      username: nombre_del_cliente,
    })

    const action =
      ({ ...props }: Record<keyof TCREDIT_GET, string>) =>
      () => {
        createCredit({
          monto: +props?.monto,
          estado: 1,
          comentario: props?.comentario,
          cobrador_id: +props?.cobrador_id,
          valor_de_mora: +props?.valor_de_mora,
          tasa_de_interes: +props?.tasa_de_interes,
          tipo_de_mora_id: +props?.tipo_de_mora_id,
          dias_adicionales: +props?.dias_adicionales,
          numero_de_cuotas: +props?.numero_de_cuotas,
          fecha_de_aprobacion: new Date( +props.fecha_de_aprobacion ),
          frecuencia_del_credito_id: +props?.frecuencia_del_credito_id,
          owner_id: +props?.owner_id, 
        })
        setNotification({
          date: new Date(),
          action: "POST",
          description,
        })
      }

    const timer = setTimeout(action(items), 6 * 1000)
    setOpen({ open: !open })
    navigate({to: "../"})
    setCreditsAll( [ ...creditsAll, { 
      id: creditsAll?.length + 1,
      owner_id: +items?.owner_id,
      frecuencia_del_credito: {
        id: getFrecuencyById( { frecuencyId: +items?.frecuencia_del_credito_id } )?.id,
        tipo_enumerador_id: getFrecuencyById( { frecuencyId: +items?.frecuencia_del_credito_id } )?.id,
        nombre: getFrecuencyById( { frecuencyId: +items?.frecuencia_del_credito_id } )?.nombre
      },
      frecuencia_del_credito_id: getFrecuencyById( { frecuencyId: +items?.frecuencia_del_credito_id } )?.id,
      valor_de_cuota: +items?.valor_de_cuota,
      valor_de_mora: +items?.valor_de_mora,
      numero_de_cuotas: +items?.numero_de_cuotas,
      monto: +items?.monto,
      estado: 1,
      pagos: [],
      cuotas: [],
      comentario: items?.comentario,
      tipo_de_mora_id: getMoraTypeById({ moraTypeId: +items?.tipo_de_mora_id })?.id,
      tipo_de_mora: {
        id: getMoraTypeById({ moraTypeId: +items?.tipo_de_mora_id })?.id,
        nombre: getMoraTypeById({ moraTypeId: +items?.tipo_de_mora_id })?.nombre,
        tipo_enumerador_id: getMoraTypeById({ moraTypeId: +items?.tipo_de_mora_id })?.id,
      },
      fecha_de_cuota: new Date(),
      numero_de_cuota: +items?.numero_de_cuota,
      tasa_de_interes: +items?.tasa_de_interes,
      dias_adicionales: +items?.dias_adicionales,
      nombre_del_cliente: items?.nombre_del_cliente,
      fecha_de_aprobacion: new Date( items?.fecha_de_aprobacion ),
      // TODO: 
      cobrador_id: +items?.cobrador_id,
      garante_id: +items?.garante_id,
    }])

    const onClick = () => {
      clearTimeout(timer)
      setCreditsAll(creditsAll)
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
            name={'nombre_del_cliente' as keyof TCREDIT_GET}
            type="text"
            placeholder={text.form.cliente.placeholder}
            list='credit-clients'
            // defaultValue={getClientId({ clientId }).nombres + " " + getClientId({ clientId }).apellidos}
          />
          <datalist id='credit-clients' >
            {/*clients?.map( ( { nombres, apellidos, id } ) => <option key={id} value={[nombres, apellidos].join(" ")} />  )*/}
          </datalist>
        </Label>
        <Label>
          <span>{text.form.date.label} </span>
          <DatePicker
            name={"fecha_de_aprobacion" as keyof TCREDIT_GET}
            label={text.form.date.placeholder}
            className='border border-primary' 
          />
        </Label>
        <Label>
          <span>{text.form.ref.label} </span>
          <Input
            required
            name={'garante_id' as keyof TCREDIT_GET}
            type="text"
            placeholder={text.form.ref.placeholder}
            // defaultValue={ getClientId({ clientId })?.referencia }
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
            name={'monto' as keyof TCREDIT_GET}
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
            name={'tasa_de_interes' as keyof TCREDIT_GET}
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
            name={'numero_de_cuotas' as keyof TCREDIT_GET}
            value={coute}
            onChange={onChangeValue("coute")}
            type="number"
            placeholder={text.form.cuote.placeholder}
          />
        </Label>
        <Label className='[&>span]:after:content-["_*_"] [&>span]:after:text-red-500 row-start-3'>
          <span>{text.form.frecuency.label} </span>
          <Select 
            required
            name={'frecuencia_del_credito_id' as keyof TCREDIT_GET}
            defaultValue={""+getFrecuencyByName({ frecuencyName: "Mensual" })?.id}
          >
            <SelectTrigger className="w-full ring-1 ring-ring">
              <SelectValue placeholder={text.form.frecuency.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              { getFrecuency().map( ( { id, nombre } ) => <SelectItem key={id} value={""+id}>{nombre}</SelectItem> ) }
            </SelectContent>
          </Select>
        </Label>
        <Label className='row-start-3'>
          <span>{text.form.user.label} </span>
          <Input
            required
            name={'owner_id' as keyof TCREDIT_GET}
            type="text"
            placeholder={text.form.user.placeholder}
            list='credit-user'
            defaultValue={clientId}
          />
          <datalist id='credit-user' >
            {/*users?.map( ( { nombre, id } ) => <option key={id} value={nombre} />  )*/}
          </datalist>
        </Label>
        <Label htmlFor='credit-installments' className='row-start-4'>
          <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
          <span className='after:content-["_*_"] after:text-red-500'>{text.form.installments.label} </span>
          <RadioGroup name={'tipo_de_mora_id' as keyof TCREDIT_GET} defaultValue={ getMoraTypeByName({ moraTypeName: "porcentaje" })?.nombre } onChange={onChangeType}  >
            <Label><RadioGroupItem value={ getMoraTypeByName({ moraTypeName: "valor" })?.nombre } /> <Badge>$</Badge> </Label>
            <Label><RadioGroupItem value={ getMoraTypeByName({ moraTypeName: "porcentaje" })?.nombre } /> <Badge>%</Badge> </Label>
          </RadioGroup>
          </div>
          <Input
            id='credit-installments'
            required
            min={0}
            max={installmants?.type === "porcentage" ? 100 : undefined}
            step={installmants?.type === "porcentage" ? 1 : 50}
            name={'valor_de_mora' as keyof TCREDIT_GET }
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
            name={'dias_adicionales' as keyof TCREDIT_GET}
            type="number"
            placeholder={text.form.aditionalDays.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.comment.label}</span>
          <Textarea
            rows={5}
            name={'comentario' as keyof TCREDIT_GET}
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
