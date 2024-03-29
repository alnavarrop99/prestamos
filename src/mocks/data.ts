import _payments from '@/mocks/__mock__/PAYMENTS.json'
import _credits from "@/mocks/__mock__/CREDITS.json";
import _clients from '@/mocks/__mock__/CLIENTS.json'
import _cuotes from "@/mocks/__mock__/CUOTES.json"
import _users from '@/mocks/__mock__/USERS.json'
import _mora from '@/mocks/__mock__/MORA.json'

export type TClIENT_DB = typeof _clients[0]
export type TCREDIT_DB = typeof _credits[0]
export type TCUOTE_DB = {
  mora: boolean;
  id: number;
  fecha_de_pago: string;
  fecha_de_aplicacion_de_mora: string;
  pago_id: number
}
export type TMORA_DB = typeof _mora[0]
export type TPAYMENT_DB = typeof _payments[0]
export type TUserDB = typeof _users[0]

export const clients = new Map<number, TClIENT_DB>( _clients?.map( ( { id }, i, list ) => ([ id, (list?.[i] ?? {} as TClIENT_DB) ]) ) )

export const credits = new Map<number, TCREDIT_DB>( _credits?.map<[number,TCREDIT_DB]>( ( { id }, i, list ) => [ id, list?.[i] ] ))
export const cuotes = new Map<number, TCUOTE_DB>( _cuotes?.map( ({ id }, i, list) => [ id, { ...list?.[i], mora: !!list?.[i]?.mora }  ]))
export const moras = new Map<number, TMORA_DB>( _mora?.map( ({ id }, i, list) => [ id, list?.[i] ]))
export const payments = new Map<number, TPAYMENT_DB & { credit_id: number }>( _credits?.map<[number,TPAYMENT_DB & { credit_id: number }]>( ( { id, cuotas: { id: cuoteId } } ) => {
  const cuote = _cuotes?.find( ({ id }) => (id === cuoteId) ) ?? {} as TCUOTE_DB
  const { pago_id } = cuote
  const payment = _payments?.find( ({ id }) => id === pago_id ) ?? {} as TPAYMENT_DB
  return [payment?.id ?? 0, { ...payment, credit_id: id }]
}))

export const users = new Map<number, TUserDB>( _users?.map( ( { id }, i, list ) => [ id, (list?.[i]) ] ) )
