import { type TROLES } from "@/lib/type/rol";

const main = {
  back: 'Atras',
  title: 'Clientes:',
  error: 'Ha ocurrido un error',
  errorDescription: 'El listado de clientes ha fallado.',
  browser: 'Clientes',
  search: {
    404: 'No se encontraron resultados',
    selected: ({ selected, total }: { selected: number; total: number }) =>
      selected + " de " + total + " fila(s) seleccionada(s).",
  },
  columns: {
    fullName: 'Nombre y apellidos',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    id: 'I.D.',
    phone: 'Celular',
    telephone: 'Teléfono',
    ref: 'Referencia',
    direction: 'Dirección',
  },
  buttons: {
    next: 'Siguiente',
    prev: 'Anterior',
    delete: 'Eliminar',
    new: 'Nuevo',
  },
  select: {
    placeholder: 'Seleccione un filtro',
    title: 'Filtros:',
    get items() {
      return main.columns;
    },
  },
  dropdown: {
    title: 'Columnas',
    subtitle: 'Acciones',
    get items() {
      return main.columns;
    },
  },
  menu: {
    aria: 'Más opciones',
    title: 'Acciones:',
    copy: 'Copiar datos del cliente',
    update: 'Ver | Actualizar cliente',
    delete: 'Eliminar cliente',
  },
}

const delete_by_id = {
  title: 'Eliminación del cliente',
  error: {
    title: 'Obtención de datos de usuario',
    description: 'Ha ocurrido un error inesperado',
  },
  alert: {
    title: 'Se eliminará el cliente de la base de datos',
    description: ({ username }: { username: string }) =>
      '¿Estás seguro de eliminar el cliente ' +
      username +
      '? Esta acción es irreversible y se eliminarán todos los datos relacionados con el cliente.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Sí, elimina el cliente.',
    checkbox: 'Marca la casilla de verificación para proceder con la acción.',
  },
  notification: {
    title: 'Eliminación del cliente',
    description: ({ username }: { username: string }) =>
      'Se ha eliminado el cliente ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'La eliminación del cliente ' + username + ' ha fallado.',
    retry: 'Reintentar',
  },
}

const delete_selected = {
  title: 'Eliminación de clientes',
  error: {
    title: 'Obtención de datos de usuario',
    description: 'Ha ocurrido un error inesperado',
  },
  alert: {
    title: 'Se eliminarán múltiples clientes de la base de datos',
    description: ({ length }: { length: number }) =>
      '¿Estás seguro de eliminar ' +
      length +
      ' cliente(s) de la base de datos? Esta acción es irreversible y se eliminarán todos los datos relacionados con los clientes seleccionados.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Sí, elimina los clientes.',
    checkbox: 'Marca la casilla de verificación para proceder con la acción.',
  },
  notification: {
    title: 'Eliminación de múltiples clientes',
    description: ({ username }: { username: string }) =>
      'Se ha eliminado el cliente ' + username + ' con éxito.',
    error: 'Error: la eliminación de los clientes ha fallado.',
    retry: 'Reintentar',
  },
}

const news = {
  title: 'Crear cliente:',
  description:
    'Introduzca los datos correctamente para la creación de un cliente nuevo en la plataforma.',
  button: {
    close: 'Cerrar',
    update: 'Crear',
  },
  notification: {
    title: 'Creación de un nuevo usuario',
    description: ({ username }: { username: string }) =>
      'Se ha creado el cliente ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'La creación del cliente ' + username + ' ha fallado.',
    retry: 'Deshacer',
  },
  form: {
    firstName: {
      label: 'Nombre:',
      placeholder: 'Escriba el nombre',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido',
    },
    phone: {
      label: 'Celular:',
      placeholder: 'Escriba el celular',
    },
    telephone: {
      label: 'Teléfono:',
      placeholder: 'Escriba el teléfono',
    },
    direction: {
      label: 'Dirección:',
      placeholder: 'Escriba la dirección',
    },
    email: {
      label: 'Email:',
      placeholder: 'Escriba el email',
    },
    comment: {
      label: 'Comentarios:',
      placeholder: 'Escriba el comentario',
    },
    id: {
      label: 'ID:',
      placeholder: 'Escriba el ID',
    },
    typeId: {
      label: 'Tipo de identificación:',
      placeholder: 'Seleccione una opción',
      items: {
        passport: 'Pasaporte',
        id: 'Cédula',
        driverId: 'Carnet de Conducir',
      },
    },
    ref: {
      label: 'Referencia:',
      placeholder: 'Escriba la referencia del cliente',
    },
    status: {
      label: 'Estado:',
      placeholder: 'Seleccione el estado del cliente',
    },
  },
}

const update = {
  title: ({ state }: { state: boolean }) =>
    (state ? 'Datos del ' : 'Actualización de los datos del') + ' cliente:',
  description: ({ state }: { state: boolean }) =>
    (state ? 'Datos' : 'Actualización de los datos') +
    ' del cliente en la plataforma.',
  error: {
    title: 'Obtención de datos de usuario',
    description: 'Ha ocurrido un error inesperado',
  },
  button: {
    close: 'Cerrar',
    update: 'Actualizar',
    mode: 'Modo',
  },
  notification: {
    title: 'Actualización del cliente',
    description: ({ username }: { username: string }) =>
      'Se ha actualizado el cliente ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'La actualización del cliente ' + username + ' ha fallado.',
    retry: 'Reintentar',
  },
  form: {
    firstName: {
      label: 'Nombre:',
      placeholder: 'Escriba el nombre',
    },
    lastName: {
      label: 'Apellidos:',
      placeholder: 'Escriba el apellido',
    },
    phone: {
      label: 'Celular:',
      placeholder: 'Escriba el celular',
    },
    telephone: {
      label: 'Teléfono:',
      placeholder: 'Escriba el teléfono',
    },
    direction: {
      label: 'Dirección:',
      placeholder: 'Escriba la dirección',
    },
    id: {
      label: 'ID:',
      placeholder: 'Escriba el ID',
    },
    comment: {
      label: 'Comentarios:',
      placeholder: 'Escriba el comentario',
    },
    typeId: {
      label: 'Tipo de identificación:',
      placeholder: 'Seleccione una opción',
      items: {
        passport: 'Pasaporte',
        id: 'Cédula',
        driverId: 'Carnet de Conducir',
      },
    },
    ref: {
      label: 'Referencia:',
      placeholder: 'Escriba la referencia',
    },
    status: {
      label: 'Estado:',
      placeholder: 'Seleccione el estado',
    },
  },
}

const client_table = {
  menu: {
    aria: 'Más opciones',
    title: 'Acciones:',
    copy: 'Copiar datos del cliente',
    update: ({ rolName }: { rolName?: TROLES }) =>
      rolName === 'Administrador' ? 'Ver | Actualizar' : 'Ver cliente',
    pay: 'Asignar préstamo al cliente',
    delete: 'Eliminar cliente',
  },
  columns: {
    fullName: 'Nombre y apellidos',
    email: 'Correo',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    id: 'I.D.',
    idType: 'Tipo de I.D.',
    phone: 'Celular',
    telephone: 'Teléfono',
    ref: 'Referencia',
    direction: 'Dirección',
    secondDirection: 'Segunda Dirección',
  },
  search: {
    404: 'No se encontraron resultados',
  },
}

export { main, delete_by_id, delete_selected, news, update, client_table }
