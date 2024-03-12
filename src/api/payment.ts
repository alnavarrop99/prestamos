export type TPayment = (typeof import('@/__mock__/PAYMENTS.json'))[0]

type TGetPaymentId = (params: {
  paymentId: number
}) => Promise<TPayment | undefined>
export const getPaymentId: TGetPaymentId = async ({ paymentId }) => {
  try {
    const { default: list } = await import('@/__mock__/PAYMENTS.json')

    return list?.find(({ id }) => id === paymentId)
  } catch (error) {
    return undefined
  }
}

type TGetPayments = () => Promise<TPayment[] | undefined>
export const getPayments: TGetPayments = async () => {
  try {
    const { default: list } = await import('@/__mock__/PAYMENTS.json')
    return list
  } catch (error) {
    return undefined
  }
}
