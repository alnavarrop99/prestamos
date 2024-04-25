import { getSearch } from "@/lib/route"
import { icons } from 'lucide-react'

const main = {
  title: import.meta.env.VITE_NAME,
  error: 'Ups!!! Ha ocurrido un error',
  errorDescription: 'La carga de la página ha fallado.',
  retry: 'Intente recargar e inicie sesión',
  loader: {
    user: {
      new: 'Creando usuario',
      update: 'Actualizando usuario',
      delete: 'Eliminando usuario(s)',
      get: 'Cargando usuario(s)',
    },
    client: {
      new: 'Creando cliente',
      update: 'Actualizando cliente',
      delete: 'Eliminando cliente(s)',
      get: 'Cargando cliente(s)',
    },
    credit: {
      new: 'Creando préstamo',
      update: 'Actualizando préstamo',
      delete: 'Eliminando préstamo(s)',
      get: 'Cargando préstamo(s)',
    },
    payment: {
      new: 'Creando pago',
      update: 'Actualizando pago',
      delete: 'Eliminando pago(s)',
      get: 'Cargando pago(s)',
    },
    report: {
      get: 'Cargando reporte(s)',
      post: 'Creando reporte(s)',
    },
  },
  navigation: {
    credit: { title: 'Préstamos', url: '/credit', Icon: icons?.CreditCard },
    client: { title: 'Clientes', url: '/client', Icon: icons?.Award },
    user: { title: 'Usuarios', url: '/user', Icon: icons?.BookUser },
    report: { title: 'Reportes', url: '/report', Icon: icons?.BookA },
  },
  avatar: {
    src: 'https://placehold.co/50x50?text=Hello+World',
    name: 'Admin99',
    description: ({ username }: { username: string }) => username,
  },
  search: {
    placeholder: ({ pathname }: { pathname?: string }) =>
      'Buscar ' + getSearch({ pathname }),
    title: 'Clientes:',
    current: 'actual',
  },
  footer: {
    copyright: 'Todos los derechos reservados',
    description: 'Compañía de créditos comerciales independiente',
  },
}

const loader = {
    user: {
    new: 'Creando usuario',
    update: 'Actualizando usuario',
    delete: 'Eliminando usuario(s)',
    get: 'Cargando usuario(s)',
  },
  client: {
    new: 'Creando cliente',
    update: 'Actualizando cliente',
    delete: 'Eliminando cliente(s)',
    get: 'Cargando cliente(s)',
  },
  credit: {
    new: 'Creando préstamo',
    update: 'Actualizando préstamo',
    delete: 'Eliminando préstamo(s)',
    get: 'Cargando préstamo(s)',
  },
  payment: {
    new: 'Creando pago',
    update: 'Actualizando pago',
    delete: 'Eliminando pago(s)',
    get: 'Cargando pago(s)',
  },
  report: {
    get: 'Cargando reporte(s)',
    post: 'Creando reporte(s)',
  },
  search: {
    placeholder: ({ pathname }: { pathname?: string }) =>
      'Buscar ' + getSearch({ pathname }),
    title: 'Clientes:',
    current: 'actual',
  },
}

export {
  main,
  loader
}
