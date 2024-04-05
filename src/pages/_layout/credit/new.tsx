import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { DialogDescription } from '@radix-ui/react-dialog'
import { createFileRoute } from '@tanstack/react-router'
import React, { ComponentRef, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { ToastAction } from '@radix-ui/react-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getClientsList, type TCLIENT_GET } from "@/api/clients";
import styles from "@/styles/global.module.css"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'
import { postCredit, type TCREDIT_POST_BODY } from '@/api/credit'
import { useNotifications } from '@/lib/context/notification'
import { useStatus } from '@/lib/context/layout'
import { type TMORA_TYPE, getMoraTypeByName } from '@/lib/type/moraType'
import { getFrecuencyByName, listFrecuencys } from '@/lib/type/frecuency'
import { useMutation } from '@tanstack/react-query'
import { Navigate } from '@tanstack/react-router'
import { getStatusByName } from '@/lib/type/status'
import { formatISO } from 'date-fns'
import { getUsersList } from '@/api/users'

type TSearch = {
  clientId: number
}

export const Route = createFileRoute('/_layout/credit/new')({
  component: NewCredit,
  validateSearch: ( search: TSearch ) => {
    if(!search) return ({} as TSearch)
    return search
  },
  loader: async () => ({
    clients: await getClientsList(),
    users: await getUsersList()
  }),
})

/* eslint-disable-next-line */
interface TNewCreditProps {
  clients?: TCLIENT_GET[]
}

/* eslint-disable-next-line */
interface TCuotesState {
  value?: number
  type: TMORA_TYPE
}

/* eslint-disable-next-line */


const initialCuotes: TCuotesState = {
  type: "Porciento" 
}

/* eslint-disable-next-line */
type TFormName = keyof (Omit<TCREDIT_POST_BODY, "cobrador_id" | "owner_id" | "garante_id" | "tipo_de_mora_id"> & Record<"user" | "client" | "ref" | "tipo_de_mora", string>)

/* eslint-disable-next-line */
export function NewCredit( { clients: _clients = [] as TCLIENT_GET[] }: TNewCreditProps ) {
  const form = useRef<HTMLFormElement>(null)
  const { users: usersDB, clients: clientsDB } = Route.useLoaderData() ?? _clients
  const [ installmants, setInstallmants ] = useState< TCuotesState>(initialCuotes)
  const [ { coute, interest, amount }, setCuote ] = useState<{ coute?: number, interest?: number, amount?: number }>({ })
  const { pushNotification } = useNotifications()
  const { open, setOpen } = useStatus()
  const { clientId } = Route.useSearch()
  const { client, user, ref } = useMemo( () => {
    const client = clientsDB?.find( ({ id }) => ( id === clientId ) )
    const ref = clientsDB?.find( ({ id: refId }) => ( refId === client?.referencia_id ) )
    const user = usersDB?.find( ({ id: userId }) => ( userId === client?.owner_id )  )
    return ( { client , ref, user } )
  }, [clientId] )

  const { mutate: createCredit } = useMutation({
    mutationKey: ["create-crdit"],
    mutationFn: postCredit,
  })

  const onChangeType: React.ChangeEventHandler< HTMLInputElement >  = ( ev ) => {
    const { checked, value } = ev.target as { checked: boolean, value: TMORA_TYPE }
    if(checked && value){
      setInstallmants( { ...installmants, type: value } )
    }
  }

  const onChangeValue: ( prop: "coute" | "interest" | "amount" ) => React.ChangeEventHandler< ComponentRef< typeof Input > > = (prop) => (ev) => {
    const { value } = ev.target
    if(+value === 0 && prop === "coute") return;
    setCuote( { ...{ interest, coute, amount }, [prop]: Number.parseInt(value) } ) 
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return;

    const items = Object.fromEntries(
      [...new FormData(form.current).entries()]?.map( ([ key, value ]) => {
      if( value === "" ) return [ key, undefined ]
      return [ key, value ]
    })
    ) as Record<TFormName, string>

    const description = text.notification.decription({
      username: items?.client,
    })
     
    const action =
      (items : Record<TFormName, string>) =>
      () => {
        const userId = usersDB?.find( ({ nombre }) => ( nombre == items?.user ) )?.id
        const clientId = clientsDB?.find( ({ nombres, apellidos }) => ( [nombres, apellidos].join(" ") === items?.client ) )?.id
        const refId = clientsDB?.find( ({ nombres, apellidos }) => ( [nombres, apellidos].join(" ") === items?.client ) )?.id

        if( !userId || !clientId ) return;

        createCredit({
          monto: +items?.monto,
          estado: getStatusByName({ statusName: "Activo" })?.id,
          comentario: items?.comentario ?? "",
          cobrador_id: userId,
          valor_de_mora: +items?.valor_de_mora,
          tasa_de_interes: +items?.tasa_de_interes,
          tipo_de_mora_id: getMoraTypeByName( { moraTypeName: items?.tipo_de_mora as TMORA_TYPE })?.id,
          dias_adicionales: +(items?.dias_adicionales ?? 0),
          numero_de_cuotas: +items?.numero_de_cuotas,
          frecuencia_del_credito_id: +items?.frecuencia_del_credito_id,
          owner_id: clientId,
          garante_id: refId ?? null,
          fecha_de_aprobacion: formatISO( new Date( items?.fecha_de_aprobacion ) ),
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
    { !open && <Navigate to={"../"} /> }
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
            name={'client' as TFormName}
            type="text"
            placeholder={text.form.cliente.placeholder}
            list='credit-clients'
            defaultValue={ client ? client?.nombres + " " + client?.apellidos : undefined }
          />
          <datalist id='credit-clients' >
            {clientsDB?.map( ( { nombres, apellidos }, index ) => <option key={index} value={nombres + " " + apellidos} />  )}
          </datalist>
        </Label>
        <Label>
          <span>{text.form.date.label} </span>
          <DatePicker
            name={"fecha_de_aprobacion" as TFormName}
            label={text.form.date.placeholder}
            className='border border-primary' 
          />
        </Label>
        <Label>
          <span>{text.form.ref.label} </span>
          <Input
            name={'ref' as TFormName}
            list='credit-clients'
            type="text"
            placeholder={text.form.ref.placeholder}
            defaultValue={ ref ? ref?.nombres + ref?.apellidos : undefined }
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
            name={'monto' as TFormName}
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
            name={'tasa_de_interes' as TFormName}
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
            name={'numero_de_cuotas' as TFormName}
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
            name={'frecuencia_del_credito_id' as TFormName}
            defaultValue={""+getFrecuencyByName({ frecuencyName: "Mensual" })?.id}
          >
            <SelectTrigger className="w-full ring-1 ring-ring">
              <SelectValue placeholder={text.form.frecuency.placeholder} />
            </SelectTrigger>
            <SelectContent className='[&_*]:cursor-pointer'>
              { listFrecuencys()?.map( ( { id, nombre }, index ) => <SelectItem key={index} value={""+id}>{nombre}</SelectItem> ) }
            </SelectContent>
          </Select>
        </Label>
        <Label className='row-start-3'>
          <span>{text.form.user.label} </span>
          <Input
            required
            name={'user' as TFormName}
            type="text"
            placeholder={text.form.user.placeholder}
            list='credit-user'
            defaultValue={ user ? user?.nombre : undefined }
          />
          <datalist id='credit-user'>
            {usersDB?.map( ( { nombre, id } ) => <option key={id} value={nombre} />  )}
          </datalist>
        </Label>
        <Label htmlFor='credit-installments' className='row-start-4'>
          <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
          <span className='after:content-["_*_"] after:text-red-500'>{text.form.installments.label} </span>
          <RadioGroup name={'tipo_de_mora' as TFormName} defaultValue={ getMoraTypeByName({ moraTypeName: "Porciento" })?.nombre } onChange={onChangeType}  >
            <Label><RadioGroupItem value={ getMoraTypeByName({ moraTypeName: "Valor fijo" })?.nombre } /> <Badge>$</Badge> </Label>
            <Label><RadioGroupItem value={ getMoraTypeByName({ moraTypeName: "Porciento" })?.nombre } /> <Badge>%</Badge> </Label>
          </RadioGroup>
          </div>
          <Input
            id='credit-installments'
            required
            min={0}
            max={installmants?.type === "Porciento" ? 100 : undefined}
            step={installmants?.type === "Porciento" ? 1 : 50}
            name={'valor_de_mora' as TFormName }
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
            name={'dias_adicionales' as TFormName}
            type="number"
            placeholder={text.form.aditionalDays.placeholder}
          />
        </Label>
        <Label>
          <span>{text.form.comment.label}</span>
          <Textarea
            rows={5}
            name={'comentario' as TFormName}
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
    </>
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
        ["Valor fijo" as TMORA_TYPE]: "Monto adicional en cada cuota",
        ["Porciento" as TMORA_TYPE]: "Porcentaje adicional en cada cuota",
      },
    },
    cuote: {
      label: 'Cuotas:',
      placeholder: "Cantidad de cuotas",
    }
  },
}
