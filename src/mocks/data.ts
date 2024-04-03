import _payments from '@/mocks/__mock__/PAYMENTS.json'
import _credits from "@/mocks/__mock__/CREDITS.json";
import _clients from '@/mocks/__mock__/CLIENTS.json'
import _cuotes from "@/mocks/__mock__/CUOTES.json"
import _mora from '@/mocks/__mock__/MORA.json'
import _reports from '@/mocks/__mock__/REPORT.json'
import { listRols } from '@/lib/type/rol';
import { faker } from "@faker-js/faker/locale/en"
import type { TUSER_GET } from '@/api/users';
import type { TCLIENT_GET_BASE } from '@/api/clients';
import { listStatus } from '@/lib/type/status';
import { listIds } from '@/lib/type/id';

const CLIENTS_LENGTH = 100
const USERS_LENGTH = 10

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
export type TREPORT_DB = typeof _reports[0]

export const users = new Map<number, TUSER_GET>( Array.from({ length: USERS_LENGTH })?.map<[number, TUSER_GET]>( (_, index) => {
  const id = index + 1
  return ([id, {
    id,
    rol: faker.helpers.arrayElement( listRols()?.map( ({ nombre }) => (nombre) ) ),
    nombre: faker.person.fullName(),
    clientes: []
  }])
} ) )

export const clients = new Map<number, TCLIENT_GET_BASE>( Array.from({ length: CLIENTS_LENGTH })?.map<[number, TCLIENT_GET_BASE]>( (_, index) => {
  const id = index + 1
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const userId = faker.number.int({min: 1, max: USERS_LENGTH})
  return ([id, {
    id,
    referencia_id: faker.helpers.maybe( () => faker.number.int( { min: 1, max: CLIENTS_LENGTH } ), { probability: 0.4 } ) ,
    comentarios: faker.lorem.text(),
    email: faker.internet.email( { firstName, lastName } ),
    estado: faker.helpers.arrayElement( listStatus() ).id,
    celular: faker.phone.number("+33 ###-###-###"),
    telefono: faker.phone.number("+32 ###-###"),
    nombres: firstName,
    apellidos: lastName,
    direccion: faker.location.streetAddress(),
    tipo_de_identificacion:  faker.helpers.arrayElement( listIds() )?.id,
    numero_de_identificacion: faker.string.numeric(10),
    owner_id: userId,
  }])
}))

export const credits = new Map<number, TCREDIT_DB>( _credits?.map<[number,TCREDIT_DB]>( ( { id }, i, list ) => [ id, list?.[i] ] ))
export const cuotes = new Map<number, TCUOTE_DB>( _cuotes?.map( ({ id }, i, list) => [ id, { ...list?.[i], mora: !!list?.[i]?.mora }  ]))
export const moras = new Map<number, TMORA_DB>( _mora?.map( ({ id }, i, list) => [ id, list?.[i] ]))
export const payments = new Map<number, TPAYMENT_DB & { credit_id: number }>( _credits?.map<[number,TPAYMENT_DB & { credit_id: number }]>( ( { id, cuotas: { id: cuoteId } } ) => {
  const cuote = _cuotes?.find( ({ id }) => (id === cuoteId) ) ?? {} as TCUOTE_DB
  const { pago_id } = cuote
  const payment = _payments?.find( ({ id }) => id === pago_id ) ?? {} as TPAYMENT_DB
  return [payment?.id ?? 0, { ...payment, credit_id: id }]
}))



export const reports = new Map<number, TREPORT_DB>( _reports?.map( ( { id }, i, list ) => [ id, (list?.[i]) ] ) )
export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcyNDM4MTMxMn0.p3uaAzSYneGPMwcBbpqIutNGnwMyiyDSBae5TW3X4Es"
