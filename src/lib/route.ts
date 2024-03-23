const translate = {
  "/": "Home",
  "/user": "Usuarios",
  "/credit": "Prestamos",
  "/client": "Clientes",
  "/notification": "Notificaciones",
  "/report": "Reportes",
  "/update": "Editar",
}

export const getRoute = ( {pathname}: {pathname: string} ) => {
  return pathname?.split("/")?.map( ( pathname => {
    if( ("/" + pathname) === "/update" as keyof typeof translate ){
      return ({
        name: translate?.[("/" + pathname) as keyof typeof translate] ?? pathname.replace(/\//g, ""),
        route: undefined
      })
    }
    return ({
      name: translate?.[("/" + pathname) as keyof typeof translate] ?? pathname.replace(/\//g, ""),
      route: translate?.[("/" + pathname) as keyof typeof translate] ? "/" + pathname : undefined
    })})
  )
}
