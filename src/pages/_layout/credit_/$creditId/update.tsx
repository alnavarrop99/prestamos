import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { type TCredit, getCreditIdRes } from '@/api/credit'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import clients from "@/__mock__/CLIENTS.json";
import users from '@/__mock__/USERS.json'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import clsx from 'clsx'

export const Route = createFileRoute('/_layout/credit/$creditId/update')({
  component: UpdateCreditById,
  loader: getCreditIdRes
})

/* eslint-disable-next-line */
interface TUpdateCreditProps {
  credit?: TCredit,
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

/* eslint-disable-next-line */
export function UpdateCreditById( { children, open: _open = true, credit: _credit = {} as TCredit }: React.PropsWithChildren<TUpdateCreditProps> ) {
  const credit = Route.useLoaderData() ?? _credit
  const [ open, setOpen ] = useState<boolean>(_open)
  const [ installmants, setInstallmants ] = useState< TCuotesState>(initialCuotes)

  const onOpenChange = (checked: boolean) => {
    setOpen( checked ) 
  }

  const onChangeType: React.ChangeEventHandler< HTMLInputElement >  = ( ev ) => {
    const { checked, value } = ev.target as { checked: boolean, value: "porcentage" | "value" }
    if(checked && value){
      setInstallmants( { ...installmants, type: value } )
    }
  }

  return (
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <h1 className='text-3xl font-bold'>{ text.title }</h1>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className='ms-auto' asChild>
              <Link to={'./update'}>
                <Button type='submit' form='edit-client-form' > {text.button.update}  </Button>
              </Link>
            </DialogTrigger>

              <Link to={'./'}>
                <Button variant="outline"> {text.button.close} </Button>
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
              <Switch checked={credit.estado}>{ credit.estado }</Switch>
             </div>
            <Separator />
          </CardHeader>
          <CardContent className='grid grid-cols-3 gap-4 [&>label:last-child]:col-span-full [&>label_span]:font-bold [&>label]:space-y-2'>
              <Label className='!col-span-1'>
                <span>{text.form.details.clients.label}</span>
                <Input
                  required
                  name={'' as keyof TCredit}
                  type="text"
                  placeholder={text.form.details.clients.placeholder}
                  list='credit-clients'
                  value={clients[0].nombres + " " + clients?.[0].apellidos}
                />
                <datalist id='credit-clients' >
                  {clients?.map( ( { nombres, apellidos, id } ) => <option key={id} value={[nombres, apellidos].join(" ")} />  )}
                </datalist>
              </Label>
             <Label>
               <span>{text.form.details.date.label}</span>: 
               <DatePicker date={new Date(credit.fecha_de_aprobacion)} label={text.form.details.date.placeholder} />
             </Label>
              <Label className='!col-span-1'>
                <span>{text.form.details.ref.label}</span>
                <Input
                  required
                  name={'' as keyof TCredit}
                  type="text"
                  value={clients[0].referencia}
                  placeholder={text.form.details.ref.placeholder}
                />
            </Label>
            <Label>
            <div className='flex gap-2 items-center justify-between'>
              <span>{text.form.details.amount.label}</span>
              <Badge>$</Badge>
            </div>
            <Input
              min={0}
              step={50}
              name={'' as keyof TCredit}
              type="number"
              value={credit.cantidad}
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
              name={'' as keyof TCredit}
              value={credit.porcentaje}
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
              name={'' as keyof TCredit}
              value={credit.numero_de_cuotas}
              type="number"
              placeholder={text.form.details.cuotes.label}
            />
          </Label>

          <Label>
            <span>{text.form.details.frecuency.label}</span>
            <Select required name={'' as keyof TCredit} value={credit?.frecuencia_del_credito.nombre}>
              <SelectTrigger className="w-full border border-primary">
                <SelectValue placeholder={text.form.details.frecuency.placeholder} />
              </SelectTrigger>
              <SelectContent className='[&_*]:cursor-pointer'>
                { text.form.details.frecuency.items.map( ( item ) => <SelectItem value={item}>{item}</SelectItem> ) }
              </SelectContent>
            </Select>
        </Label>

          <Label>
            <span>{text.form.details.users.label}</span>
            <Input
              required
              name={'' as keyof TCredit}
              type="text"
              placeholder={text.form.details.users.placeholder}
              list='credit-user'
            />
            <datalist id='credit-user' >
              {users?.map( ( { nombre, id } ) => <option key={id} value={nombre} />  )}
            </datalist>
          </Label>
            
          <Label htmlFor='credit-installments' className='row-start-4'>
            <div className='flex gap-2 items-center justify-between [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&_label]:flex [&_label]:gap-2 [&_label]:items-center [&_label]:cursor-pointer'>
              <span>{ text.form.details.installmants.label }</span>
              <RadioGroup name='coute-type' defaultValue={'porcentage'} onChange={onChangeType} >
                <Label><RadioGroupItem value={'value'} /> <Badge>$</Badge> </Label>
                <Label><RadioGroupItem value={'porcentage'} /> <Badge>%</Badge> </Label>
              </RadioGroup>
            </div>
            <Input
              id='credit-installments'
              required
              min={0}
              max={installmants?.type === "porcentage" ? 100 : 25}
              step={1}
              name={'' as keyof TCredit}
              type="number"
              value={credit?.cuotas?.at(0)?.valor_de_mora}
              placeholder={text.form.details.installmants.label}
            />
        </Label>

             <Label className='row-start-4' ><span>{text.form.details.aditionalsDays.label}</span>: <Input value={credit.dias_adicionales} placeholder={text.form.details.aditionalsDays.placeholder} /></Label>
             <Label ><span>{text.form.details.comment.label}</span>: <Textarea rows={5} placeholder={text.form.details.comment.placeholder} >{ credit.comentario }</Textarea></Label>
          </CardContent>
        </Card>
       
        { credit?.pagos && <Card className='shadow-lg hover:shadow-xl transition delay-150 duration-400'> 
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              {text.form.pay.title}
            </CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <Accordion type='single' collapsible>
              {credit?.pagos.map(( cuote ) =>
                <AccordionItem value={cuote?.id?.toString() ?? ""} >
                  <AccordionTrigger className={clsx("gap-2 !no-underline [&>span]:italic before:not-italic before:font-bold before:content-['_+_'] [&[data-state='open']]:before:content-['_-_'] "
                  )} > <span>{cuote?.fecha_de_pago}</span> <Badge className='ms-auto'>{cuote?.id}</Badge> </AccordionTrigger>
                  <AccordionContent className='px-4 grid grid-cols-2 gap-4 [&>label]:font-bold [&>label]:space-y-2 [&>label:last-child]:col-span-full items-end [&>label>div]:flex [&>label>div]:gap-2 [&>label>div]:items-center [&>label>div]:justify-between'>
                    <Label> <span>{text.form.pay.payDate.label}</span> <DatePicker date={new Date(cuote?.fecha_de_pago ?? new Date())} label={text.form.details.date.placeholder} /> </Label>
                    <Label>
                      <div>
                        <span>{text.form.pay.payValue.label}</span>
                        <Badge>$</Badge>
                      </div>
                      <Input value={cuote?.valor_del_pago} placeholder={text.form.pay.payValue.placeholder} /> </Label>
                    <Label> <span>{text.form.pay.comment.label}</span> <Textarea rows={3} placeholder={text.form.pay.comment.placeholder}>{ credit.comentario }</Textarea> </Label>
                  </AccordionContent>
                </AccordionItem>
              )}
              </Accordion>
          </CardContent>
        </Card>}
      </div>
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
        label: "Monto total",
        placeholder: 'Escriba el nombre del usuario',
      },
      porcentage:{
        label: "Porcentaje actual",
        placeholder: 'Escriba el nombre del usuario',
      },
      date: {
        label: 'Fecha de aprobacion',
        placeholder: 'Seleccione la fecha',
      },
      comment:{
        label: "Comentario",
        placeholder: 'Seleccione la fecha',
      },
      interest:{
        label: "Numero de cuotas",
        placeholder: 'Seleccione la fecha',
      },
      aditionalsDays:{
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      clients:{
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      ref:{
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      cuotes:{
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      users:{
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      installmants:{
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      frecuency: {
        label: 'Frecuencia',
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
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      installmantsDate: {
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      payValue: {
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      payCuote: {
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      payInstallmants: {
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
      comment: {
        label: "Dias adicionales",
        placeholder: 'Seleccione la fecha',
      },
    },
  },
}
