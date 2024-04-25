const main = {
    title: "Usuarios:",
    error: "Ups!!! ha ocurrido un error",
    errorDescription: "El listado de usuarios ha fallado.",
    back: "Intente volver a la pestaña anterior",
    pagination: {
      back: "Anterior",
      next: "Siguiente"
    },
    browser: "Usuarios",
    notFound: "No se encontraron usuarios",
    button: {
      create: "Nuevo",
      delete: "Eliminar",
      deactivate: "Desactivar"
    },
    menu: {
      aria: "Mas Opciones",
      title: "Acciones:",
      client: "Ver clientes disponibles",
      update: "Actualizar datos del usuario",
      delete: "Eliminar usuario"
    },
    select: ({ select, total }: { select: number; total: number }) => select + " de " + total + " usuario(s) seleccionados.",
}

const delete_by_id = {
    title: "Eliminación del usuario",
    alert: {
      title: "Se eliminará el usuario de la base de datos",
      description: ({username}:{ username: string }) => "¿Estás seguro de eliminar el usuario " + username + "? Esta acción es irreversible y se eliminarán todos los datos relacionados con el usuario.",
    },
    button: {
      close: "No, vuelve a la pestaña anterior.",
      delete: "Sí, elimina el usuario.",
      checkbox: "Marca la casilla de verificación para proceder con la acción."
    },
    notification: {
      title: "Eliminación del usuario",
      error: "Error: la eliminación de los datos del usuario ha fallado",
      description: ({ username }:{ username: string }) => "Se ha eliminado el usuario " + username + " con éxito.",
      undo: "Deshacer"
    }
}

const delete_multiple = {
  title: 'Eliminacion de usuarios',
  alert: {
    title: 'Se eliminara multiples usuarios de la base de datos',
    description: ({ length }: { length: number }) => 'Estas seguro de eliminar ' + length + ' usuario(s) de la basde de datos?. Esta accion es irreversible y se eliminaran todos los datos relacionados con los usuarios seleccionados.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, elimina los usuarios.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Eliminacion de multiples usuarios',
    decription: ({ length }: { length?: number }) => 'Se han eliminado ' + length + ' usuarios con exito.',
    error: 'Error: la eliminacion de los usuarios ha fallado',
    retry: 'Reintentar',
  },
}

const update = {
  title: 'Actualizar Usuario:',
  error: {
    title: 'Obtencion de datos de usuario',
    descriiption: 'Ha ocurrido un error inesperado',
  },
  descriiption:
    'Modifique los campos para actualizar los datos del usuario en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    delete: 'Si, eliminar mi usuario.',
  },
  notification: {
    titile: 'Actualizacion de usuario',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizacion el usuario ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La actualizacion del usuario ' + username + ' ha fallado',
    retry: 'Reintentar',
  },
  form: {
    firstName: {
      label: 'Nombre:',
      placeholder: 'Escriba el nombre del usuario',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido del usuario',
    },
    password: {
      current: {
        label: 'Nueva contraseña:',
        placeholder: 'Escriba la cantraseña actual del usuario',
      },
      new: {
        label: 'Confirmar contraseña:',
        placeholder: 'Escriba la nuva cantraseña del usuario',
      },
    },
    rol: {
      label: 'Tipo de rol:',
      placeholder: 'Seleccione el rol del usuario',
      items: {
        user: 'Usuario',
        admin: 'Administrador',
        client: 'Cliente',
      },
    },
  },
}

const news = {
  title: 'Crear Usuario:',
  descriiption:
    'Introdusca los datos correctamente para la creacion de un usuario nuevo en la plataforma',
  button: {
    close: 'Cerrar',
    update: 'Crear',
  },
  notification: {
    titile: 'Creacion de un nuevos usuario',
    decription: ({ username }: { username: string }) =>
      'Se ha creado el usuario ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La creacion del usuario ' + username + ' ha fallado',
    retry: 'Deshacer',
  },
  form: {
    firstName: {
      label: 'Nombre:',
      placeholder: 'Escriba el nombre del usuario',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido del usuario',
    },
    password: {
      current: {
        label: 'Contraseña:',
        placeholder: 'Escriba la cantraseña del usuario',
      },
      confirmation: {
        label: 'Confirmacion:',
        placeholder: 'Confirme la cantraseña anterior',
      },
    },
    rol: {
      label: 'Tipo de rol:',
      placeholder: 'Seleccione el rol del usuario',
      items: {
        user: 'Usuario',
        admin: 'Administrador',
        client: 'Cliente',
      },
    },
  },
}

const info = {
  title: 'Actualizar Usuario:',
  error: {
    title: 'Obtencion de datos de usuario',
    descriiption: 'Ha ocurrido un error inesperado',
  },
  descriiption:
    'Modifique los campos para actualizar los datos del usuario en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    delete: 'Si, eliminar mi usuario.',
  },
  notification: {
    titile: 'Actualizacion de usuario',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizacion el usuario ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La actualizacion del usuario' + username + 'ha fallado',
    retry: 'Reintentar',
  },
  form: {
    firstName: {
      label: 'Nombre:',
      placeholder: 'Escriba el nombre del usuario',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido del usuario',
    },
    password: {
      current: {
        label: 'Nueva contraseña:',
        placeholder: 'Escriba la cantraseña actual del usuario',
      },
      new: {
        label: 'Confirmar contraseña:',
        placeholder: 'Escriba la nuva cantraseña del usuario',
      },
    },
    rol: {
      label: 'Tipo de rol:',
      placeholder: 'Seleccione el rol del usuario',
      items: {
        user: 'Usuario',
        admin: 'Administrador',
        client: 'Cliente',
      },
    },
  },

}

export {
  main,
  delete_by_id,
  delete_multiple,
  update,
  news,
  info
}

