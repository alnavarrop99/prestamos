import payments from '@/__mock__/PAYMENTS.json'
import installmants from '@/__mock__/INSTALLMANTS.json'

import type { TPayment } from '@/api/payment'
import type { TInstallmants } from '@/api/installmants'

export type TCredit = (typeof import('@/__mock__/CREDITS.json'))[0]

type TGetCreditId = (params: {
  creditId: number
}) => Promise<TCredit | undefined>
export const getCreditId: TGetCreditId = async ({ creditId }) => {
  try {
    const list = await getCredits()
    return list?.find(({ id }) => id === creditId)
  } catch (error) {
    return undefined
  }
}

export interface TCreditRes {
  comentario: string
  id: number
  fecha_de_aprobacion: string
  numero_de_cuotas: number
  cantidad: number
  estado: boolean
  dias_adicionales: number
  created_at: string
  porcentaje: number
  frecuencia_del_credito: {
    nombre: string
  }
  cuotas: TInstallmants[]
  pagos: TPayment[]
}
type TGetCredits = () => Promise<TCreditRes[] | undefined>
export const getCredits: TGetCredits = async () => {
  try {
    const { default: list } = await import('@/__mock__/CREDITS.json')
    return list.map(({ pagos, cuotas, ...props }) => ({
      ...props,
      pagos: pagos.map(({ id }) =>
        payments.find(({ id: paymentId }) => id === paymentId)
      ) as TPayment[],
      cuotas: cuotas.map(({ id }) =>
        installmants.find(({ id: installmantId }) => id === installmantId)
      ) as TInstallmants[],
    }))
  } catch (error) {
    return undefined
  }
}
