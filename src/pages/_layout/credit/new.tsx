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
import { ErrorComponentProps, createFileRoute, defer } from '@tanstack/react-router'
import React, { ComponentRef, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type TCLIENT_GET_ALL, type TCLIENT_GET_BASE } from '@/api/clients'
import styles from '@/styles/global.module.css'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'
import { postCredit, TCREDIT_POST, type TCREDIT_POST_BODY } from '@/api/credit'
import { useNotifications } from '@/lib/context/notification'
import { useStatus } from '@/lib/context/layout'
import { type TMORA_TYPE, getMoraTypeByName } from '@/lib/type/moraType'
import { getFrecuencyByName, listFrecuencys } from '@/lib/type/frecuency'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Navigate } from '@tanstack/react-router'
import { getStatusByName } from '@/lib/type/status'
import { format } from 'date-fns'
import { queryClient } from '@/pages/__root'
import { getClientListOpt } from '@/pages/_layout/client.lazy'
import { getUsersListOpt } from '@/pages/_layout/user.lazy'
import { type TUSER_GET } from '@/api/users'
import { Skeleton } from '@/components/ui/skeleton'
import { useToken } from '@/lib/context/login'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getCreditsListOpt } from '@/pages/_layout/credit.lazy'
import { news as text } from "@/assets/locale/credit";

type TSearch = {
  clientId: number
}

export const postCreditOpt = {
  mutationKey: ['create-credit'],
  mutationFn: postCredit,
}

export const Route = createFileRoute('/_layout/credit/new')({
  component: NewCredit,
  errorComponent: Error,
  validateSearch: (search: TSearch) => search,
  loader: () => ({
    clients: defer(queryClient.ensureQueryData(queryOptions(getClientListOpt))),
    users: defer(queryClient.ensureQueryData(queryOptions(getUsersListOpt))),
  }),
})

/* eslint-disable-next-line */
interface TCuotesState {
  value?: number
  type: TMORA_TYPE
}

/* eslint-disable-next-line */
const initialCuotes: TCuotesState = {
  type: 'Porciento',
}

/* eslint-disable-next-line */
type TFormName = keyof (Omit<
  TCREDIT_POST_BODY,
  'cobrador_id' | 'owner_id' | 'garante_id' | 'tipo_de_mora_id'
> &
  Record<'user' | 'client' | 'ref' | 'tipo_de_mora', string>)

/* eslint-disable-next-line */
export function NewCredit() {
  const form = useRef<HTMLFormElement>(null)
  const { userId: currentUserId, rol, name } = useToken()
  const {
    data: usersRes,
    isSuccess: okUsers,
    isFetching: pendingUsers,
  } = useQuery(queryOptions(getUsersListOpt))

  const select: (data: TCLIENT_GET_ALL) => TCLIENT_GET_ALL = (data) => {
    if (currentUserId && rol?.rolName !== 'Administrador')
      return data?.filter(({ owner_id }) => owner_id === currentUserId)
    return data
  }
  const {
    data: clientsRes,
    isSuccess: okClients,
    isFetching: pendingClients,
  } = useQuery({
    ...queryOptions(getClientListOpt),
    select,
  })
  const [installmants, setInstallmants] = useState<TCuotesState>(initialCuotes)
  const [{ coute, interest, amount }, setCuote] = useState<{
    coute?: number
    interest?: number
    amount?: number
  }>({})
  const { pushNotification } = useNotifications()
  const { open, setOpen } = useStatus()
  const { clientId } = Route.useSearch()
  const [user, setUser] = useState<TUSER_GET | undefined>()
  const [client, setClient] = useState<TCLIENT_GET_BASE | undefined>()
  const [ref, setRef] = useState<TCLIENT_GET_BASE | undefined>()
  const qClient = useQueryClient()

  useEffect(() => {
    if (clientsRes) {
      if (!clientsRes?.length) return
      const client = clientsRes?.find(({ id }) => id === clientId)
      if (!client) return
      setClient(client)

      const ref = clientsRes?.find(
        ({ id: refId }) => refId === client?.referencia_id
      )
      if (!ref) return
      setRef(ref)
    }
    return () => {}
  }, [clientsRes, clientId, okClients, pendingClients])

  useEffect(() => {
    const user = usersRes?.find(
      ({ id }) =>
        id === client?.owner_id ||
        (rol?.rolName !== 'Administrador' && id === currentUserId)
    )

    if (!usersRes || !usersRes?.length || !user)
      return () => {
        setUser({
          nombre: name ?? '',
          id: currentUserId ?? 0,
          rol: rol?.rolName ?? '',
        })
      }

    setUser(user)

    return () => {}
  }, [clientId, client, pendingUsers, okUsers])

  const onSuccess: (
    data: TCREDIT_POST,
    variables: TCREDIT_POST_BODY,
    context: unknown
  ) => unknown = () => {
    const description = text.notification.decription({
      username: client?.nombres + ' ' + client?.apellidos,
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
  }

  const onError: (
    error: Error,
    variables: TCREDIT_POST_BODY,
    context: unknown
  ) => unknown = (error) => {
    const errorMsg: { type: number; msg: string } = JSON.parse(error.message)

    toast({
      title: error.name + ': ' + errorMsg?.type,
      description: (
        <div className="text-sm">
          <p>{errorMsg?.msg }</p>
        </div>
      ),
      variant: 'destructive',
    })
  }

  const { mutate: createCredit } = useMutation({
    ...postCreditOpt,
    onSuccess,
    onError,
  })

  const onChangeType: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const { checked, value } = ev.target as {
      checked: boolean
      value: TMORA_TYPE
    }
    if (checked && value) {
      setInstallmants({ ...installmants, type: value })
    }
  }

  const onChangeValue: (
    prop: 'coute' | 'interest' | 'amount'
  ) => React.ChangeEventHandler<ComponentRef<typeof Input>> =
    (prop) => (ev) => {
      const { value } = ev.target
      // if(+value === 0 && prop === "coute") return;
      setCuote({
        ...{ interest, coute, amount },
        [prop]: Number.parseInt(value),
      })
    }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    if (!form.current) return

    const items = Object.fromEntries(
      [...new FormData(form.current).entries()]?.map(([key, value]) => {
        if (value === '') return [key, undefined]
        return [key, value]
      })
    ) as Record<TFormName, string>

    const user = usersRes?.find(({ nombre }) => nombre == items?.user)
    const client = clientsRes?.find(
      ({ nombres, apellidos }) =>
        [nombres, apellidos].join(' ') === items?.client
    )
    const ref = clientsRes?.find(
      ({ nombres, apellidos }) =>
        [nombres, apellidos].join(' ') === items?.client
    )

    const userId = user?.id ?? currentUserId
    const clientId = client?.id
    const refId = ref?.id

    if (!userId || !clientId) return

    createCredit({
      monto: +items?.monto,
      estado: getStatusByName({ statusName: 'Activo' })?.id,
      comentario: items?.comentario ?? '',
      cobrador_id: userId,
      valor_de_mora: +(items?.valor_de_mora ?? 0),
      tasa_de_interes: +items?.tasa_de_interes,
      tipo_de_mora_id: getMoraTypeByName({
        moraTypeName: (items?.tipo_de_mora as TMORA_TYPE) ?? 'Valor fijo',
      })?.id,
      dias_adicionales: +(items?.dias_adicionales ?? 0),
      numero_de_cuotas: +items?.numero_de_cuotas,
      frecuencia_del_credito_id: +items?.frecuencia_del_credito_id,
      owner_id: clientId,
      garante_id: refId ?? null,
      fecha_de_aprobacion: format(
        new Date(items?.fecha_de_aprobacion ?? ''),
        'yyyy-MM-dd'
      ),
    })

    setOpen({ open: !open })

    if (user) setUser(user)
    if (client) setClient(client)
    if (ref) setRef(ref)

    form.current.reset()
    ev.preventDefault()
  }

  return (
    <>
      {!open && <Navigate to={'../'} replace />}
      <DialogContent className="max-w-2xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-start text-xl md:text-2xl">
            {text.title}
          </DialogTitle>
          <Separator />
          <DialogDescription className="text-start text-xs text-muted-foreground md:text-base">
            {text.descriiption}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50dvh] md:h-full">
          <ScrollBar orientation="vertical" />
          <form
            autoFocus={false}
            autoComplete="off"
            ref={form}
            onSubmit={onSubmit}
            id="new-credit"
            className={clsx(
              'grid-rows-subgrid grid grid-cols-none gap-3 gap-y-4 p-1 md:grid-cols-2 md:items-end xl:grid-cols-3 [&>label]:space-y-2',
              styles?.['custom-form'],
              {
                '[&_*:disabled]:opacity-100':
                  !!currentUserId && rol?.rolName !== 'Administrador',
              }
            )}
          >
            <Label className="xl:!col-span-1">
              <span>{text.form.cliente.label} </span>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  {' '}
                  <Input
                    required
                    name={'client' as TFormName}
                    type="text"
                    placeholder={text.form.cliente.placeholder}
                    list="credit-clients"
                    defaultValue={
                      client
                        ? client?.nombres + ' ' + client?.apellidos
                        : undefined
                    }
                    pattern={`(${clientsRes
                      ?.map(
                        ({ nombres, apellidos }) =>
                          (nombres + ' ' + apellidos)?.replace(/\s+/g, '\\s+')
                      )
                      ?.join('|')})`}
                  />
                  <datalist id="credit-clients">
                    {clientsRes?.map(({ nombres, apellidos }, index) => (
                      <option key={index} value={nombres + ' ' + apellidos} />
                    ))}
                  </datalist>{' '}
                </>
              )}
            </Label>
            <Label>
              <span>{text.form.date.label} </span>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <DatePicker
                  name={'fecha_de_aprobacion' as TFormName}
                  label={text.form.date.placeholder}
                  className="!border-1 !border-ring"
                />
              )}
            </Label>
            <Label>
              <span>{text.form.ref.label} </span>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  name={'ref' as TFormName}
                  list="credit-clients"
                  type="text"
                  placeholder={text.form.ref.placeholder}
                  defaultValue={ref ? ref?.nombres + ref?.apellidos : undefined}
                  pattern={`(${clientsRes
                    ?.map(
                      ({ nombres, apellidos }) =>
                        (nombres + ' ' + apellidos)?.replace(/\s+/g, '\\s+')
                    )
                    ?.join('|')})`}
                />
              )}
            </Label>
            <Label className="xl:row-start-2">
              <div className="flex items-center justify-between gap-2 [&>div]:flex [&>div]:items-center [&>div]:gap-2 [&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-2">
                <span className='after:text-red-500 after:content-["_*_"]'>
                  {text.form.amount.label}{' '}
                </span>
                {!okUsers && !okClients ? (
                  <Skeleton className="h-6 w-8 rounded-full" />
                ) : (
                  <Badge>$</Badge>
                )}
              </div>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  required
                  min={1}
                  step={1}
                  // defaultValue={amount}
                  onChange={onChangeValue('amount')}
                  name={'monto' as TFormName}
                  type="number"
                  placeholder={text.form.amount.placeholder}
                />
              )}
            </Label>
            <Label htmlFor="credit-cuote" className="xl:row-start-2">
              <div className="flex items-center justify-between gap-2 [&>div]:flex [&>div]:items-center [&>div]:gap-2 [&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-2">
                <span className='after:text-red-500 after:content-["_*_"]'>
                  {text.form.interest.label}{' '}
                </span>
                {!okUsers && !okClients ? (
                  <Skeleton className="h-6 w-8 rounded-full" />
                ) : (
                  <Badge>%</Badge>
                )}
              </div>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="credit-cuote"
                  required
                  min={1}
                  max={100}
                  step={1}
                  name={'tasa_de_interes' as TFormName}
                  // defaultValue={interest}
                  onChange={onChangeValue('interest')}
                  type="number"
                  placeholder={text.form.interest.placeholder}
                />
              )}
            </Label>
            <Label htmlFor="credit-pay" className="xl:row-start-2">
              <div className="flex items-center justify-between gap-2 [&>div]:flex [&>div]:items-center [&>div]:gap-2 [&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-2">
                <span className='after:text-red-500 after:content-["_*_"]'>
                  {text.form.cuote.label}{' '}
                </span>
                {!okUsers && !okClients ? (
                  <Skeleton className="h-6 w-8 rounded-full" />
                ) : (
                  <Badge>#</Badge>
                )}
              </div>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="credit-pay"
                  required
                  min={1}
                  max={25}
                  step={1}
                  name={'numero_de_cuotas' as TFormName}
                  // defaultValue={coute}
                  onChange={onChangeValue('coute')}
                  type="number"
                  placeholder={text.form.cuote.placeholder}
                />
              )}
            </Label>
            <Label className='xl:row-start-3 [&>span]:after:text-red-500 [&>span]:after:content-["_*_"]'>
              <span>{text.form.frecuency.label} </span>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  required
                  name={'frecuencia_del_credito_id' as TFormName}
                  defaultValue={
                    '' + getFrecuencyByName({ frecuencyName: 'Mensual' })?.id
                  }
                >
                  <SelectTrigger className="!border-1 w-full !border-ring">
                    <SelectValue
                      placeholder={text.form.frecuency.placeholder}
                    />
                  </SelectTrigger>
                  <SelectContent className="[&_*]:cursor-pointer">
                    {listFrecuencys()?.map(({ id, nombre }, index) => (
                      <SelectItem key={index} value={'' + id}>
                        {nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Label>
            <Label className="xl:row-start-3">
              <span>{text.form.user.label} </span>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <Input
                    required
                    name={'user' as TFormName}
                    type="text"
                    placeholder={text.form.user.placeholder}
                    list="credit-user"
                    defaultValue={user?.nombre}
                    disabled={
                      !!currentUserId && rol?.rolName !== 'Administrador'
                    }
                    pattern={`(${usersRes
                      ?.map(({ nombre }) => nombre?.replace(/\s+/g, '\\s+'))
                      ?.join('|')})`}
                  />
                  <datalist id="credit-user">
                    {usersRes?.map(({ nombre, id }) => (
                      <option key={id} value={nombre} />
                    ))}
                  </datalist>{' '}
                </>
              )}
            </Label>
            <Label htmlFor="credit-installments" className="xl:row-start-4">
              <div className="flex items-center justify-between gap-2 [&>div]:flex [&>div]:items-center [&>div]:gap-2 [&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-2">
                <span className='after:text-red-500 after:content-["_*_"]'>
                  {text.form.installments.label}{' '}
                </span>
                {!okUsers && !okClients ? (
                  <div>
                    <Skeleton className="h-6 w-8 rounded-full" />
                    <Skeleton className="h-6 w-8 rounded-full" />
                  </div>
                ) : (
                  <RadioGroup
                    name={'tipo_de_mora' as TFormName}
                    defaultValue={
                      getMoraTypeByName({ moraTypeName: 'Porciento' })?.nombre
                    }
                    onChange={onChangeType}
                  >
                    <Label>
                      <RadioGroupItem
                        value={
                          getMoraTypeByName({ moraTypeName: 'Valor fijo' })
                            ?.nombre
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
                )}
              </div>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="credit-installments"
                  min={0}
                  max={installmants?.type === 'Porciento' ? 100 : undefined}
                  step={installmants?.type === 'Porciento' ? 1 : 1}
                  name={'valor_de_mora' as TFormName}
                  type="number"
                  defaultValue={installmants.value}
                  placeholder={
                    text.form.installments.placeholder?.[installmants.type]
                  }
                />
              )}
            </Label>
            <Label className="xl:row-start-4">
              <span>{text.form.aditionalDays.label} </span>
              {!okUsers && !okClients ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  min={0}
                  max={25}
                  name={'dias_adicionales' as TFormName}
                  type="number"
                  placeholder={text.form.aditionalDays.placeholder}
                />
              )}
            </Label>
            <Label>
              <span>{text.form.comment.label}</span>
              {!okUsers && !okClients ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <Textarea
                  rows={5}
                  name={'comentario' as TFormName}
                  placeholder={text.form.comment.placeholder}
                />
              )}
            </Label>
          </form>
        </ScrollArea>
        <DialogFooter className="flex-col !items-start gap-2 md:flex-row md:items-center md:!justify-between">
          <ul
            className={clsx(
              'flex w-full flex-row justify-between transition delay-150 duration-500 md:flex-col md:justify-start md:[&>li]:list-inside md:[&>li]:list-disc [&_span]:font-bold',
              {
                'opacity-0':
                  !interest ||
                  !coute ||
                  !amount ||
                  interest === 0 ||
                  coute === 0 ||
                  amount === 0,
                'opacity-1': interest && coute && amount,
              }
            )}
          >
            <li>
              <span>Monto Total</span>:{' '}
              {'$' + getAmountTotal({ amount, interest, coute })}.
            </li>
            <li>
              <span>Monto por cuota</span>:{' '}
              {'$' + getAmountCuote({ interest, amount, coute })}.{' '}
            </li>
          </ul>
          <div className="flex w-full flex-col gap-2 md:w-fit md:flex-row md:space-x-2">
            {!okUsers && !okClients ? (
              <>
                <Skeleton className="inline-block h-12 w-24" />
                <Skeleton className="inline-block h-12 w-24" />
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  form="new-credit"
                  type="submit"
                  className="md:self-end"
                >
                  {text.button.update}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="font-bold hover:ring hover:ring-primary"
                  >
                    {text.button.close}
                  </Button>
                </DialogClose>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}

/* eslint-disable-next-line */
export function Error({ error }: ErrorComponentProps) {
  const [ errorMsg, setMsg ] = useState<{ type: number | string; msg?: string } | undefined>( undefined )
  useEffect( () => {
    try{
      setMsg(JSON?.parse((error as Error)?.message))
    }
    catch{
      setMsg({ type: (error as Error)?.name, msg: (error as Error).message })
    }
  }, [error] )

  useEffect(() => {
    toast({
      title: "" + errorMsg?.type,
      description: (
        <div className="text-sm">
          <p>{errorMsg?.msg}</p>
        </div>
      ),
      variant: 'destructive',
    })
  }, [])
  return;
}

NewCredit.dispalyname = 'NewClient'
Error.dispalyname = 'NewClientError'

const getAmountTotal = ({
  interest,
  coute,
  amount,
}: {
  amount?: number
  coute?: number
  interest?: number
}) => {
  if (!amount || !coute || !interest) return 0
  if (coute === 0) return 0

  return Math.ceil(getAmountCuote({ coute, amount, interest }) * coute)
}

const getAmountCuote = ({
  interest,
  amount,
  coute,
}: {
  amount?: number
  interest?: number
  coute?: number
}) => {
  if (!amount || !interest || !coute) return 0
  if (coute === 0) return 0

  return Math.ceil(amount / coute + ((amount / coute) * interest) / 100)
}
