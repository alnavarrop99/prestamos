import { HttpResponse, http } from 'msw'
import { payments } from '@/mocks/payment'
import _credits from '@/mocks/__mock__/CREDITS.json'
import _cuotes from '@/mocks/__mock__/CUOTES.json'
import _mora from '@/mocks/__mock__/MORA.json'
import { clients } from "@/mocks/client"
import type { TCREDIT_DELETE, TCREDIT_GET, TCREDIT_GET_ALL, TCREDIT_GET_FILTER, TCREDIT_GET_FILTER_ALL, TCREDIT_GET_FILTER_BODY, TCREDIT_PATCH, TCREDIT_PATCH_BODY, TCREDIT_POST, TCREDIT_POST_BODY } from '@/api/credit'
import { getFrecuencyById } from '@/api/frecuency'
import { getMoraTypeById } from '@/api/moraType'

export type TCREDIT_DB = typeof _credits[0]
export type TCUOTE_DB = {
  mora: boolean;
  id: number;
  fecha_de_pago: string;
  fecha_de_aplicacion_de_mora: string;
  pago_id: number
}
export type TMORA_DB = typeof _mora[0]
export const credits = new Map<number, TCREDIT_DB>( _credits?.map<[number,TCREDIT_DB]>( ( { id }, i, list ) => [ id, list?.[i] ] ))
export const cuotes = new Map<number, TCUOTE_DB>( _cuotes?.map( ({ id }, i, list) => [ id, { ...list?.[i], mora: !!list?.[i]?.mora }  ]))
export const moras = new Map<number, TMORA_DB>( _mora?.map( ({ id }, i, list) => [ id, list?.[i] ]))

const allCredits = http.all(import.meta.env.VITE_API + '/clientes/list', async () => {
  return HttpResponse.json<TCREDIT_GET_ALL>(
    Array.from(credits?.values())?.map<TCREDIT_GET>(({ 
      id,
      fecha_de_aprobacion,
      pagos: { cantidad: payLength },
      cuotas: { id: cuoteId, cantidad: cuoteLength },
      mora_id,
      cliente_id,
      frecuencia_del_credito_id,
      ...items
      }) => ({ 
      id,
      fecha_de_aprobacion: new Date(fecha_de_aprobacion),
      frecuencia_del_credito_id,
      frecuencia_del_credito: {
        id: getFrecuencyById({ frecuencyId: frecuencia_del_credito_id })?.id ?? 0,
        nombre: getFrecuencyById({ frecuencyId: frecuencia_del_credito_id })?.nombre ?? 0,
        tipo_enumerador_id: getFrecuencyById({ frecuencyId: frecuencia_del_credito_id })?.id ?? 0
      },
      nombre_del_cliente: clients?.get( cliente_id )?.nombres + " " + clients?.get( cliente_id )?.apellidos,
      cuotas: [ ...Array.from({ length: cuoteLength })?.map( (_, i, list) => ({ 
          id: cuoteId + i,
          fecha_de_pago: new Date( cuotes?.get(cuoteId)?.fecha_de_pago ?? "" ),
          pagada: list?.length === i && !cuotes?.get( cuoteId )?.mora,
          credito_id: id,
          valor_pagado: payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0,
          valor_de_mora: moras?.get( mora_id )?.valor_de_mora ?? 0,
          valor_de_cuota: (payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0) - (payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 1) * (items?.tasa_de_interes ?? 1),
          numero_de_cuota: i,
          fecha_de_aplicacion_de_mora: cuotes?.get( cuoteId )?.mora ? new Date( cuotes?.get( cuoteId )?.fecha_de_aplicacion_de_mora ?? 0 ) : undefined
        }) ) ],
      numero_de_cuota: cuoteLength,
      valor_de_cuota: (payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0) - (payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 1) * (items?.tasa_de_interes ?? 1),
      valor_de_mora: moras?.get( mora_id )?.valor_de_mora ?? 0,
      pagos: [ ...Array.from( { length: payLength } )?.map( (_,i) => ({ 
          credito_id: id,
          fecha_de_pago: new Date( payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.fecha_de_pago ?? "" ),
          id: i,
          comentario: payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.comentario ?? "",
          valor_del_pago: payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0,
          registrado_por_usuario_id: 0
        }) )  ],
      tipo_de_mora: {
        id: mora_id,
        tipo_enumerador_id: moras?.get(mora_id)?.tipo_de_mora ?? 0,
        nombre: moras?.get(mora_id)?.nombre ?? ""
      },
      fecha_de_cuota: new Date(),
      tipo_de_mora_id: moras?.get(mora_id)?.tipo_de_mora ?? 0,
      dias_adicionales: Math.trunc(Math.random() * 10),
      numero_de_cuotas: cuoteLength,
      valor_de_la_mora: moras?.get(mora_id)?.valor_de_mora ?? 0,
        ...items
    }))
  )
})

const filterCredits = http.all(import.meta.env.VITE_API + '/creditos/filtrar_prestamos', async ( { request } ) => {
  const { fecha_de_pago, cliente, saldo_en_mora, saldo_por_pagar } = request.json() as TCREDIT_GET_FILTER_BODY
  return HttpResponse.json<TCREDIT_GET_FILTER_ALL>(
    Array.from(credits?.values())?.filter( ({ cuotas: { id: cuoteId }, cliente_id, mora_id, }) => {
      return fecha_de_pago === cuotes?.get( cuoteId )?.fecha_de_pago || 
      cliente === clients?.get( cliente_id )?.nombres + " " + clients?.get( cliente_id )?.apellidos || 
      saldo_en_mora === moras?.get(mora_id)?.valor_de_mora ||
      saldo_por_pagar === payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ||
      !fecha_de_pago || !cliente || !saldo_por_pagar || !saldo_por_pagar
    } )?.map<TCREDIT_GET_FILTER>(({ cuotas: { id: cuoteId, cantidad: cuoteNumber }, mora_id, frecuencia_del_credito_id, cobrador_id, tasa_de_interes }) => ({
      valor_de_la_mora: moras?.get(mora_id)?.valor_de_mora ?? 0,
      frecuencia: {
        id: frecuencia_del_credito_id,
        nombre: getFrecuencyById({ frecuencyId: frecuencia_del_credito_id })?.nombre ?? "",
        tipo_enumerador_id: getFrecuencyById({ frecuencyId: frecuencia_del_credito_id })?.id ?? 0,
      }, 
      fecha_de_cuota: new Date( cuotes?.get( cuoteId )?.fecha_de_pago ?? "" ),
      valor_de_cuota: (payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0) - (payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 1) * (tasa_de_interes ?? 1),
      numero_de_cuota: cuoteNumber,
      nombre_del_cliente: clients?.get(cobrador_id)?.nombres + " " + clients?.get(cobrador_id)?.apellidos,
    }))
  )
})

const createCredit = http.post( import.meta.env.VITE_API + '/creditos/create', async ({ request }) => {
  const newCredit = (await request.json()) as TCREDIT_POST_BODY
  if( !newCredit ) {
    throw new Error("Fail post request")
  }

  const {  owner_id , fecha_de_aprobacion, valor_de_mora, dias_adicionales, numero_de_cuotas, tipo_de_mora_id, ...items } = newCredit
  moras?.set( moras?.size + 1, {
    id: moras?.size + 1,
    valor_de_mora, nombre: getMoraTypeById({ moraTypeId: tipo_de_mora_id })?.nombre,
    tipo_de_mora: tipo_de_mora_id
  } )
  cuotes?.set( cuotes?.size + 1, {
    id: cuotes?.size + 1,
    mora: false,
    fecha_de_pago: new Date()?.toString(),
    pago_id: cuotes?.get(cuotes?.size)?.pago_id ?? 0,
    fecha_de_aplicacion_de_mora: new Date().toString()
  })
  credits?.set( credits?.size + 1, {
    ...items,
    id: (credits?.get(credits?.size)?.id ?? 0) + 1, 
    owner_id,
    fecha_de_aprobacion: fecha_de_aprobacion?.toString(),
    mora_id: moras?.get( moras?.size )?.id ?? 0,
    cliente_id: clients?.get( owner_id )?.id ?? 0,
    garante_id: clients?.get(owner_id)?.referencia_id ?? 0,
    cuotas: {
      id: cuotes?.get( cuotes?.size )?.pago_id ?? 0,
      cantidad: numero_de_cuotas,
    },
    pagos: {
      cantidad: 0
    },
  })

  const { monto, comentario, frecuencia_del_credito_id, tasa_de_interes, garante_id, cobrador_id, estado, id } = credits.get( credits?.size ) ?? {} as TCREDIT_DB
  return HttpResponse.json<TCREDIT_POST>( {
    id,
    estado,
    numero_de_cuotas,
    owner_id,
    cobrador_id,
    tipo_de_mora_id,
    valor_de_mora,
    fecha_de_aprobacion: new Date(fecha_de_aprobacion),
    garante_id,
    tasa_de_interes,
    frecuencia_del_credito_id,
    comentario,
    monto,
    dias_adicionales
  }, { status: 201 } )
} )

const updateCreditById = http.patch( import.meta.env.VITE_API + '/creditos/:credito_id', async ({params, request }) => {
  const upadeteCredit = (await request.json()) as TCREDIT_PATCH_BODY
  const { credito_id } = params as { credito_id?: string }
  if( !upadeteCredit || !credito_id ) {
    throw new Error("Fail update request")
  }

  const creditId = Number.parseInt(credito_id)
  const credit = credits.get( creditId )
  if( !creditId || !credits?.has( creditId ) || !credit ){
    throw new Error("params be a error")
  }

  const {  owner_id , fecha_de_aprobacion, valor_de_mora, dias_adicionales, numero_de_cuotas, tipo_de_mora_id, ...items } = upadeteCredit
  credits?.set( creditId, {
    ...items,
    ...credit,
    id: credit?.id ?? 0, 
    owner_id: owner_id ?? credit?.owner_id ?? 0 ,
    fecha_de_aprobacion: fecha_de_aprobacion?.toString() ?? credit?.fecha_de_aprobacion?.toString() ?? "",
    mora_id: credit?.mora_id ?? 0,
    cliente_id: clients?.get( owner_id ?? 0 )?.id ?? credit?.cliente_id ?? 0,
    garante_id: clients?.get(owner_id ?? 0)?.referencia_id ?? credit?.garante_id ?? 0,
    cuotas: {
      id: credit?.id ?? 0,
      cantidad: numero_de_cuotas ?? credit?.cuotas?.cantidad ?? 0,
    },
    pagos: {
      cantidad: credit?.pagos?.cantidad ?? 0
    },
  })
  moras?.set( credits?.get( creditId )?.mora_id ?? 0, {
    ...( moras?.get( credits?.get( creditId )?.mora_id ?? 0 ) ?? {} as TMORA_DB ),
    nombre: getMoraTypeById({ moraTypeId: tipo_de_mora_id ?? 0 })?.nombre ?? moras?.get( credits?.get( creditId )?.mora_id ?? 0 )?.nombre ?? "",
    tipo_de_mora: tipo_de_mora_id ?? moras.get( credits?.get( creditId )?.mora_id ?? 0 )?.tipo_de_mora ?? 0,
  } )

  return HttpResponse.json<TCREDIT_PATCH>({
    ...items,
    id: credit?.id,
    owner_id: owner_id ?? credit?.owner_id,
    fecha_de_aprobacion: fecha_de_aprobacion ?? new Date(credit?.fecha_de_aprobacion),
    tipo_de_mora_id: tipo_de_mora_id ?? moras?.get( credit?.mora_id )?.tipo_de_mora ?? 0,
    frecuencia_del_credito_id: credit?.frecuencia_del_credito_id,
    dias_adicionales: Math.trunc(Math.random() * 10),
    monto: credit?.monto ,
    comentario: credit?.comentario,
    tasa_de_interes: credit?.tasa_de_interes,
    cobrador_id: credit?.cobrador_id,
    estado: credit?.estado,
    valor_de_mora: moras.get(credit?.mora_id)?.valor_de_mora ?? 0,
    numero_de_cuotas: credit?.cuotas?.cantidad,
  })
} )

const getCreditById = http.get( import.meta.env.VITE_API + '/creditos/by_id/:credito_id', async ({params}) => {
  const { credito_id } = params as { credito_id?: string }
  if( !credito_id ) {
    throw new Error("Fail update request")
  }

  const creditId = Number.parseInt(credito_id)
  const credit = credits.get( creditId )
  if( !creditId || !credits?.has( creditId ) || !credit ){
    throw new Error("params error")
  }

  const { cuotas: { id: cuoteId, cantidad: cuoteLength }, mora_id, fecha_de_aprobacion, cliente_id, garante_id, pagos: { cantidad: payLength }, tasa_de_interes, ...items } = credit
  return HttpResponse.json<TCREDIT_GET>({
    ...items,
    fecha_de_aprobacion: new Date(fecha_de_aprobacion),
    valor_de_mora: moras.get(mora_id)?.valor_de_mora ?? 0, 
    dias_adicionales: Math.trunc(Math.random() * 10),
    tipo_de_mora:{
      id: moras?.get( credit?.mora_id )?.id ?? 0,
      nombre: moras?.get( credit?.mora_id )?.nombre ?? "",
      tipo_enumerador_id: moras?.get( credit?.mora_id )?.id ?? 0,
    },
    tipo_de_mora_id: moras.get(mora_id)?.tipo_de_mora ?? 0,
    numero_de_cuotas: credit?.cuotas?.cantidad, 
    fecha_de_cuota: new Date(cuotes?.get( cuoteId )?.fecha_de_pago ?? "" ) ?? new Date(),
    nombre_del_cliente: clients?.get(cliente_id)?.nombres + " " + clients?.get(cliente_id)?.apellidos,
    numero_de_cuota: cuoteLength,
    valor_de_cuota: payments?.get(cuotes?.get(cuoteId)?.pago_id ?? 0)?.valor_del_pago ?? 0,
    valor_de_la_mora: moras?.get( mora_id )?.valor_de_mora ?? 0,
    tasa_de_interes,
    pagos: [ ...Array.from({ length: cuoteLength })?.map( (_, i) => ( {
      valor_del_pago: payments?.get( creditId )?.valor_del_pago ?? 0,
      id: i,
      fecha_de_pago: new Date(payments?.get( creditId )?.fecha_de_pago ?? ""), 
      comentario: payments?.get( creditId )?.comentario ?? "",
      credito_id: creditId, 
      registrado_por_usuario_id: 0,
    }) ) ],
    cuotas: [ ...Array.from({ length: payLength })?.map((_, i, list) => ( {
      fecha_de_pago: new Date( cuotes?.get( credits?.get( creditId )?.cuotas.id ?? 0 )?.fecha_de_pago ?? "" ),
      id: i,
      credito_id: creditId,
      valor_de_mora: moras?.get( mora_id )?.valor_de_mora ?? 0,
      valor_de_cuota: ( payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0) - ( payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0) * tasa_de_interes,
      numero_de_cuota: cuoteLength,
      pagada: list?.length === i && !cuotes?.get( cuoteId )?.mora,
      valor_pagado:  payments?.get( cuotes?.get( cuoteId )?.pago_id ?? 0 )?.valor_del_pago ?? 0,
      fecha_de_aplicacion_de_mora: new Date()
    })) ],
    garante_id,
    frecuencia_del_credito: {
      id: credit.frecuencia_del_credito_id,
      nombre: getFrecuencyById({ frecuencyId: credit?.frecuencia_del_credito_id })?.nombre,
      tipo_enumerador_id: getFrecuencyById({ frecuencyId: credit?.frecuencia_del_credito_id })?.id
    }
  })
} )

const deleteCreditById = http.delete( import.meta.env.VITE_API + '/creditos/delete/:credito_id', async ( { params } ) => {
  const { credito_id } = params as { credito_id?: string }
  if( !credito_id ) {
    throw new Error("Fail update request")
  }

  const creditId = Number.parseInt(credito_id)
  const credit = credits.get( creditId )
  if( !creditId || !credits?.has( creditId ) || !credit ){
    throw new Error("params be error")
  }

  credits?.delete( creditId )

  const { mora_id, fecha_de_aprobacion, cliente_id, garante_id, tasa_de_interes, ...items } = credit
  return HttpResponse.json<TCREDIT_DELETE>({
    ...items,
    fecha_de_aprobacion: new Date(fecha_de_aprobacion),
    valor_de_mora: moras.get(mora_id)?.valor_de_mora ?? 0, 
    dias_adicionales: Math.trunc(Math.random() * 10),
    tipo_de_mora_id: moras.get(mora_id)?.tipo_de_mora ?? 0,
    numero_de_cuotas: credit?.cuotas?.cantidad, 
    tasa_de_interes,
  })
})

export default [
  allCredits,
  createCredit,
  updateCreditById,
  getCreditById,
  deleteCreditById,
  filterCredits
]
