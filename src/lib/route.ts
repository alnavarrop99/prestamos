const translate = {
  "/": "Home",
  "/user": "Usuarios",
  "/credit": "Prestamos",
  "/client": "Clientes",
  "/notification": "Notificaciones",
  "/report": "Reportes",
  "/update": "Editar",
}

const search = {
  "/user": "usuarios",
  "/client": "clientes",
}

export type TTranslete = keyof typeof translate
export type TSearch = keyof typeof search

export const getRoute = ( {pathname}: {pathname: string} ) => {
  return pathname?.split("/")?.map( ( pathname => {
    if( ("/" + pathname) === "/update" as TTranslete ){
      return ({
        name: translate?.[("/" + pathname) as TTranslete] ?? pathname.replace(/\//g, ""),
        route: undefined
      })
    }
    return ({
      name: translate?.[("/" + pathname) as TTranslete] ?? pathname.replace(/\//g, ""),
      route: translate?.[("/" + pathname) as TTranslete] ? "/" + pathname : undefined
    })})
  )
}

export const getSearch = ( { pathname }: { pathname?: string } ) => {
  const name = search?.[pathname as TSearch];
  if( !pathname || !name ) return "clientes activos ...";
  return (name + " ...");
}
