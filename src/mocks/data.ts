import type { TUSER_GET } from '@/api/users'
import type { TCLIENT_GET_BASE } from '@/api/clients'
import type { TCREDIT_GET, TCUOTE } from '@/api/credit'
import type { TREPORT_GET } from '@/api/report'
import { listStatus } from '@/lib/type/status'
import { listIds } from '@/lib/type/id'
import { listMoraTypes } from '@/lib/type/moraType'
import { listFrecuencys } from '@/lib/type/frecuency'
import { type TROLES, listRols } from '@/lib/type/rol'
import { add } from 'date-fns'
import { faker } from '@faker-js/faker/locale/en'
import { type TPAYMENT_GET_BASE } from '@/api/payment'

const CLIENTS_LENGTH = 20
const USERS_LENGTH = 12
const CREDITS_LENGTH = 20
const REPORTS_LENGTH = 5

export const currents = new Map<TROLES, TUSER_GET>(
  listRols()?.map<[TROLES, TUSER_GET]>(({ nombre }, index) => {
    const id = index + 1
    return [
      nombre,
      {
        id,
        rol: nombre,
        nombre: faker.person.fullName(),
      },
    ]
  })
)

export const users = new Map<number, TUSER_GET>(
  Array.from({ length: USERS_LENGTH })?.map<[number, TUSER_GET]>((_, index) => {
    const id = index + 1

    const list = [...currents.values()]
    return [
      id,
      {
        id,
        rol:
          list?.[index]?.rol ??
          faker.helpers.arrayElement(listRols()?.map(({ nombre }) => nombre)),
        nombre: list?.[index]?.nombre ?? faker.person.fullName(),
      },
    ]
  })
)

export const clients = new Map<number, TCLIENT_GET_BASE>(
  Array.from({ length: CLIENTS_LENGTH })?.map<[number, TCLIENT_GET_BASE]>(
    (_, index) => {
      const id = index + 1
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const userId = faker.number.int({ min: 1, max: USERS_LENGTH })
      return [
        id,
        {
          id,
          referencia_id: faker.helpers.maybe(
            () => faker.number.int({ min: 1, max: CLIENTS_LENGTH }),
            { probability: 0.4 }
          ),
          comentarios: faker.lorem.text(),
          email: faker.internet.email({ firstName, lastName }),
          estado: faker.helpers.arrayElement(listStatus()).id,
          celular: faker.phone.number('+33 ###-###-###'),
          telefono: faker.phone.number('+32 ###-###'),
          nombres: firstName,
          apellidos: lastName,
          direccion: faker.location.streetAddress(),
          tipo_de_identificacion: faker.helpers.arrayElement(listIds())?.id,
          numero_de_identificacion: faker.string.numeric(10),
          owner_id: userId,
        },
      ]
    }
  )
)

export const credits = new Map<number, TCREDIT_GET>(
  Array.from({ length: CREDITS_LENGTH })?.map<[number, TCREDIT_GET]>(
    (_, index) => {
      const id = index + 1
      const mora = faker.helpers.arrayElement(listMoraTypes())
      const moraPorcent = faker.number.float({
        min: 1,
        max: 100,
        multipleOf: 0.25,
      })
      const moraValue = faker.number.float({
        min: 50,
        max: 200,
        multipleOf: 5.25,
      })
      const frecuency = faker.helpers.arrayElement(listFrecuencys())
      const ammount = faker.number.float({
        min: 500,
        max: 5000,
        multipleOf: 5.25,
      })
      const aprobeDate = faker.date.between({
        from: new Date('2024'),
        to: new Date(),
      })
      const aditionalDays = faker.number.int(10)
      const interest = faker.number.float({ min: 0, max: 30, multipleOf: 0.25 })
      const user = faker.helpers.arrayElement([...users.values()])
      const cuotesLength = faker.number.int(12)
      const paymentsLength = faker.number.int(
        Math.abs(cuotesLength - faker.number.int(12))
      )
      const cuotes = new Map<number, TCUOTE>(
        Array.from({ length: cuotesLength })?.map<[number, TCUOTE]>(
          (_, index) => {
            const _id = id + index + 1
            const payDate = faker.date.soon({
              refDate: aprobeDate,
              days: index + 1 + index + 1 * faker.number.int(index + 1),
            })

            const moraDate = add(new Date(payDate), { days: aditionalDays })
            const cuoteAmmount = Math.ceil(ammount / cuotesLength)

            const payMora = faker.helpers.maybe(
              () =>
                mora.nombre === 'Valor fijo'
                  ? moraValue
                  : cuoteAmmount + (cuoteAmmount * moraPorcent) / 100,
              { probability: 0.4 }
            )
            const pay =
              cuoteAmmount +
              (cuoteAmmount * interest) / 100 +
              (index < paymentsLength && !!payMora ? payMora : 0)
            return [
              index + 1,
              {
                id: index + 1,
                numero_de_cuota: _id,
                credito_id: id,
                fecha_de_pago: payDate.toISOString(),
                valor_de_cuota: cuoteAmmount,
                valor_pagado: pay,
                fecha_de_aplicacion_de_mora: moraDate.toISOString(),
                valor_de_mora:
                  !!payMora && index < paymentsLength ? payMora : 0,
                pagada: index <= paymentsLength ? true : false,
              },
            ]
          }
        )
      )
      const payments = new Map<number, TPAYMENT_GET_BASE>(
        [...cuotes?.values()]?.map<[number, TPAYMENT_GET_BASE]>(
          ({ id: paymentId, fecha_de_pago, valor_pagado, pagada }) => {
            const _id = id + paymentId + 1
            if (!pagada)
              return [
                paymentId,
                {
                  id: _id,
                  fecha_de_pago,
                  comentario: '',
                  credito_id: id,
                  valor_del_pago: valor_pagado,
                  registrado_por_usuario_id: user?.id,
                },
              ]
            return [
              paymentId,
              {
                id: _id,
                fecha_de_pago,
                comentario: faker.lorem.text(),
                credito_id: id,
                valor_del_pago: valor_pagado,
                registrado_por_usuario_id: user?.id,
              },
            ]
          }
        )
      )

      return [
        id,
        {
          fecha_de_aprobacion: aprobeDate.toISOString(),
          id,
          owner_id: faker.helpers.arrayElement([...clients?.values()])?.id ?? 1,
          monto: ammount,
          estado: faker.helpers?.arrayElement(listStatus())?.id,
          comentario: faker.lorem.text(),
          cobrador_id: faker.helpers.arrayElement([...users?.values()])?.id,
          garante_id:
            faker.helpers.maybe(
              () => faker.helpers.arrayElement([...clients?.values()])?.id,
              { probability: 0.6 }
            ) ?? null,
          tipo_de_mora_id: mora?.id,
          valor_de_mora: mora.nombre === 'Valor fijo' ? moraValue : moraPorcent,
          tasa_de_interes: interest,
          dias_adicionales: aditionalDays,
          numero_de_cuotas: cuotesLength,
          frecuencia_del_credito_id: frecuency?.id,
          cuotas: [...cuotes?.values()],
          tipo_de_mora: mora,
          frecuencia_del_credito: frecuency,
          pagos: [...payments?.values()],
        },
      ]
    }
  )
)

export const reports = new Map<number, TREPORT_GET>(
  Array.from({ length: REPORTS_LENGTH })?.map<[number, TREPORT_GET]>(
    (_, index) => {
      const id = index + 1
      return [
        id,
        {
          id,
          codigo: faker.hacker.abbreviation(),
          nombre: faker.hacker.adjective(),
          comentario: faker.lorem.text(),
          parametros: Array.from({ length: faker.number.int(4) })?.map(
            (_, index) => ({
              nombre: faker.hacker.verb(),
              codigo: faker.hacker.abbreviation(),
              id: index + 1,
              tipo_dato: faker.helpers.arrayElement([
                'number',
                'str',
                'date',
                'like',
              ]),
              obligatorio: faker.datatype.boolean(0.7),
            })
          ),
        },
      ]
    }
  )
)

const paymentList = [...credits?.values()]
  ?.map<TPAYMENT_GET_BASE[]>(({ pagos }) => pagos)
  .flat() as TPAYMENT_GET_BASE[]
export const payments = new Map<number, TPAYMENT_GET_BASE>(
  paymentList?.map<[number, TPAYMENT_GET_BASE]>(({ id }, i, list) => [
    id ?? i + 1,
    list?.[i],
  ])
)

export const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcyNDM4MTMxMn0.p3uaAzSYneGPMwcBbpqIutNGnwMyiyDSBae5TW3X4Es'
