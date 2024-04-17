import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Dialog } from '@radix-ui/react-dialog'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { createContext, useMemo, useRef, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { type TCREDIT_PATCH_BODY, type TCREDIT_GET } from '@/api/credit'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import clsx from 'clsx'
import { useStatus } from '@/lib/context/layout'
import { Navigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  type TMORA_TYPE,
  getMoraTypeById,
  getMoraTypeByName,
} from '@/lib/type/moraType'
import { type TPAYMENT_GET, type TPAYMENT_GET_BASE } from '@/api/payment'
import { listFrecuencys } from '@/lib/type/frecuency'
import { type TCLIENT_GET_BASE } from '@/api/clients'
import { Annoyed, Cross } from 'lucide-react'
import { queryClient } from '@/pages/__root'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getClientListOpt } from '@/pages/_layout/client'
import { getUsersListOpt } from '@/pages/_layout/user'
import { getCreditByIdOpt } from '@/pages/_layout/credit_/$creditId'
import { Skeleton } from '@/components/ui/skeleton'
import { useToken } from '@/lib/context/login'
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/credit/$creditId/update')({
  component: UpdateCreditById,
  errorComponent: Error,
  pendingComponent: Pending,
  loader: ({ params }) => {
    const clients = queryClient.ensureQueryData(queryOptions(getClientListOpt))
    const users = queryClient.ensureQueryData(queryOptions(getUsersListOpt))
    const credit = queryClient.ensureQueryData(
      queryOptions(getCreditByIdOpt(params))
    )
    return { clients, users, credit }
  },
  beforeLoad: () => {
    const { rol, userId } = useToken.getState()
    if (!userId || rol?.rolName !== 'Administrador')
      throw redirect({ to: '/credit' })
  },
})

/* eslint-disable-next-line */
interface TCuotesState {
  value?: number
  type: TMORA_TYPE
}

/* eslint-disable-next-line */
type TFormName = keyof (Omit<
  TCREDIT_PATCH_BODY,
  'cobrador_id' | 'owner_id' | 'garante_id' | 'tipo_de_mora_id'
> &
  Record<'user' | 'client' | 'ref' | 'tipo_de_mora', string>)

export const _creditChange = createContext<TCREDIT_GET | undefined>(undefined)
export const _credit = createContext<TCREDIT_GET | undefined>(undefined)
export const _payDelete = createContext<
  { [k: number]: number | undefined } | undefined
>(undefined)
export const _client = createContext<TCLIENT_GET_BASE | undefined>(undefined)

/* eslint-disable-next-line */
export function UpdateCreditById() {
  const { creditId } = Route.useParams()
  const { data: clients } = useSuspenseQuery(queryOptions(getClientListOpt))
  const { data: users } = useSuspenseQuery(queryOptions(getUsersListOpt))
  const { data: credit } = useSuspenseQuery(
    queryOptions(getCreditByIdOpt({ creditId }))
  )
  const [creditChange, setCreditChange] = useState(credit)
  const [installmants, setInstallmants] = useState<TCuotesState>({
    type: getMoraTypeById({ moraTypeId: credit?.tipo_de_mora_id })?.nombre,
  })
  const { open, setOpen } = useStatus()
  const navigate = useNavigate()
  /* eslint-disable-next-line */
  const form = (credit?.pagos ?? []).map(() => useRef<HTMLFormElement>(null))
  const [paymentDelete, setPaymentDelete] = useState<
    { [k: number]: number | undefined } | undefined
  >(undefined)

  const active = useMemo(
    () =>
      Object.values(credit)
        .flat()
        .every(
          (value, i) => value === Object.values(creditChange).flat()?.[i]
        ) && !Object.values(paymentDelete ?? {})?.length,
    [creditChange, paymentDelete]
  )

  const { client, user, ref } = useMemo(() => {
    const client = clients?.find(({ id }) => id === credit?.owner_id)
    const ref = clients?.find(({ id: refId }) => refId === credit?.garante_id)
    const user = users?.find(({ id: userId }) => userId === credit?.cobrador_id)
    return { client, ref, user }
  }, [credit])

  const onOpenChange = (open: boolean) => {
    if (open) {
      navigate({ to: Route.to })
    }
    setOpen({ open })
  }

  const onChangeStatus = (checked: boolean) => {
    setCreditChange({ ...creditChange, estado: !checked ? 0 : 1 })
  }

  const onChangeType: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { checked, value } = ev.target as {
      checked: boolean
      value: TMORA_TYPE
    }
    if (checked && value) {
      setInstallmants({ ...installmants, type: value })
    }
  }

  const onChangeDetail: React.ChangeEventHandler<HTMLFormElement> = (ev) => {
    const { value, name } = ev.target as { name?: TFormName; value?: string }
    if (!name || !value) return

    if (
      name !== 'user' &&
      name !== 'ref' &&
      name !== 'client' &&
      name !== 'tipo_de_mora'
    ) {
      setCreditChange({ ...creditChange, [name as TFormName]: value })
      return
    }

    const userId = users?.find(({ nombre }) => nombre == value)?.id
    const clientId = clients?.find(
      ({ nombres, apellidos }) => nombres + ' ' + apellidos === value
    )?.id
    const refId = clients?.find(
      ({ nombres, apellidos }) => nombres + ' ' + apellidos === value
    )?.id

    if (userId && name === 'user') {
      setCreditChange({ ...creditChange, cobrador_id: userId })
      return
    }

    if (name === 'ref') {
      setCreditChange({ ...creditChange, garante_id: refId ?? null })
      return
    }

    if (clientId && name === 'client') {
      setCreditChange({ ...creditChange, owner_id: clientId })
      return
    }

    if (name === 'tipo_de_mora') {
      setCreditChange({
        ...creditChange,
        tipo_de_mora_id: getMoraTypeByName({
          moraTypeName: value as TMORA_TYPE,
        })?.id,
      })
      return
    }
  }

  const onChangePaymentById: (
    index: number
  ) => React.ChangeEventHandler<HTMLFormElement> = (index) => (ev) => {
    const { value, name }: { name?: string; value?: string } = ev.target
    const { pagos } = creditChange
    if (!value || !name || !pagos) return

    const payments = pagos?.map<TPAYMENT_GET_BASE>((payment, i) => {
      if (i !== index) return payment
      return { ...payment, [name]: value }
    })

    setCreditChange({ ...creditChange, pagos: payments })
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    const formList = form?.filter((item) => item.current)

    if (form.every((item) => !item.current)) {
      setOpen({ open: !open })
      navigate({ to: './confirm' })
    }

    for (const { current: form } of formList.reverse()) {
      form?.requestSubmit()
    }

    ev.preventDefault()
  }

  const onCuoteSubmit: (
    index: number
  ) => React.FormEventHandler<HTMLFormElement> = (index) => (ev) => {
    const activeForms = form
      ?.map(({ current }, id) => ({ id, current }))
      ?.filter(({ current }) => current)

    if (
      index === Math.max(...activeForms.map(({ id }) => id)) &&
      activeForms?.every(({ current }) => current?.checkValidity())
    ) {
      setOpen({ open: !open })
      navigate({ to: './confirm' })
    }

    ev.preventDefault()
  }

  const onDeletePaymentById: (
    index: number
  ) => React.MouseEventHandler<React.ComponentRef<typeof Button>> =
    (index) => (ev) => {
      ev.stopPropagation()

      if (!!paymentDelete?.[index] && form?.[index]) {
        setPaymentDelete({ ...paymentDelete, [index]: undefined })
        form?.[index]?.current?.reset()
        return
      }

      const payId = creditChange?.pagos?.[index]?.id
      if (!payId) return

      setPaymentDelete({ ...paymentDelete, [index]: payId })
    }

  return (
    <_credit.Provider value={credit}>
      <_creditChange.Provider value={creditChange}>
        <_payDelete.Provider value={paymentDelete}>
          <_client.Provider value={client}>
            <Navigate to={Route.to} />
            <div className="space-y-4">
              <div className="flex gap-2">
                <h1 className="text-3xl font-bold">{text.title}</h1>
                <Dialog open={open} onOpenChange={onOpenChange}>
                  <Button
                    className="ms-auto"
                    variant="default"
                    form={'edit-credit'}
                    disabled={active}
                  >
                    {text.button.update}
                  </Button>
                  <Link to={'../'}>
                    <Button
                      variant="outline"
                      className="hover:ring hover:ring-primary"
                    >
                      {' '}
                      {text.button.close}{' '}
                    </Button>
                  </Link>
                  <Outlet />
                </Dialog>
              </div>
              <Separator />
              <Card className="duration-400 shadow-lg transition delay-150 hover:shadow-xl">
                <CardHeader>
                  <div className="flex flex-row justify-between">
                    <CardTitle className="text-2xl font-bold">
                      {text.form.details.title}
                    </CardTitle>
                    <Switch
                      form="edit-credit"
                      name={'estado' as TFormName}
                      defaultChecked={!!credit.estado}
                      onCheckedChange={onChangeStatus}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <form
                    className="grid grid-cols-3 gap-4 [&>label:last-child]:col-span-full [&>label>div>span]:font-bold [&>label>span]:font-bold [&>label]:space-y-2"
                    id={'edit-credit'}
                    onChange={onChangeDetail}
                    onSubmit={onSubmit}
                  >
                    <Label>
                      <span>{text.form.details.clients.label}</span>
                      <Input
                        className="!opacity-100"
                        disabled
                        name={'client' as TFormName}
                        type="text"
                        placeholder={text.form.details.clients.placeholder}
                        list="credit-clients"
                        defaultValue={
                          creditChange?.owner_id
                            ? client?.nombres + ' ' + client?.apellidos
                            : undefined
                        }
                      />
                      <datalist id="credit-clients">
                        {clients?.map(({ nombres, apellidos }, index) => (
                          <option
                            key={index}
                            value={nombres + ' ' + apellidos}
                          />
                        ))}
                      </datalist>
                    </Label>
                    <Label>
                      <span>{text.form.details.date.label}</span>
                      <DatePicker
                        required
                        name={'fecha_de_aprobacion' as TFormName}
                        date={new Date(creditChange.fecha_de_aprobacion)}
                        label={text.form.details.date.placeholder}
                      />
                    </Label>
                    <Label className="!col-span-1">
                      <span>{text.form.details.ref.label}</span>
                      <Input
                        name={'ref' as TFormName}
                        list="credit-clients"
                        type="text"
                        defaultValue={
                          creditChange?.garante_id
                            ? ref?.nombres + ' ' + ref?.apellidos
                            : undefined
                        }
                        placeholder={text.form.details.ref.placeholder}
                      />
                    </Label>
                    <Label>
                      <div className="flex items-center justify-between gap-2">
                        <span>{text.form.details.amount.label}</span>
                        <Badge>$</Badge>
                      </div>
                      <Input
                        required
                        min={0}
                        step={1}
                        name={'monto' as TFormName}
                        type="number"
                        defaultValue={creditChange.monto}
                        placeholder={text.form.details.amount.placeholder}
                      />
                    </Label>
                    <Label>
                      <div className="flex items-center justify-between gap-2">
                        <span> {text.form.details.interest.label} </span>
                        <Badge>%</Badge>
                      </div>
                      <Input
                        required
                        min={0}
                        max={100}
                        step={1}
                        name={'tasa_de_interes' as TFormName}
                        defaultValue={creditChange.tasa_de_interes}
                        type="number"
                        placeholder={text.form.details.interest.placeholder}
                      />
                    </Label>
                    <Label>
                      <div className="flex items-center justify-between gap-2">
                        <span> {text.form.details.cuotes.label} </span>
                        <Badge>#</Badge>
                      </div>
                      <Input
                        required
                        min={0}
                        max={25}
                        step={1}
                        name={'numero_de_cuotas' as TFormName}
                        defaultValue={creditChange.numero_de_cuotas}
                        type="number"
                        placeholder={text.form.details.cuotes.label}
                      />
                    </Label>
                    <Label>
                      <span>{text.form.details.frecuency.label}</span>
                      <Select
                        required
                        name={'frecuencia_del_credito_id' as TFormName}
                        defaultValue={
                          '' + creditChange?.frecuencia_del_credito_id
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              text.form.details.frecuency.placeholder
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="[&_*]:cursor-pointer">
                          {listFrecuencys()?.map(({ nombre, id }, index) => (
                            <SelectItem key={index} value={'' + id}>
                              {nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Label>
                    <Label>
                      <span>{text.form.details.users.label}</span>
                      <Input
                        required
                        name={'user' as TFormName}
                        type="text"
                        placeholder={text.form.details.users.placeholder}
                        list="credit-user"
                        defaultValue={
                          creditChange?.cobrador_id ? user?.nombre : undefined
                        }
                      />
                      <datalist id="credit-user">
                        {users?.map(({ nombre }, index) => (
                          <option key={index} value={nombre} />
                        ))}
                      </datalist>
                    </Label>
                    <Label
                      htmlFor="credit-installments"
                      className="row-start-4"
                    >
                      <div className="flex items-center justify-between gap-2 [&>div]:flex [&>div]:items-center [&>div]:gap-2 [&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-2">
                        <span>{text.form.details.installmants.label}</span>
                        <RadioGroup
                          name={'tipo_de_mora' as TFormName}
                          defaultValue={
                            '' +
                            getMoraTypeById({
                              moraTypeId: creditChange?.tipo_de_mora_id,
                            })?.nombre
                          }
                          onChange={onChangeType}
                        >
                          <Label>
                            <RadioGroupItem
                              value={
                                getMoraTypeByName({
                                  moraTypeName: 'Valor fijo',
                                })?.nombre
                              }
                            />{' '}
                            <Badge>$</Badge>{' '}
                          </Label>
                          <Label>
                            <RadioGroupItem
                              value={
                                getMoraTypeByName({ moraTypeName: 'Porciento' })
                                  ?.nombre
                              }
                            />{' '}
                            <Badge>%</Badge>{' '}
                          </Label>
                        </RadioGroup>
                      </div>
                      <Input
                        id="credit-installments"
                        required
                        min={0}
                        max={
                          installmants?.type === 'Porciento' ? 100 : undefined
                        }
                        step={installmants?.type === 'Porciento' ? 1 : 1}
                        name={'valor_de_mora' as TFormName}
                        type="number"
                        defaultValue={creditChange?.valor_de_mora}
                        placeholder={
                          text.form.details.installmants.placeholder[
                            installmants.type
                          ]
                        }
                      />
                    </Label>
                    <Label className="row-start-4">
                      <span>{text.form.details.aditionalsDays.label}</span>
                      <Input
                        min={0}
                        max={25}
                        type="number"
                        name={'dias_adicionales' as TFormName}
                        defaultValue={creditChange?.dias_adicionales}
                        placeholder={
                          text.form.details.aditionalsDays.placeholder
                        }
                      />
                    </Label>
                    <Label>
                      <span>{text.form.details.comment.label}</span>
                      <Textarea
                        name={'comentario' as TFormName}
                        rows={5}
                        placeholder={text.form.details.comment.placeholder}
                      >
                        {creditChange.comentario}
                      </Textarea>
                    </Label>
                  </form>
                </CardContent>
              </Card>
              {!!creditChange?.pagos?.length &&
                !!creditChange?.cuotas?.length && (
                  <Card className="duration-400 shadow-lg transition delay-150 hover:shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        {text.form.pay.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="multiple">
                        {creditChange?.pagos
                          .slice(0, creditChange?.pagos?.length + 1)
                          ?.map((payment, index) => (
                            <AccordionItem
                              key={index}
                              value={'' + index}
                              className="group/item"
                            >
                              <AccordionTrigger
                                className={clsx(
                                  "gap-4 !no-underline before:font-bold before:not-italic before:content-['_+_'] [&>span]:italic [&[data-state='open']]:before:content-['_-_'] "
                                )}
                              >
                                <span
                                  className={clsx(
                                    'decoration-destructive decoration-4',
                                    { 'line-through': paymentDelete?.[index] }
                                  )}
                                >
                                  {format(payment?.fecha_de_pago, 'dd-MM-yyyy')}
                                </span>
                                <Button
                                  onClick={onDeletePaymentById(index)}
                                  variant={'outline'}
                                  className={clsx(
                                    'group/button invisible ms-auto h-6 w-6 rounded-full p-1 opacity-0 transition delay-150 duration-300 group-hover/item:visible group-hover/item:opacity-100',
                                    {
                                      'hover:bg-destructive':
                                        !paymentDelete?.[index],
                                      'hover:bg-success':
                                        paymentDelete?.[index],
                                    }
                                  )}
                                >
                                  <Cross
                                    className={clsx(
                                      'transition delay-150 duration-500 group-hover/button:stroke-white',
                                      {
                                        'rotate-45 stroke-destructive stroke-destructive':
                                          !paymentDelete?.[index],
                                        'stroke-success':
                                          paymentDelete?.[index],
                                      }
                                    )}
                                  />
                                </Button>
                              </AccordionTrigger>
                              <AccordionContent asChild>
                                <form
                                  className="grid grid-cols-2 items-end gap-4 px-4 [&>label:last-child]:col-span-full [&>label>div]:flex [&>label>div]:items-center [&>label>div]:justify-between [&>label>div]:gap-2 [&>label]:space-y-2 [&>label_span]:font-bold"
                                  id={'edit-pay-' + index}
                                  onChange={onChangePaymentById(index)}
                                  onSubmit={onCuoteSubmit(index)}
                                  ref={form?.[index]}
                                >
                                  <Label>
                                    <span>{text.form.pay.payDate.label}</span>
                                    <DatePicker
                                      disabled={!!paymentDelete?.[index]}
                                      name={
                                        'fecha_de_pago' as keyof TPAYMENT_GET
                                      }
                                      date={new Date(payment?.fecha_de_pago)}
                                      label={text.form.pay.payDate.placeholder}
                                      defaultValue={payment?.fecha_de_pago}
                                      value={
                                        paymentDelete?.[index] ? '' : undefined
                                      }
                                    />
                                  </Label>
                                  <Label>
                                    <div>
                                      <span>
                                        {text.form.pay.payValue.label}
                                      </span>
                                      <Badge>$</Badge>
                                    </div>
                                    <Input
                                      disabled={!!paymentDelete?.[index]}
                                      type="number"
                                      min={0}
                                      step={1}
                                      name={
                                        'valor_del_pago' as keyof TPAYMENT_GET
                                      }
                                      defaultValue={payment?.valor_del_pago}
                                      placeholder={
                                        text.form.pay.payValue.placeholder
                                      }
                                    />
                                  </Label>
                                  <Label>
                                    {' '}
                                    <span>{text.form.pay.comment.label}</span>
                                    <Textarea
                                      disabled={!!paymentDelete?.[index]}
                                      name={
                                        'fecha_de_pago' as keyof TPAYMENT_GET
                                      }
                                      rows={3}
                                      placeholder={
                                        text.form.pay.comment.placeholder
                                      }
                                    >
                                      {creditChange.comentario}
                                    </Textarea>
                                  </Label>
                                </form>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}
            </div>
          </_client.Provider>
        </_payDelete.Provider>
      </_creditChange.Provider>
    </_credit.Provider>
  )
}

/* eslint-disable-next-line */
export function Pending() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="ms-auto h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Separator />
      <Card>
        <CardHeader className="items-between flex">
          <div className="flex flex-row justify-between">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="ms-auto h-10 w-16" />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-2">
          <div>
            {' '}
            <Skeleton className="h-6 w-36" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div>
            {' '}
            <Skeleton className="h-6 w-24" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div>
            {' '}
            <Skeleton className="h-6 w-32" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div>
            {' '}
            <Skeleton className="h-6 w-24" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div>
            {' '}
            <Skeleton className="h-6 w-36" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div>
            {' '}
            <Skeleton className="h-6 w-32" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div className="row-start-3">
            {' '}
            <Skeleton className="h-6 w-24 " />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div className="row-start-3">
            {' '}
            <Skeleton className="h-6 w-24 " />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div className="row-start-4">
            {' '}
            <Skeleton className="row-start-5 h-6 w-24" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div className="row-start-4">
            {' '}
            <Skeleton className="row-start-5 h-6 w-32" />{' '}
            <Skeleton className="h-10 w-full" />{' '}
          </div>
          <div className="col-span-full row-start-5">
            {' '}
            <Skeleton className=" h-6 w-24" />{' '}
            <Skeleton className="h-32 w-full" />{' '}
          </div>
        </CardContent>
      </Card>
      <Separator />
      <Card>
        <CardHeader className="items-between flex">
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4 divide-y-2 [&>div>*:last-child]:ms-auto [&>div]:flex [&>div]:flex-row [&>div]:gap-2 [&>div]:pt-4">
          {Array.from({ length: 10 })?.map((_, index) => (
            <div key={index}>
              {' '}
              <Skeleton className="h-6 w-8" /> <Skeleton className="h-6 w-44" />{' '}
              <Skeleton className="h-6 w-8" />{' '}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

/* eslint-disable-next-line */
export function Error() {
  const { history } = useRouter()
  const onClick: React.MouseEventHandler<
    React.ComponentRef<typeof Button>
  > = () => {
    history.back()
  }
  return (
    <div className="flex h-full items-center items-center justify-center gap-4 [&>svg]:h-32 [&>svg]:w-32 [&>svg]:stroke-destructive [&_h1]:text-2xl">
      <Annoyed className="animate-bounce" />
      <div className="space-y-2">
        <h1 className="font-bold">{text.error}</h1>
        <p className="italic">{text.errorDescription}</p>
        <Separator />
        <Button variant="ghost" onClick={onClick} className="text-sm">
          {' '}
          {text.back + '.'}{' '}
        </Button>
      </div>
    </div>
  )
}

UpdateCreditById.dispalyname = 'UpdateCreditById'
Error.dispalyname = 'UpdateCreditByIdError'
Pending.dispalyname = 'UpdateCreditByIdPending'

const text = {
  title: 'Editar prestamos:',
  error: 'Ups!!! ha ocurrido un error',
  errorDescription: 'Los detalles del prestamo ha fallado.',
  back: 'Intente volver a la pestaña anterior',
  button: {
    update: 'Actualizar',
    close: 'Cancelar',
  },
  notification: {
    titile: 'Actualizacion de un prestamo',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizado el prestamo para el usuario ' +
      username +
      ' con exito.',
    error: 'Error: la actualizacion del prestamo ha fallado',
    undo: 'Deshacer',
  },
  form: {
    details: {
      title: 'Estado del prestamo:',
      amount: {
        label: 'Monto total:',
        placeholder: 'Escriba el nombre del usuario',
      },
      date: {
        label: 'Fecha de aprobacion:',
        placeholder: 'Seleccione la fecha',
      },
      comment: {
        label: 'Comentario:',
        placeholder: 'Escriba un comentario',
      },
      interest: {
        label: 'Tasa de interes:',
        placeholder: 'Escriba la tasa de interes',
      },
      aditionalsDays: {
        label: 'Dias adicionales:',
        placeholder: 'Cantidad de dias adicionales',
      },
      clients: {
        label: 'Cliente:',
        placeholder: 'Escribe | Seleccione el cliente',
      },
      ref: {
        label: 'Garante:',
        placeholder: 'Escribe el garante',
      },
      cuotes: {
        label: 'Numeros de cuotas:',
        placeholder: 'Escribe la cantidad de cuotas',
      },
      users: {
        label: 'Cobrador:',
        placeholder: 'Escribe | Seleccione el cobrador',
      },
      installmants: {
        label: 'Monto de mora:',
        placeholder: {
          ['Valor fijo' as TMORA_TYPE]: 'Monto adicional en cada cuota',
          ['Porciento' as TMORA_TYPE]: 'Porcentaje adicional en cada cuota',
        },
      },
      frecuency: {
        label: 'Frecuencia:',
        placeholder: 'Seleccione una opcion',
        items: ['Anual', 'Quincenal', 'Mensual', 'Semanal'],
      },
    },
    pay: {
      title: 'Listado de pagos:',
      payDate: {
        label: 'Fecha de pago:',
        placeholder: 'Seleccione la fecha',
      },
      installmantsDate: {
        label: 'Fecha de aplicacion de mora:',
        placeholder: 'Seleccione la fecha',
      },
      payValue: {
        label: 'Monto de pago:',
        placeholder: 'Valor del pago',
      },
      comment: {
        label: 'Comentario:',
        placeholder: 'Escribe un comentario',
      },
    },
  },
}
