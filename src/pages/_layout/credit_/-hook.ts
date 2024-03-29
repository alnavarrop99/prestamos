import { type TCREDIT_GET, TCREDIT_GET_FILTER_ALL, TCREDIT_GET_ALL } from '@/api/credit'
import { create } from 'zustand'

/* eslint-disable-next-line */
type TCreditsContext = {
  creditById?: TCREDIT_GET
  creditsAll?: TCREDIT_GET_ALL
  creditsFilter?: TCREDIT_GET_FILTER_ALL
  setCreditById: ( creditById: TCREDIT_GET ) => void
  setCreditsAll: ( creditsAll: TCREDIT_GET_ALL ) => void
  setCreditsFilter: ( creditsFilter: TCREDIT_GET_FILTER_ALL ) => void
}

export const useContextCredit = create<TCreditsContext>()(( set, get ) => ( { 
    setCreditById: ( creditById ) => {
      const { creditsAll, creditsFilter: creditsAllFilter } = get()
      set( () => ({ creditById }))
      set( () => ( { creditsAll: creditsAll?.map( ({ id }, i, list) => {
        if( id === creditById?.id ) return creditById;
        return list?.[i]
      } ) } ) )
      set( () => ( { creditsFilter: creditsAllFilter?.map( ({ id,  }, i, list) => {
        const {
          valor_de_cuota,
          monto,
          fecha_de_cuota,
          valor_de_mora,
          numero_de_cuota,
          numero_de_cuotas,
          nombre_del_cliente,
          frecuencia_del_credito: { id: frecuencyId, nombre, tipo_enumerador_id },
          owner_id
        } = creditById
        if( id === creditById?.id ) return ({ 
          id,
          valor_de_cuota,
          monto,
          fecha_de_cuota,
          valor_de_mora,
          numero_de_cuota,
          numero_de_cuotas,
          nombre_del_cliente,
          frecuencia: { id: frecuencyId, nombre, tipo_enumerador_id },
          cliente_id: owner_id,
        });
        return list?.[i]
      } ) } ) )
    },
    setCreditsAll: ( creditsAll ) => {
      set( () => ({ creditsAll }) )
      set( () => ({ creditsFilter: creditsAll?.map( ({ 
          id,
          valor_de_cuota,
          monto,
          fecha_de_cuota,
          valor_de_mora,
          numero_de_cuota,
          numero_de_cuotas,
          nombre_del_cliente,
          owner_id,
          frecuencia_del_credito: { id: frecuencyId, nombre, tipo_enumerador_id }
      }) => ({
          id,
          valor_de_cuota,
          monto,
          fecha_de_cuota,
          valor_de_mora,
          numero_de_cuota,
          numero_de_cuotas,
          nombre_del_cliente,
          cliente_id: owner_id,
          frecuencia: { id: frecuencyId, nombre, tipo_enumerador_id },
      }))}))
    },
    setCreditsFilter: ( creditsFilter ) => {
      set( () => ({ creditsFilter }) )
      set( () => ({ creditsAll: creditsFilter?.map( ({ 
        id,
        valor_de_cuota,
        monto,
        fecha_de_cuota,
        valor_de_mora,
        numero_de_cuota,
        numero_de_cuotas,
        nombre_del_cliente,
        cliente_id,
        frecuencia,
      }) => ({
        id,
        valor_de_cuota,
        monto,
        fecha_de_cuota,
        valor_de_mora,
        numero_de_cuota,
        numero_de_cuotas,
        nombre_del_cliente,
        // TODO: 
        frecuencia_del_credito: frecuencia,
        cobrador_id: 0,
        fecha_de_aprobacion: new Date(),
        dias_adicionales: 0,
        tipo_de_mora_id: 0,
        tasa_de_interes: 0,
        tipo_de_mora: {
          id: 0,
          tipo_enumerador_id: 0,
          nombre: "",
        },
        garante_id: 0,
        comentario: "",
        cuotas: [],
        pagos: [],
        estado: 1,
        frecuencia_del_credito_id: 0,
        owner_id: cliente_id,
      }))}))

    } 
}))
