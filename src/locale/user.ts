const main = {
  title: "Usuarios:",
  error: "Ha ocurrido un error",
  errorDescription: "Ha fallado la obtención del listado de usuarios.",
  back: "Atras",
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
    aria: "Más opciones",
    title: "Acciones:",
    client: "Ver clientes disponibles",
    update: "Actualizar datos del usuario",
    delete: "Eliminar usuario"
  },
  select: ({ select, total }: { select: number; total: number }) =>
    select + " de " + total + " usuario(s) seleccionado(s)."
}

const delete_by_id = {
    title: "Eliminación del usuario",
  alert: {
    title: "Se eliminará el usuario de la base de datos",
    description: ({ username }: { username: string }) =>
      "¿Estás seguro de eliminar el usuario " + username + "? Esta acción es irreversible y se eliminarán todos los datos relacionados con el usuario.",
  },
  button: {
    close: "No, volver a la pestaña anterior.",
    delete: "Sí, eliminar el usuario.",
    checkbox: "Marca la casilla de verificación para proceder con la acción.",
  },
  notification: {
    title: "Eliminación del usuario",
    error: "Error: ha fallado la eliminación de los datos del usuario.",
    description: ({ username }: { username: string }) =>
      "Se ha eliminado el usuario " + username + " con éxito.",
    undo: "Deshacer",
  },
}

const delete_multiple = {
    title: 'Eliminación de usuarios',
  alert: {
    title: 'Se eliminarán múltiples usuarios de la base de datos',
    description: ({ length }: { length: number }) => '¿Estás seguro de eliminar ' + length + ' usuario(s) de la base de datos? Esta acción es irreversible y se eliminarán todos los datos relacionados con los usuarios seleccionados.',
  },
  button: {
    close: 'No, volver a la pestaña anterior.',
    delete: 'Sí, eliminar los usuarios.',
    checkbox: 'Marca la casilla de verificación para proceder con la acción.',
  },
  notification: {
    title: 'Eliminación de múltiples usuarios',
    description: ({ length }: { length?: number }) => 'Se han eliminado ' + length + ' usuarios con éxito.',
    error: 'Error: la eliminación de los usuarios ha fallado',
    retry: 'Reintentar',
  },
}

const update = {
    title: 'Actualizar Usuario:',
  error: {
    title: 'Obtención de datos de usuario',
    description: 'Ha ocurrido un error inesperado',
  },
  description: 'Modifique los campos para actualizar los datos del usuario en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    delete: 'Sí, eliminar mi usuario.',
  },
  notification: {
    title: 'Actualización de usuario',
    description: ({ username }: { username: string }) =>
      'Se ha actualizado el usuario ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'La actualización del usuario ' + username + ' ha fallado',
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
        label: 'Contraseña actual:',
        placeholder: 'Escriba la contraseña actual del usuario',
      },
      new: {
        label: 'Nueva contraseña:',
        placeholder: 'Escriba la nueva contraseña del usuario',
      },
    },
    role: {
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
  description:
    'Introduzca los datos correctamente para la creación de un usuario nuevo en la plataforma.',
  button: {
    close: 'Cerrar',
    create: 'Crear',
  },
  notification: {
    title: 'Creación de un nuevo usuario',
    description: ({ username }: { username: string }) =>
      'Se ha creado el usuario ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'La creación del usuario ' + username + ' ha fallado.',
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
        label: 'Contraseña:',
        placeholder: 'Escriba la contraseña del usuario',
      },
      confirmation: {
        label: 'Confirmación:',
        placeholder: 'Confirme la contraseña anterior',
      },
    },
    role: {
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
    title: 'Obtención de datos de usuario',
    description: 'Ha ocurrido un error inesperado',
  },
  description: 'Modifique los campos para actualizar los datos del usuario en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    delete: 'Sí, eliminar mi usuario.',
  },
  notification: {
    title: 'Actualización de usuario',
    description: ({ username }: { username: string }) =>
      'Se ha actualizado el usuario ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'La actualización del usuario ' + username + ' ha fallado.',
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
        label: 'Contraseña actual:',
        placeholder: 'Escriba la contraseña actual del usuario',
      },
      new: {
        label: 'Nueva contraseña:',
        placeholder: 'Escriba la nueva contraseña del usuario',
      },
    },
    role: {
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

