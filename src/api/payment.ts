import { useToken } from '@/lib/context/login'
import { type TCREDIT_GET_BASE } from './credit'

// GET
export type TPAYMENT_GET = {
  comentario: string
  fecha_de_pago: string
  valor_del_pago: number
  id: number
  registrado_por_usuario_id: number
  credito: TCREDIT_GET_BASE
}

export type TPAYMENT_GET_BASE = {
  comentario: string
  fecha_de_pago: string
  valor_del_pago: number
  id?: number
  credito_id?: number
  registrado_por_usuario_id: number
}

export type TPAYMENT_GET_ALL = TPAYMENT_GET_BASE[]

// POST
export type TPAYMENT_POST_BODY = {
  comentario: string
  fecha_de_pago: string
  valor_del_pago: number
  credito_id: number
}

export type TPAYMENT_POST = {
  id?: number
  pago_id?: number
  nombre_del_cliente: string
  cedula: string
  telefono: string
  fecha: string
  pendiente: number
  comentario: string
}

// PATCH
export type TPAYMENT_PATCH = TPAYMENT_GET_BASE

export type TPAYMENT_PATCH_BODY = {
  comentario?: string
  fecha_de_pago?: string
  valor_del_pago?: number
}

// DELETE
export type TPAYMENT_DELETE = TPAYMENT_GET_BASE

// FUNCTION TYPES
type TGetPaymentById = (params: {
  params: { paymentId: string }
}) => Promise<TPAYMENT_GET>
type TListPayments = () => Promise<TPAYMENT_GET_ALL>
type TDeletePaymentById = (params: {
  paymentId: number
}) => Promise<TPAYMENT_DELETE>
type TPostPaymentById = (params: TPAYMENT_POST_BODY) => Promise<TPAYMENT_POST>
type TPatchPaymentById = (params: {
  paymentId: number
  updatePayment?: TPAYMENT_PATCH_BODY
}) => Promise<TPAYMENT_PATCH>

// FUNCTION DEFINITIONS
export const getPaymentById: TGetPaymentById = async ({
  params: { paymentId },
}) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(
    import.meta.env.VITE_API + '/pagos/by_id/' + paymentId,
    {
      method: 'GET',
      headers,
    }
  )

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const listPayments: TListPayments = async () => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(import.meta.env.VITE_API + '/pagos/list', {
    method: 'GET',
    headers,
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const postPaymentId: TPostPaymentById = async (newPayment) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(import.meta.env.VITE_API + '/pagos/create', {
    method: 'POST',
    body: JSON.stringify(newPayment),
    headers,
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: (await res?.text()) } ))

  return res.json()
}

export const patchPaymentById: TPatchPaymentById = async ({
  paymentId,
  updatePayment,
}) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(import.meta.env.VITE_API + '/pagos/' + paymentId, {
    method: 'PATCH',
    body: JSON.stringify(updatePayment),
    headers,
  })

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}

export const deletePaymentById: TDeletePaymentById = async ({ paymentId }) => {
  const { token } = useToken.getState()
  if (!token) throw new Error('not auth')
  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const res = await fetch(
    import.meta.env.VITE_API + '/pagos/delete/' + paymentId,
    {
      method: 'DELETE',
      headers,
    }
  )

  if (!res.ok) throw Error( JSON.stringify( { type: res?.status, msg: await res?.text() } ))

  return res.json()
}
