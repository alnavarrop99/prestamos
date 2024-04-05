import { HttpResponse, http } from 'msw'
import type { TCREDIT_DELETE, TCREDIT_GET, TCREDIT_GET_ALL, TCREDIT_GET_FILTER, TCREDIT_GET_FILTER_ALL, TCREDIT_GET_FILTER_BODY, TCREDIT_PATCH, TCREDIT_PATCH_BODY, TCREDIT_POST, TCREDIT_POST_BODY, TCUOTE } from '@/api/credit'
import { getFrecuencyById } from '@/lib/type/frecuency'
import { getMoraTypeById } from '@/lib/type/moraType'
import { clients, credits, token } from '@/mocks/data'
import { TPAYMENT_GET_BASE } from '@/api/payment'

const allCredits = http.all(import.meta.env.VITE_API + '/creditos/list', async ({request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  return HttpResponse.json<TCREDIT_GET_ALL>(
    [...credits?.values()]
  )
})

const filterCredits = http.post(import.meta.env.VITE_API + '/creditos/filtrar_prestamos', async ( { request } ) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { fecha_de_pago, cliente, saldo_en_mora, saldo_por_pagar } = (await request.json()) as TCREDIT_GET_FILTER_BODY
  return HttpResponse.json<TCREDIT_GET_FILTER_ALL>(
    [...credits?.values()]?.filter( ({ owner_id, cuotas, pagos }) => {
      return ( cliente && [clients?.get(owner_id)?.nombres, clients?.get(owner_id)?.apellidos]?.includes(cliente) ) || 
      ( saldo_en_mora && [ ...cuotas?.values() ]?.some( ({ valor_de_mora }) => (valor_de_mora > 0) ) ) ||
      ( saldo_por_pagar && pagos.length < cuotas.length ) ||
      ( !fecha_de_pago || !cliente || !saldo_en_mora || !saldo_por_pagar )
    })?.map<TCREDIT_GET_FILTER>(({ id, cuotas, pagos, owner_id, frecuencia_del_credito }) => ({
        id,
        valor_de_cuota: cuotas?.[0]?.valor_de_cuota,
        numero_de_cuota: pagos?.length+1,
        clientId: owner_id,
        fecha_de_cuota: cuotas?.at(pagos?.length + 1)?.fecha_de_pago ?? cuotas?.[0]?.fecha_de_pago,
        valor_de_la_mora: cuotas?.at(pagos?.length + 1)?.valor_de_mora ?? 0,
        nombre_del_cliente: clients?.get(owner_id)?.nombres + " " + clients?.get(owner_id)?.apellidos,
        frecuencia: frecuencia_del_credito
    }))
  )
})

const createCredit = http.post( import.meta.env.VITE_API + '/creditos/create', async ({ request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const newCredit = (await request.json()) as TCREDIT_POST_BODY
  if( !newCredit ) throw new Error("Fail post request")

  credits?.set( credits?.size + 1, {
    ...newCredit,
    id: (credits?.get(credits?.size)?.id ?? 0) + 1, 
    cuotas: [] as TCUOTE[],
    pagos: [] as TPAYMENT_GET_BASE[],
    tipo_de_mora: getMoraTypeById({ moraTypeId: newCredit.tipo_de_mora_id }),
    frecuencia_del_credito: getFrecuencyById({ frecuencyId: newCredit.frecuencia_del_credito_id })
  })

  const credit = credits?.get( credits?.size )
  if(!credit) throw new Error("not add credit")

  return HttpResponse.json<TCREDIT_POST>( {
    id: credit?.id,
    dias_adicionales: credit?.dias_adicionales,
    numero_de_cuotas: credit?.numero_de_cuotas,
    valor_de_mora: credit?.valor_de_mora,
    fecha_de_aprobacion: credit?.fecha_de_aprobacion,
    monto: credit?.monto,
    comentario: credit?.comentario,
    tasa_de_interes: credit?.tasa_de_interes,
    estado: credit?.estado,
    cobrador_id: credit?.cobrador_id,
    owner_id: credit?.cobrador_id,
    garante_id: credit?.garante_id ?? null,
    tipo_de_mora_id: credit?.tipo_de_mora_id,
    frecuencia_del_credito_id: credit?.frecuencia_del_credito_id
  }, { status: 201 } )
} )

const updateCreditById = http.patch( import.meta.env.VITE_API + '/creditos/:credito_id', async ({params, request }) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const updateCredit = (await request.json()) as TCREDIT_PATCH_BODY
  const { credito_id } = params as { credito_id?: string }
  if( !updateCredit || !credito_id ) throw new Error("Fail update request")

  const creditId = +credito_id
  const credit = credits.get( creditId )
  if( !creditId || !credits?.has( creditId ) || !credit ) throw new Error("params be a error")

  credits?.set( creditId, {
    ...credit,
    ...updateCredit,
  })

  return HttpResponse.json<TCREDIT_PATCH>({
    id: credit?.id,
    dias_adicionales: credit?.dias_adicionales,
    numero_de_cuotas: credit?.numero_de_cuotas,
    valor_de_mora: credit?.valor_de_mora,
    fecha_de_aprobacion: credit?.fecha_de_aprobacion,
    monto: credit?.monto,
    comentario: credit?.comentario,
    tasa_de_interes: credit?.tasa_de_interes,
    estado: credit?.estado,
    cobrador_id: credit?.cobrador_id,
    owner_id: credit?.cobrador_id,
    garante_id: credit?.garante_id ?? null,
    tipo_de_mora_id: credit?.tipo_de_mora_id,
    frecuencia_del_credito_id: credit?.frecuencia_del_credito_id
  })
} )

const getCreditById = http.get( import.meta.env.VITE_API + '/creditos/by_id/:credito_id', async ({params, request}) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { credito_id } = params as { credito_id?: string }
  if( !credito_id ) {
    throw new Error("Fail update request")
  }

  const creditId = +credito_id
  const credit = credits.get( creditId )
  if( !creditId || !credits?.has( creditId ) || !credit ) throw new Error("params error")

  return HttpResponse.json<TCREDIT_GET>(credit)
} )

const deleteCreditById = http.delete( import.meta.env.VITE_API + '/creditos/delete/:credito_id', async ( { params, request } ) => {
  const auth = request.headers.get("Authorization")
  if( !auth || !auth.includes(token) ) throw new Error("not auth")

  const { credito_id } = params as { credito_id?: string }
  if( !credito_id ) throw new Error("Fail update request")

  const creditId = +credito_id
  const credit = credits.get( creditId )
  if( !creditId || !credits?.has( creditId ) || !credit ) throw new Error("params be error")

  credits?.delete( creditId )

  return HttpResponse.json<TCREDIT_DELETE>({
    id: credit?.id,
    dias_adicionales: credit?.dias_adicionales,
    numero_de_cuotas: credit?.numero_de_cuotas,
    valor_de_mora: credit?.valor_de_mora,
    fecha_de_aprobacion: credit?.fecha_de_aprobacion,
    monto: credit?.monto,
    comentario: credit?.comentario,
    tasa_de_interes: credit?.tasa_de_interes,
    estado: credit?.estado,
    cobrador_id: credit?.cobrador_id,
    owner_id: credit?.cobrador_id,
    garante_id: credit?.garante_id ?? null,
    tipo_de_mora_id: credit?.tipo_de_mora_id,
    frecuencia_del_credito_id: credit?.frecuencia_del_credito_id
  } )
})

export default [
  allCredits,
  createCredit,
  updateCreditById,
  getCreditById,
  deleteCreditById,
  filterCredits
]
