// BASE
interface TPAYMENT_BASE {
  id: number
  comentario: string
  fecha_de_pago: Date
  valor_del_pago: number
}

interface TPAYMENT_BODY_BASE {
  comentario?: string
  fecha_de_pago?: Date
  valor_del_pago?: number
}

// GET
export interface TPAYMENT_GET extends TPAYMENT_BASE {
  registrado_por_usuario_id: number
  credito_id: number
}

// GET ALL
export type TPAYMENT_GET_ALL = TPAYMENT_GET[] 

// POST
export interface TPAYMENT_POST_BODY extends Omit<TPAYMENT_BASE, "id"> {
  credito_id: number
}

export interface TPAYMENT_POST extends TPAYMENT_BASE {
  credito_id: number
  nombre_del_cliente: string
  cedula: string
  telefone: string
  pendiente: boolean
}

// PATCH
export type TPAYMENT_PATCH = TPAYMENT_GET 

export type TPAYMENT_PATCH_BODY = TPAYMENT_BODY_BASE

// DELETE
export type TPAYMENT_DELETE = TPAYMENT_GET

// FUNCTION TYPES
type TGetPaymentById = (params: { params: { paymentId: string } }) => Promise<TPAYMENT_GET>
type TGetPayments = () => Promise<TPAYMENT_GET_ALL>
type TDeletePaymentById = ( params: { params: { paymentId: number } }) => Promise<TPAYMENT_DELETE>
type TPostPaymentById = ( params: TPAYMENT_POST_BODY ) => Promise<TPAYMENT_POST>
type TPatchPaymentById = ( params: { params: { paymentId: number, updatePayment: TPAYMENT_PATCH_BODY } }) => Promise<TPAYMENT_PATCH>

// FUNCTION DEFINITIONS
export const getPaymentById: TGetPaymentById = async ({ params: { paymentId } }) => {
  const payment = await fetch(import.meta.env.VITE_API + "/pagos/by_id/" + paymentId, {
    method: "GET",
  })
  return payment.json()
}

export const getPayments: TGetPayments = async () => {
  const payment = await fetch("/pagos/list", {
    method: "GET",
  })
  return payment.json()
}

export const postPaymentId: TPostPaymentById = async (newPayment) => {
  const payment = await fetch(import.meta.env.VITE_API + "/pagos/create", {
    method: "POST",
    body: JSON.stringify(newPayment)
  })
  return payment.json()
}

export const potchPaymentById: TPatchPaymentById = async ({ params: { paymentId, updatePayment } }) => {
  const payment = await fetch(import.meta.env.VITE_API + "/pagos/" + paymentId, {
    method: "PATCH",
    body: JSON.stringify(updatePayment)
  })
  return payment.json()
}

export const deletePaymentById: TDeletePaymentById = async ({ params: { paymentId } }) => {
  const payment = await fetch(import.meta.env.VITE_API + "/pagos/delete/" + paymentId, {
    method: "DELETE",
  })
  return payment.json()
}
