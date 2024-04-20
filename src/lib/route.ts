import { useToken } from './context/login'
import { LucideIcon, icons } from 'lucide-react'

export type TTranslete = {
  [k: string]: {
    name: string
    validation: boolean
    icon: LucideIcon
  }
}
export type TSearch = keyof typeof search

export const translate = () => {
  const rol = useToken.getState()?.rol?.rolName
  return {
    '/': { name: 'Home', validation: false, icon: icons.Home },
    '/credit': { name: 'Prestamos', validation: true, icon: icons.CreditCard },
    '/client': { name: 'Clientes', validation: true, icon: icons.Award },
    '/user': {
      name: 'Usuarios',
      validation: rol && rol !== 'Cobrador',
      icon: icons.BookUser,
    },
    '/report': { name: 'Reportes', validation: true, icon: icons.BookA },
    '/notification': {
      name: 'Notificaciones',
      validation: true,
      icon: icons.Notebook,
    },
    '/update': { name: 'Editar', validation: false, icon: icons.Upload },
  } as TTranslete
}

const search = {
  '/user': 'usuarios',
  '/client': 'clientes',
  '/credit': 'prestamos',
}

export const getRoute = ({ pathname }: { pathname: string }) => {
  return pathname?.split('/')?.map((pathname) => {
    if ('/' + pathname === '/update') {
      return {
        name:
          translate()?.['/' + pathname]?.name ?? pathname.replace(/\//g, ''),
        route: undefined,
      }
    }
    return {
      name: translate()?.['/' + pathname]?.name ?? pathname.replace(/\//g, ''),
      route: translate()?.['/' + pathname]?.name ? '/' + pathname : undefined,
    }
  })
}

export const getSearch = ({ pathname }: { pathname?: string }) => {
  const name = search?.[pathname as TSearch]
  if (!pathname || !name) return 'clientes activos ...'
  return name + ' ...'
}
