import { HttpResponse, http } from 'msw'
import type { TPAYMENT_GET, TPAYMENT_POST, TPAYMENT_GET_ALL, TPAYMENT_POST_BODY, TPAYMENT_PATCH_BODY, TPAYMENT_PATCH, TPAYMENT_DELETE } from '@/api/payment'
import { TPAYMENT_DB, clients, credits, payments } from './data'

const allPayments = http.all(import.meta.env.VITE_API + '/pagos/list', async () => {
  return HttpResponse.json<TPAYMENT_GET_ALL>(
    Array.from(payments?.values())?.map<TPAYMENT_GET>(({ fecha_de_pago, comentario, valor_del_pago, id, credit_id }) => ({
      id,
      valor_del_pago,
      comentario,
      credito_id: credit_id,
      fecha_de_pago: new Date(fecha_de_pago),
      registrado_por_usuario_id: 0
    }))
  )
})

const createPayment = http.post( import.meta.env.VITE_API + '/pagos/create', async ({ request }) => {
  const newPayment = (await request.json()) as TPAYMENT_POST_BODY
  const credit = credits?.get( newPayment?.credito_id )
  if( !newPayment || !credit ) {
    throw new Error("Fail post request")
  }

  const { fecha_de_pago, comentario, credito_id, valor_del_pago } = newPayment
  payments?.set( payments?.size + 1, {id: (payments?.get(payments?.size)?.id ?? 0) + 1, fecha_de_pago: fecha_de_pago.toString(), valor_del_pago, comentario, credit_id: credito_id } )

  const client = clients.get( credit?.cliente_id )
  return HttpResponse.json<TPAYMENT_POST>( {
    id: (payments?.get(payments?.size)?.id ?? 0),
    credito_id,
    valor_del_pago,
    comentario,
    fecha_de_pago,
    cedula: client?.numero_de_identificacion ?? "",
    telefone: client?.telefono ?? "",
    pendiente: false,
    nombre_del_cliente: client?.nombres + " " + client?.apellidos
  }, { status: 201 } )
} )

const updatePaymentById = http.patch( import.meta.env.VITE_API + '/pagos/:pago_id', async ({params, request }) => {
  const upadetePayment = (await request.json()) as TPAYMENT_PATCH_BODY
  const { pago_id } = params as { pago_id?: string }
  if( !upadetePayment || !pago_id ) {
    throw new Error("Fail update request")
  }

  const paymentId = Number.parseInt(pago_id)
  const payment = payments.get( paymentId )
  if( !paymentId || !payments?.has( paymentId ) || !payment ){
    throw new Error("params be a error")
  }

  payments?.set( paymentId, { ...(payments?.get(paymentId) ?? {} as (TPAYMENT_DB & { credit_id: number })),
    fecha_de_pago: upadetePayment.fecha_de_pago?.toString() ?? "",
    valor_del_pago: upadetePayment.valor_del_pago ?? 0,
    comentario: upadetePayment.comentario ?? "",
  })

  const { credit_id, comentario, valor_del_pago, fecha_de_pago } = payment
  return HttpResponse.json<TPAYMENT_PATCH>({
    id: Number.parseInt(pago_id),
    registrado_por_usuario_id: 0,
    valor_del_pago,
    comentario,
    fecha_de_pago: new Date(fecha_de_pago),
    credito_id: credit_id
  })
} )

const getPaymentById = http.get( import.meta.env.VITE_API + '/pagos/by_id/:pago_id', async ({params}) => {
  const { pago_id } = params as { pago_id?: string }
  if( !pago_id ) {
    throw new Error("Fail update request")
  }

  const paymentId = Number.parseInt(pago_id)
  const payment = payments.get( paymentId )
  if( !paymentId || !payments?.has( paymentId ) || !payment ){
    throw new Error("params error")
  }

  const { credit_id, comentario, valor_del_pago, fecha_de_pago } = payment
  return HttpResponse.json<TPAYMENT_GET>({
    id: Number.parseInt(pago_id),
    registrado_por_usuario_id: 0,
    valor_del_pago,
    comentario,
    fecha_de_pago: new Date(fecha_de_pago),
    credito_id: credit_id
  })
} )

const deletePaymentById = http.delete( import.meta.env.VITE_API + '/pagos/delete/:pago_id', async ( { params } ) => {
  const { pago_id } = params as { pago_id?: string }
  if( !pago_id ) {
    throw new Error("Fail update request")
  }

  const paymentId = Number.parseInt(pago_id)
  const payment = payments.get( paymentId )
  if( !paymentId || !payments?.has( paymentId ) || !payment ){
    throw new Error("params be error")
  }

  payments?.delete( paymentId )

  const { credit_id, comentario, valor_del_pago, fecha_de_pago } = payment
  return HttpResponse.json<TPAYMENT_DELETE>({
    id: Number.parseInt(pago_id),
    registrado_por_usuario_id: 0,
    valor_del_pago,
    comentario,
    fecha_de_pago: new Date(fecha_de_pago),
    credito_id: credit_id
  })
})

export default [
  allPayments,
  createPayment,
  updatePaymentById,
  getPaymentById,
  deletePaymentById
]
