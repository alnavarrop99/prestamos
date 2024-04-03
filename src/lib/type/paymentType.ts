import { enumeradores as paymentTypes } from "@/mocks/__mock__/PAYMENT_TYPE.json"
import { getId, gets } from "./base"

export type TPAYMENT_TYPE = "Pasaporte" | "Cédula" | "Carnet de conducir" | "Cédula Extranjera" | "Nit" | "Tarjeta de identidad"
export type TPAYMENT_METHOD = {
  id: number
  nombre: TPAYMENT_TYPE
  tipo_enumerador_id: number
}

type TGetPaymentTypeById = (params: { paymentTypeId: number }) => TPAYMENT_METHOD
type TGetPaymentTypeByName = (params: { paymentTypeName: TPAYMENT_TYPE }) => TPAYMENT_METHOD
type TListPaymentTypes = () => TPAYMENT_METHOD[]

export const getPaymentTypeById: TGetPaymentTypeById = ({ paymentTypeId }) => getId( paymentTypes, { id: paymentTypeId } )
export const getPaymentTypeByName: TGetPaymentTypeByName = ({ paymentTypeName }) => (paymentTypes?.find( ({ nombre }) => nombre === paymentTypeName) ?? paymentTypes?.[0]) as TPAYMENT_METHOD
export const listPaymentTypes: TListPaymentTypes = () => gets( paymentTypes )

