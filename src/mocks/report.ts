import { HttpResponse, http } from 'msw'
import type { TREPORT_GET, TREPORT_GET_ALL, TREPORT_PARAMS_DATE_TYPE } from '@/api/report'
import { reports, token } from '@/mocks/data'
import { faker } from '@faker-js/faker'

const allReports = http.all(import.meta.env.VITE_API + '/reportes/list', async ({request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  return HttpResponse.json<TREPORT_GET_ALL>(
    Array.from(reports?.values())?.map<TREPORT_GET>(( { id, codigo, nombre, comentario, parametros } ) => ({ 
      id, 
      comentario,
      nombre,
      codigo,
      parametros: parametros?.map( ( { tipo_dato, ...items } ) => ({tipo_dato: tipo_dato as TREPORT_PARAMS_DATE_TYPE, ...items}) )
    }))
  )
})

const getPaymentById = http.post( import.meta.env.VITE_API + '/reportes/obtener_reporte_by_codigo/:codigo', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const reportsData = (await request.json()) as TREPORT_PARAMS_DATE_TYPE
  if( !reportsData ) {
    throw new Error("Fail post request")
  }

  return HttpResponse.json( {
    data1: faker.lorem.text(),
    data2: faker.lorem.text(),
    data3: {
      subData1: faker.lorem.text(),
      subData2: faker.lorem.text(),
      subData3: faker.lorem.text(),
    }
  }, { status: 201 } )
})

export default [
  allReports,
  getPaymentById,
]
