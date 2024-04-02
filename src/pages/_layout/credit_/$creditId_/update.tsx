import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog } from '@radix-ui/react-dialog'
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import {createContext, useMemo, useRef, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { getCreditById, type TCREDIT_PATCH_BODY, type TCREDIT_GET, type TCUOTE } from '@/api/credit'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import clsx from 'clsx'
import { useStatus } from '@/lib/context/layout'
import { Navigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { getMoraTypeById, getMoraTypeByName } from '@/lib/type/moraType'
import { getFrecuency } from '@/lib/type/frecuency'
import { TPAYMENT_GET_BASE } from '@/api/payment'

export const Route = createFileRoute('/_layout/credit/$creditId/update')({
  component: UpdateCreditById,
  loader: getCreditById
})

/* eslint-disable-next-line */
interface TUpdateCreditProps {
  credit?: TCREDIT_GET,
  open?: boolean
}

/* eslint-disable-next-line */
interface TCuotesState {
  value?: number
  type: "value" | "porcentage"
}

const initialCuotes: TCuotesState = {
  type: "porcentage" 
}

type TFormData = keyof TCREDIT_PATCH_BODY

export const _creditChangeContext = createContext<[TCREDIT_GET] | undefined>(undefined)

/* eslint-disable-next-line */
export function UpdateCreditById( { children, open: _open, credit: _credit = {} as TCREDIT_GET }: React.PropsWithChildren<TUpdateCreditProps> ) {
  const creditDB = Route.useLoaderData() ?? _credit
  const [ creditChange, setCreditChange ] = useState(creditDB)
  const [ installmants, setInstallmants ] = useState< TCuotesState>(initialCuotes)
  const { open = _open, setOpen } = useStatus() 
  const navigate = useNavigate()
  const form = (creditDB?.pagos ?? []).map( () => useRef<HTMLFormElement>(null)) 

  const active = useMemo(() =>
    Object.values(creditDB).flat().every( ( value, i ) => value === Object.values(creditChange).flat()?.[i]
  ), [ ...Object.values(creditChange)?.flat() ])

  const onOpenChange = (open: boolean) => {
    if(open){
      navigate({ to: Route.to }) 
    }
    setOpen( { open } ) 
  }

  const onChangeStatus = ( checked: boolean ) => {
    setCreditChange({ ...creditChange, estado: checked ? 1 : 0 })
  }

  const onChangeType: React.ChangeEventHandler< HTMLInputElement >  = ( ev ) => {
    const { checked, value } = ev.target as { checked: boolean, value: "porcentage" | "value" }
    if(checked && value){
      setInstallmants( { ...installmants, type: value } )
    }
  }

  const onChangeDetail: React.ChangeEventHandler<HTMLFormElement> = (ev) => {
    const { value, name }: {name?: string, value?: string} = ev.target
    if( !name || !value ) return;

    setCreditChange( { ...creditChange, [ name as TFormData ]: value } )
  }

  const onChangeCuoteById: ( index: number ) => React.ChangeEventHandler<HTMLFormElement> = (index) => (ev) => {
    const { value, name }: {name?: string, value?: string} = ev.target
    const { cuotas, pagos } = creditDB
    if(!creditDB || !value || !name || !pagos) return;

    const cuotes = cuotas?.map( ( item, i ) => {
      if( i !== index ) return item;
      return { ...item, [name]: value };
    })
    const payments = pagos?.map<TPAYMENT_GET_BASE>( ( payment, i ) => {
      return ({
        ...payment,
        fecha_de_pago: cuotes?.[i]?.fecha_de_pago?.toString(),
        valor_del_pago: cuotes?.[i]?.valor_pagado,
      })
    })

    setCreditChange({ ...creditChange, pagos: payments, cuotas: cuotes })
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    const formList = form?.filter( item => item.current )

    if( form.every( (item) => !item.current ) ) {
      setOpen({ open: !open })
      navigate({ to: "./confirm" })
    }

    for (const { current: form } of formList.reverse()) {
      form?.requestSubmit()
    }

    ev.preventDefault()
  }

  const onCuoteSubmit: ( cuoteId: number ) => React.FormEventHandler<HTMLFormElement> = ( cuoteId ) => (ev) => {
    const activeForms = form?.map( ( { current }, id ) => ({ id, current  }) )?.filter( ({ current }) => current )

    if( cuoteId === Math.max( ...activeForms.map( ({ id }) => id ) ) && activeForms?.every( ( { current } ) => current?.checkValidity() ) ) {
      setOpen({ open: !open })
      navigate({ to: "./confirm" })
    }
    ev.preventDefault()
  }

  return (
    <_creditChangeContext.Provider value={[creditChange]}>
      <Navigate to={Route.to} />
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <h1 className='text-3xl font-bold'>{ text.title }</h1>
          <Dialog open={open} onOpenChange={onOpenChange}>
              <Button 
                className='ms-auto'
                variant="default"
                form={'edit-credit'}
                disabled={active}
              >
                {text.button.update}
              </Button>
              <Link to={'../'}>
                <Button variant="outline" className='hover:ring hover:ring-primary'> {text.button.close} </Button>
              </Link>
            {children ?? <Outlet />}
          </Dialog>
        </div>
        <Separator />
        <Card className='shadow-lg hover:shadow-xl transition delay-150 duration-400'>
          <CardHeader>
            <div className='flex flex-row justify-between'>
              <CardTitle className='text-2xl font-bold'>
                {text.form.details.title}
              </CardTitle>
              <Switch checked={!!creditDB.estado} onCheckedChange={onChangeStatus} />
             </div>
          </CardHeader>
          <CardContent >
            <form className='grid grid-cols-3 gap-4 [&>label:last-child]:col-span-full [&>label>span]:font-bold [&>label>div>span]:font-bold [&>label]:space-y-2'
              id={'edit-credit'}
              onChange={onChangeDetail}
              onSubmit={onSubmit}
            >
              <Label>
                <span>{text.form.details.clients.label}</span>
                <Input
                  required
                  name={'owner_id' as TFormData}
                  type="text"
                  placeholder={text.form.details.clients.placeholder}
                  list='credit-clients'
                  defaultValue={creditDB?.owner_id}
                />
                <datalist id='credit-clients' >
                  {/*clients?.map( ( { nombres, apellidos, id } ) => <option key={id} value={[nombres, apellidos].join(" ")} />  )*/}
                </datalist>
              </Label>
             <Label>
               <span>{text.form.details.date.label}</span>
               <DatePicker 
                  required
                  name={'fecha_de_aprobacion' as TFormData}
                  date={new Date(creditDB.fecha_de_aprobacion)} 
                  label={text.form.details.date.placeholder} />
             </Label>
              <Label className='!col-span-1'>
                <span>{text.form.details.ref.label}</span>
                <Input
                  required
                  name={'garante_id' as TFormData}
                  type="text"
                  defaultValue={creditDB?.garante_id}
                  placeholder={text.form.details.ref.placeholder}
                />
            </Label>
            <Label>
            <div className='flex gap-2 items-center justify-between'>
              <span>{text.form.details.amount.label}</span>
              <Badge>$</Badge>
            </div>
            <Input
              required
              min={0}
              step={50}
              name={'monto' as TFormData}
              type="number"
              defaultValue={creditDB.monto}
              placeholder={text.form.details.amount.placeholder}
            />
          </Label>
          <Label>
             <div className='flex gap-2 items-center justify-between'>
              <span> {text.form.details.interest.label} </span>
              <Badge>%</Badge>
            </div>
            <Input
              required
              min={0}
              max={100}
              step={1}
              name={'tasa_de_interes' as TFormData}
              defaultValue={Math.round(creditDB.tasa_de_interes * 100)}
              type="number"
              placeholder={text.form.details.interest.placeholder}
            />
          </Label>
          <Label>
            <div className='flex gap-2 items-center justify-between'>
              <span> {text.form.details.cuotes.label} </span>
              <Badge>#</Badge>
            </div>
            <Input
              required
              min={0}
              max={25}
              step={1}
              name={'numero_de_cuotas' as TFormData}
              defaultValue={creditDB.numero_de_cuotas}
              type="number"
              placeholder={text.form.details.cuotes.label}
            />
          </Label>
          <Label>
            <span>{text.form.details.frecuency.label}</span>
            <Select
              required
              name={'frecuencia_del_credito_id' as TFormData}
              defaultValue={""+creditDB?.frecuencia_del_credito_id}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={text.form.details.frecuency.placeholder} />
              </SelectTrigger>
              <SelectContent className='[&_*]:cursor-pointer'>
              { getFrecuency()?.map( ( { id, nombre } ) => <SelectItem key={id} value={""+id}>{nombre}</SelectItem> ) }
              </SelectContent>
            </Select>
        </Label>
          <Label>
            <span>{text.form.details.users.label}</span>
            <Input
              required
              name={'cobrador_id' as TFormData}
              value={creditDB?.cobrador_id}
              type="text"
              placeholder={text.form.details.users.placeholder}
              list='credit-user'
            />
            <datalist id='credit-user' >
              {/*users?.map( ( { nombre, id } ) => <option key={id} value={nombre} />  )*/}
            </datalist>
          </Label>
          <Label htmlFor='credit-installments' className='row-start-4'>
            <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
              <span>{ text.form.details.installmants.label }</span>
              <RadioGroup name={'tipo_de_mora_id' as TFormData} defaultValue={ ""+getMoraTypeById({ moraTypeId: creditDB?.tipo_de_mora_id })?.id } onChange={onChangeType} >
                <Label><RadioGroupItem value={''+getMoraTypeByName({ moraTypeName: "valor" })?.id} /> <Badge>$</Badge> </Label>
                <Label><RadioGroupItem value={''+getMoraTypeByName({ moraTypeName: "porcentaje" })?.id} /> <Badge>%</Badge> </Label>
              </RadioGroup>
            </div>
            <Input
              id='credit-installments'
              required
              min={0}
              max={installmants?.type === "porcentage" ? 100 : undefined}
              step={installmants?.type === "porcentage" ? 1 : 50}
              name={'tipo_de_mora_id' as TFormData}
              type="number"
              defaultValue={creditDB?.valor_de_mora}
              placeholder={text.form.details.installmants.label}
            />
        </Label>
         <Label className='row-start-4' ><span>{text.form.details.aditionalsDays.label}</span>
            <Input 
              min={0}
              max={25}
              type='number'
              name={'dias_adicionales' as TFormData} 
              defaultValue={creditDB.dias_adicionales} 
              placeholder={text.form.details.aditionalsDays.placeholder} 
            />
          </Label>
         <Label ><span>{text.form.details.comment.label}</span>
            <Textarea 
              name={'comentario' as TFormData} 
              rows={5} 
              placeholder={text.form.details.comment.placeholder} 
            >
              { creditDB.comentario }
          </Textarea>
          </Label>
            </form>
          </CardContent>
        </Card>
        { creditDB?.pagos?.length && creditDB?.cuotas?.length && <Card className='shadow-lg hover:shadow-xl transition delay-150 duration-400'> 
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              {text.form.pay.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type='multiple'>
              {creditDB?.cuotas.slice(0, creditDB?.pagos?.length+1)?.map(( cuote, i ) =>
                <AccordionItem
                  key={cuote?.id}
                  value={"" + cuote?.id}
                >
                  <AccordionTrigger
                    className={clsx("gap-2 !no-underline [&>span]:italic before:not-italic before:font-bold before:content-['_+_'] [&[data-state='open']]:before:content-['_-_'] "
                  )} >
                    <span>{format(cuote?.fecha_de_pago, "dd-MM-yyyy")}</span>
                    <Badge className='ms-auto'>{cuote?.id}</Badge>
                  </AccordionTrigger>
                  <AccordionContent asChild >
                    <form
                      className='px-4 grid grid-cols-2 gap-4 items-end [&>label_span]:font-bold [&>label]:space-y-2 [&>label:last-child]:col-span-full [&>label>div]:flex [&>label>div]:gap-2 [&>label>div]:items-center [&>label>div]:justify-between'
                      id={ 'edit-pay-' + cuote?.id }
                      onChange={onChangeCuoteById( cuote?.id )}
                      onSubmit={onCuoteSubmit(cuote?.id )}
                      ref={form?.[i]}
                    >
                    <Label>
                      <span>{text.form.pay.payDate.label}</span>
                      <DatePicker
                        name={"fecha_de_pago" as keyof TCUOTE}
                        date={new Date(cuote?.fecha_de_pago)}
                        label={text.form.pay.payDate.placeholder} 
                      />
                    </Label>
                    <Label>
                      <div>
                        <span>{text.form.pay.payValue.label}</span>
                        <Badge>$</Badge>
                      </div>
                      <Input 
                        type='number'
                        min={0}
                        step={50}
                        name={"valor_pagado" as keyof TCUOTE} 
                        defaultValue={cuote?.valor_pagado} 
                        placeholder={text.form.pay.payValue.placeholder} 
                        />
                    </Label>
                    <Label>
                      <div>
                        <span>{text.form.pay.installmantsDate.label}</span>
                      </div>
                      <DatePicker
                        name={"fecha_de_aplicacion_de_mora" as keyof TCUOTE}
                        date={new Date(cuote?.fecha_de_pago)}
                        label={text.form.pay.installmantsDate.placeholder} 
                      />
                    </Label>
                    <Label> <span>{text.form.pay.comment.label}</span>
                      <Textarea
                        name={"comentario" as keyof TCUOTE}
                        rows={3}
                        placeholder={text.form.pay.comment.placeholder}>
                        { creditDB.comentario }
                      </Textarea> 
                    </Label>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              )}
              </Accordion>
          </CardContent>
        </Card>}
      </div>
    </_creditChangeContext.Provider>
  )
}

UpdateCreditById.dispalyname = 'UpdateCreditById'

const text = {
  title: 'Editar prestamos:',
  button: {
    update: "Actualizar",
    close: "Cancelar",
  },
  notification: {
    titile: 'Actualizacion de un prestamo',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizado el prestamo para el usuario ' + username + ' con exito.',
    error: 'Error: la actualizacion del prestamo ha fallado',
    undo: 'Deshacer',
  },
  form: {
    details: {
      title: "Estado del prestamo:",
      amount:{
        label: "Monto total:",
        placeholder: 'Escriba el nombre del usuario',
      },
      date: {
        label: 'Fecha de aprobacion:',
        placeholder: 'Seleccione la fecha',
      },
      comment:{
        label: "Comentario:",
        placeholder: 'Escriba un comentario',
      },
      interest:{
        label: "Tasa de interes:",
        placeholder: 'Escriba la tasa de interes',
      },
      aditionalsDays:{
        label: "Dias adicionales:",
        placeholder: 'Cantidad de dias adicionales',
      },
      clients:{
        label: "Cliente:",
        placeholder: 'Escribe | Seleccione el cliente',
      },
      ref:{
        label: "Garante:",
        placeholder: 'Escribe el garante',
      },
      cuotes:{
        label: "Numeros de cuotas:",
        placeholder: 'Escribe la cantidad de cuotas',
      },
      users:{
        label: "Cobrador:",
        placeholder: 'Escribe | Seleccione el cobrador',
      },
      installmants:{
        label: "Monto de mora:",
        placeholder: 'Valor de la mora',
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
      }
    },
    pay: {
      title: "Listado de pagos:",
      payDate: {
        label: "Fecha de pago:",
        placeholder: 'Seleccione la fecha',
      },
      installmantsDate: {
        label: "Fecha de aplicacion de mora:",
        placeholder: 'Seleccione la fecha',
      },
      payValue: {
        label: "Monto de pago:",
        placeholder: 'Valor del pago',
      },
      comment: {
        label: "Comentario:",
        placeholder: 'Escribe un comentario',
      },
    },
  },
}
