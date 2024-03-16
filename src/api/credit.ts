import { default as _credits } from '@/__mock__/CREDITS.json'
import payments from '@/__mock__/PAYMENTS.json'
import installmants from '@/__mock__/INSTALLMANTS.json'
import { getId, gets } from './base'

const credits = _credits.map(({ pagos, cuotas, ...items }) => ({
    ...items,
    pagos: pagos.map(({ id }) =>
      payments.find(({ id: paymentId }) => id === paymentId)
    ),
    cuotas: cuotas.map(({ id }) =>
      installmants.find(({ id: installmantId }) => id === installmantId)
    ),
}))

export type TCredit = typeof credits[0]
type TGetCreditId = ( params: { creditId: number } ) => TCredit
type TGetCredits = () => TCredit[] 
type TGetCreditIdRes = ({params}: { params: { creditId: string } }) => Promise<TCredit>
type TGetCreditsRes = () => Promise<TCredit[]>

export const getCreditId: TGetCreditId = ( {creditId } ) => getId( credits, { id: creditId } )
export const getCredits: TGetCredits = () => gets( credits )
export const getCreditIdRes: TGetCreditIdRes = async ({ params: { creditId} }) => getCreditId({ creditId: Number.parseInt(creditId) })
export const getCreditsRes: TGetCreditsRes =  async () => getCredits()
