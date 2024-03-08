export type TUser = typeof import('@/__mock__/USERS.json')[0]

type TGetUsersId = ( params: { userId: number } ) => Promise<TUserResponse | undefined> 
export const getUserId: TGetUsersId = async ( {userId} ) => {
    try {
      const list = await getUsers() 
      return list?.find( ( { id } ) => id === userId  )
    } catch (error) {
      return undefined;
    }
  }

export interface TUserResponse extends Omit< TUser, "rol" > {
  active: boolean,
  rol: string,
}
type TGetUsers = () => Promise<TUserResponse[] | undefined>
export const getUsers: TGetUsers = async () => {
    try {
      const { default: list } = (await import('@/__mock__/USERS.json'))
      const { default: roles } = (await import('@/__mock__/ROLES.json'))
      return list.map( ({ rol: { id: rolId }, ...items  }) => ({
        rol: roles.find( ( { id } ) => id === rolId  )?.name ?? "Usuario",
        active: false,
        ...items
    }) ) 
    } catch (error) {
      return undefined;
    }
  }

