export type TInstallmants = (typeof import('@/__mock__/INSTALLMANTS.json'))[0]

type TGetInstallmantsId = (params: {
  installmantId: number
}) => Promise<TInstallmants | undefined>
export const getInstallmantId: TGetInstallmantsId = async ({
  installmantId,
}) => {
  try {
    const { default: list } = await import('@/__mock__/INSTALLMANTS.json')

    return list?.find(({ id }) => id === installmantId)
  } catch (error) {
    return undefined
  }
}

type TGetInstallmants = () => Promise<TInstallmants[] | undefined>
export const getInstallmants: TGetInstallmants = async () => {
  try {
    const { default: list } = await import('@/__mock__/INSTALLMANTS.json')
    return list
  } catch (error) {
    return undefined
  }
}
