
/* eslint-disable-next-line */
type TGetTypeId = (list: any[], params: { id: number }) => any
/* eslint-disable-next-line */
type TGetId = (list: any[], params: { id: number }) => any
/* eslint-disable-next-line */
type TGets = (list: any[]) => any[] 

export const getTypeId: TGetTypeId = (list, { id }) => gets( list )?.find(({ tipo_enumerador_id }) => id === tipo_enumerador_id)
export const getId: TGetId = (list, { id: _id }) => gets( list )?.find(({ id }) => id === _id)
export const gets: TGets = (list) => list
