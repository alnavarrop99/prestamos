type TGetId = (list: any[], params: { id: number }) => any
type TGets = (list: any[]) => any[] 

export const getId: TGetId = (list, { id: _id }) => gets( list )?.find(({ id }) => id === _id)
export const gets: TGets = (list) => list
