import { HttpResponse, http } from 'msw'
import type { TPAYMENT_GET, TPAYMENT_POST, TPAYMENT_GET_ALL, TPAYMENT_POST_BODY, TPAYMENT_PATCH_BODY, TPAYMENT_PATCH, TPAYMENT_DELETE } from '@/api/payment'
import { clients, credits, payments, token } from '@/mocks/data'

const allPayments = http.all(import.meta.env.VITE_API + '/pagos/list', async ({request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  return HttpResponse.json<TPAYMENT_GET_ALL>(Array.from(payments?.values()))
})

const createPayment = http.post( import.meta.env.VITE_API + '/pagos/create', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const newPayment = (await request.json()) as TPAYMENT_POST_BODY
  const credit = credits?.get( newPayment?.credito_id )
  if( !newPayment || !credit ) throw new Error("Fail post request")

  payments?.set( payments?.size + 1, { ...newPayment,  id: (payments?.get(payments?.size)?.id ?? 0) + 1, registrado_por_usuario_id: credit.cobrador_id } )

  const payment = payments?.get( payments?.size )
  if(!payment || !payment?.credito_id) throw new Error("not add new payment")

  const client = clients.get( payment?.credito_id )
  if(!client) throw new Error("client for a payment not found")

  return HttpResponse.json<TPAYMENT_POST>( {
    id: payment?.id,
    comentario: payment?.comentario,
    cedula: client?.numero_de_identificacion,
    pendiente: Math.abs( payment?.valor_del_pago - credit?.cuotas?.[0]?.valor_de_cuota ),
    nombre_del_cliente: client?.nombres + " " + client?.apellidos,
    telefono: client?.telefono,
    pago_id: payment?.id,
    fecha: payment?.fecha_de_pago
  }, { status: 201 } )
} )

const updatePaymentById = http.patch( import.meta.env.VITE_API + '/pagos/:pago_id', async ({params, request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const upadetePayment = (await request.json()) as TPAYMENT_PATCH_BODY
  const { pago_id } = params as { pago_id?: string }
  if( !upadetePayment || !pago_id ) throw new Error("Fail update request")

  const paymentId = +pago_id
  const payment = payments.get( paymentId )
  if( !paymentId || !payments?.has( paymentId ) || !payment ) throw new Error("params be a error")

  payments?.set( paymentId, { ...payment, ...upadetePayment })

  return HttpResponse.json<TPAYMENT_PATCH>(payment)
} )

const getPaymentById = http.get( import.meta.env.VITE_API + '/pagos/by_id/:pago_id', async ({params, request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { pago_id } = params as { pago_id?: string }
  if( !pago_id ) throw new Error("Fail update request")

  const paymentId = +pago_id
  const payment = payments.get( paymentId )
  if( !paymentId || !payments?.has( paymentId ) || !payment || !payment?.credito_id ) throw new Error("params error")

  const credit = credits?.get( payment?.credito_id )
  if( !credit ) throw new Error("not credit found")

  return HttpResponse.json<TPAYMENT_GET>({
    id: payment?.id ?? paymentId,
    fecha_de_pago: payment?.fecha_de_pago,
    registrado_por_usuario_id: payment?.registrado_por_usuario_id,
    valor_del_pago: payment?.valor_del_pago,
    comentario: payment?.comentario,
    credito: credit
  })
} )

const deletePaymentById = http.delete( import.meta.env.VITE_API + '/pagos/delete/:pago_id', async ( { params, request } ) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { pago_id } = params as { pago_id?: string }
  if( !pago_id ) throw new Error("Fail update request")

  const paymentId = +pago_id
  const payment = payments.get( paymentId )
  if( !paymentId || !payments?.has( paymentId ) || !payment ) throw new Error("params be error")

  payments?.delete( paymentId )

  return HttpResponse.json<TPAYMENT_DELETE>(payment)
})

export default [
  allPayments,
  createPayment,
  updatePaymentById,
  getPaymentById,
  deletePaymentById
]
