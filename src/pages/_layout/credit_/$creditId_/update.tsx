import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Link, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { createContext, useState } from 'react'
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
import { useClientStatus } from '@/lib/context/client'
import { type TPayment } from '@/api/payment'
import { Navigate } from '@tanstack/react-router'

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

export const _creditUpdate = createContext<TCredit | undefined>(undefined)

const initialCuotes: TCuotesState = {
  type: "porcentage" 
}

/* eslint-disable-next-line */
export function UpdateCreditById( { children, open: _open, credit: _credit = {} as TCredit }: React.PropsWithChildren<TUpdateCreditProps> ) {
  const creditDB = Route.useLoaderData() ?? _credit
  const [credit, setCredit] = useState(creditDB)
  const [ installmants, setInstallmants ] = useState< TCuotesState>(initialCuotes)
  const { open, setStatus } = useClientStatus( ({ open, setStatus }) => ({ open: open ?? _open, setStatus  }) ) 
  const navigate = useNavigate()

  const onOpenChange = (checked: boolean) => {
    if(open){
      navigate({ to: Route.to }) 
    }
    setStatus( { open: checked } ) 
  }

  const onChangeStatus = ( checked: boolean ) => {
    setCredit({ ...credit, estado: checked })
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

    setCredit( { ...credit, [ name as keyof TCredit ]: value } )
  }

  const onChangePaymentById: ( params :{ paymentId?: number } ) => React.ChangeEventHandler<HTMLFormElement> = ({ paymentId }) => (ev) => {
    const { value, name }: {name?: string, value?: string} = ev.target
    const { pagos } = credit

    const payments = pagos?.map( ( item ) => {
      if( item?.id === paymentId ) {
        return { ...item, [name]: value }
      }
      return item
    })

    if(!payments?.length || !value || !name) return;

    setCredit({ ...credit, pagos: payments })
  }

  return (
    <_creditUpdate.Provider value={credit}>
      <Navigate to={Route.to} />
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <h1 className='text-3xl font-bold'>{ text.title }</h1>
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className='ms-auto' asChild>
              <Link to={'./confirm'}>
                <Button variant="default"> {text.button.update}  </Button>
              </Link>
            </DialogTrigger>

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
              <Switch checked={credit.estado} onCheckedChange={onChangeStatus}>{ credit.estado }</Switch>
             </div>
          </CardHeader>
          <CardContent >
            <form className='grid grid-cols-3 gap-4 [&>label:last-child]:col-span-full [&>label>span]:font-bold [&>label>div>span]:font-bold [&>label]:space-y-2'
              id='edit-credit'
              onChange={onChangeDetail}
            >
              <Label>
                <span>{text.form.details.clients.label}</span>
                <Input
                  required
                  name={'cliente' as keyof TCredit}
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
               <span>{text.form.details.date.label}</span>
               <DatePicker 
                  required
                  name={'fecha_de_aprobacion' as keyof TCredit}
                  date={new Date(credit.fecha_de_aprobacion)} 
                  label={text.form.details.date.placeholder} />
             </Label>
              <Label className='!col-span-1'>
                <span>{text.form.details.ref.label}</span>
                <Input
                  required
                  name={'garante' as keyof TCredit}
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
              name={'cantidad' as keyof TCredit}
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
              name={'porcentaje' as keyof TCredit}
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
              name={'numero_de_cuotas' as keyof TCredit}
              value={credit.numero_de_cuotas}
              type="number"
              placeholder={text.form.details.cuotes.label}
            />
          </Label>
          <Label>
            <span>{text.form.details.frecuency.label}</span>
            <Select required name={'frecuencia_del_credito' as keyof TCredit} value={credit?.frecuencia_del_credito.nombre}>
              <SelectTrigger className="w-full border border-primary">
                <SelectValue placeholder={text.form.details.frecuency.placeholder} />
              </SelectTrigger>
              <SelectContent className='[&_*]:cursor-pointer'>
                { text.form.details.frecuency.items.map( ( item ) => <SelectItem key={item} value={item}>{item}</SelectItem> ) }
              </SelectContent>
            </Select>
        </Label>
          <Label>
            <span>{text.form.details.users.label}</span>
            <Input
              required
              name={'cobrador' as keyof TCredit}
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
              <RadioGroup defaultValue={'porcentage'} onChange={onChangeType} >
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
              name={installmants?.type === "porcentage" ? 'porcentaje' as keyof TCredit : 'valor_de_mora' as keyof TCredit}
              type="number"
              value={credit?.cuotas?.at(0)?.valor_de_mora}
              placeholder={text.form.details.installmants.label}
            />
        </Label>
         <Label className='row-start-4' ><span>{text.form.details.aditionalsDays.label}</span>
            <Input 
              type='number'
              name={'dias_adicionales' as keyof TCredit} 
              value={credit.dias_adicionales} 
              placeholder={text.form.details.aditionalsDays.placeholder} 
            />
          </Label>
         <Label ><span>{text.form.details.comment.label}</span>
            <Textarea 
              name={'comentario' as keyof TCredit} 
              rows={5} placeholder={text.form.details.comment.placeholder} >
                { credit.comentario }
          </Textarea>
          </Label>
            </form>
          </CardContent>
        </Card>
       
        { credit?.pagos && <Card className='shadow-lg hover:shadow-xl transition delay-150 duration-400'> 
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              {text.form.pay.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type='single' collapsible>
              {credit?.pagos.map(( cuote ) =>
                <AccordionItem key={cuote?.id} value={cuote?.id?.toString() ?? ""} >
                  <AccordionTrigger className={clsx("gap-2 !no-underline [&>span]:italic before:not-italic before:font-bold before:content-['_+_'] [&[data-state='open']]:before:content-['_-_'] "
                  )} > <span>{cuote?.fecha_de_pago}</span> <Badge className='ms-auto'>{cuote?.id}</Badge> </AccordionTrigger>
                  <AccordionContent >
                    <form className='px-4 grid grid-cols-2 gap-4 items-end [&>label_span]:font-bold [&>label]:space-y-2 [&>label:last-child]:col-span-full [&>label>div]:flex [&>label>div]:gap-2 [&>label>div]:items-center [&>label>div]:justify-between' id='update-credit-payments' onChange={onChangePaymentById({ paymentId: cuote?.id })}>
                    <Label> <span>{text.form.pay.payDate.label}</span>
                      <DatePicker
                        name={"fecha_de_pago" as keyof TPayment}
                        date={new Date(cuote?.fecha_de_pago ?? new Date())}
                        label={text.form.details.date.placeholder} 
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
                          name={"valor_del_pago" as keyof TPayment} 
                          value={cuote?.valor_del_pago} 
                          placeholder={text.form.pay.payValue.placeholder} 
                        />
                    </Label>
                    <Label> <span>{text.form.pay.comment.label}</span>
                        <Textarea
                          name={"comentario" as keyof TPayment}
                          rows={3}
                          placeholder={text.form.pay.comment.placeholder}>
                          { credit.comentario }
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
      </_creditUpdate.Provider>
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
        label: "Monto de mora:",
        placeholder: 'Valor de la mora',
      },
      comment: {
        label: "Comentario:",
        placeholder: 'Escribe un comentario',
      },
    },
  },
}
