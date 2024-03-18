import payments from "@/__mock__/PAYMENTS.json"
import { getId, gets } from "./base"

export type TPayment = typeof payments[0]
type TGetPaymentId = (params: { paymentId: number }) => TPayment
type TGetPayments = () => TPayment[]
type TGetPaymentIdRes = ({ params }: { params: { paymentId: string } }) => Promise<TPayment>
type TGetPaymentsRes = () => Promise<TPayment[]>

export const getPaymentId: TGetPaymentId = ({ paymentId, }) => getId( payments, { id: paymentId } )
export const getPayments: TGetPayments = () => gets( payments )
export const getPaymentIdRes: TGetPaymentIdRes = async ({ params: { paymentId, } }) => getPaymentId({ paymentId: Number.parseInt(paymentId) })
export const getPaymentsRes: TGetPaymentsRes = async () => getPayments()

