import { TMORA_TYPE } from '@/lib/type/moraType'

const main = {
  title: 'Préstamos:',
  error: 'Ha ocurrido un error',
  errorDescription: 'Ha fallado la obtención del listado de préstamos.',
  back: 'Atras',
  browser: 'Préstamos',
  notfound: 'No existen préstamos activos.',
  select: ({ total }: { total: number }) => `${total} crédito(s) activo(s).`,
  pagination: {
    back: 'Anterior',
    next: 'Siguiente',
  },
  alert: {
    info: {
      title: 'Fecha límite',
      description: ({ date }: { date: Date }) =>
        'El cobro se aproxima a su fecha límite: ' + date + '.',
    },
    warn: {
      title: 'Cliente en estado moroso',
    },
  },
  button: {
    create: 'Nuevo',
    delete: 'Eliminar',
    deactivate: 'Desactivar',
  },
  details: {
    pay: 'Número de cuotas',
    cuote: 'Monto por cuota',
    mora: 'Monto por mora',
    frequency: 'Frecuencia',
    history: 'Historial de pagos',
  },
  print: {
    title: 'Comprobante de pago',
    client: 'Cliente',
    ssn: 'Cédula',
    telephone: 'Teléfono',
    phone: 'Celular',
    date: 'Fecha',
    pay: 'Pago de cuota',
    mora: 'Mora',
    cuoteNumber: 'Número de cuota',
    pending: 'Pendiente',
    comment: 'Comentario',
    services: 'Servicios',
  },
}

const delete_by_id = {
  title: 'Eliminación de un préstamo',
  alert: {
    title: 'Se eliminará el préstamo de la base de datos',
    description: ({ username }: { username: string }) =>
      '¿Estás seguro de eliminar el préstamo del cliente ' +
      username +
      ' de la base de datos? Esta acción es irreversible y se eliminarán todos los datos relacionados con el préstamo.',
  },
  button: {
    close: 'No, volver a la pestaña anterior.',
    delete: 'Sí, eliminar el préstamo.',
    checkbox: 'Marca la casilla de verificación para proceder con la acción.',
  },
  notification: {
    title: 'Eliminación de un crédito',
    description: ({ username }: { username?: string }) =>
      'Se ha eliminado el préstamo del cliente ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'La eliminación del préstamo del cliente ' + username + ' ha fallado.',
    retry: 'Reintentar',
  },
}

const news = {
  title: 'Crear préstamo:',
  description:
    'Introduzca los datos correctamente para la creación de un préstamo en la plataforma.',
  error: {
    title: 'Obtención de datos',
    description: 'Ha ocurrido un error inesperado.',
  },
  fotter: {
    ammount: 'Monto Total',
    cuote: 'Valor cuota',
  },
  button: {
    close: 'Cerrar',
    update: 'Crear',
  },
  notification: {
    title: 'Creación de un nuevo préstamo',
    description: ({ username }: { username: string }) =>
      'Se ha creado el préstamo para el usuario ' + username + ' con éxito.',
    error: ({ username }: { username: string }) =>
      'Ha fallado la creación del préstamo para el usuario ' + username + '.',
    retry: 'Reintentar',
  },
  form: {
    cliente: {
      label: 'Cliente:',
      placeholder: 'Nombre del cliente',
    },
    ref: {
      label: 'Garante:',
      placeholder: 'Nombre del garante del cliente',
    },
    user: {
      label: 'Cobrador:',
      placeholder: 'Nombre del cobrador',
    },
    comment: {
      label: 'Comentario:',
      placeholder: 'Escriba un comentario',
    },
    amount: {
      label: 'Monto:',
      placeholder: 'Monto total del préstamo',
    },
    frequency: {
      label: 'Frecuencia:',
      placeholder: 'Seleccione una opción',
      items: ['Anual', 'Quincenal', 'Mensual', 'Semanal'],
    },
    additionalDays: {
      label: 'Días Adicionales:',
      placeholder: 'Cantidad de días',
    },
    date: {
      label: 'Fecha de aprobación:',
      placeholder: 'Seleccione la fecha',
    },
    interest: {
      label: 'Tasa de Interés:',
      placeholder: 'Porcentaje de interés por cuota',
    },
    installments: {
      label: 'Mora:',
      placeholder: {
        ['Valor fijo' as TMORA_TYPE]: 'Monto adicional en cada cuota',
        ['Porcentaje' as TMORA_TYPE]: 'Porcentaje adicional en cada cuota',
      },
    },
    cuote: {
      label: 'Cuotas:',
      placeholder: 'Cantidad de cuotas',
    },
  },
}

const pay_by_id = {
  title: 'Realizar un pago:',
  description: 'Introduzca los datos correctamente para realizar un pago.',
  button: {
    close: 'No, volver a la pestaña anterior',
    pay: 'Sí, realiza el pago',
    checkbox: 'Marca la casilla de verificación para proceder con la acción.',
  },
  notification: {
    title: 'Ejecución de un pago',
    description: ({ username, number }: { username: string; number: number }) =>
      'Se ha pagado la cuota con un monto de $' +
      number +
      ' del usuario ' +
      username +
      ' con éxito.',
    error: (username: string) =>
      'Ha fallado el pago de la cuota del usuario ' + username + '.',
    retry: 'Reintentar',
  },
  form: {
    amount: {
      label: 'Cantidad:',
      placeholder: 'Monto a pagar',
    },
    comment: {
      label: 'Comentario:',
      placeholder: 'Escriba un comentario',
    },
    date: {
      label: 'Fecha de pago:',
      placeholder: 'Seleccione una fecha',
    },
  },
}

const pay_selected = {
  title: 'Realizar un pago:',
  description: 'Introduzca los datos correctamente para realizar un pago.',
  button: {
    close: 'No, vuelve a la pestaña anterior',
    pay: 'Sí, realiza el pago',
    checkbox: 'Marque la casilla de verificación para proceder con la acción.',
  },
  notification: {
    title: 'Ejecución de un pago',
    description: ({ username, number }: { username: string; number: number }) =>
      'Se ha pagado la cuota con un monto de $' +
      number +
      ' del usuario ' +
      username +
      ' con éxito.',
    error: ({ username }: { username: string }) =>
      'Ha fallado el pago de la cuota del usuario ' + username,
    retry: 'Reintentar',
  },
  form: {
    amount: {
      label: 'Cantidad:',
      placeholder: 'Monto a pagar',
    },
    comment: {
      label: 'Comentario',
      placeholder: 'Escriba un comentario',
    },
    date: {
      label: 'Fecha de pago',
      placeholder: 'Seleccione una fecha',
    },
  },
}

const print_by_id = {
  title: 'Opciones de impresión:',
  description: 'Seleccione la opción deseada para la impresión del pago.',
  button: {
    close: 'Volver a la pestaña anterior',
    print: 'Imprimir',
  },
  form: {
    pay: {
      label: 'Número del pago:',
      placeholder: 'Seleccione el pago',
    },
    options: {
      label: 'Opciones:',
      placeholder: 'Seleccione la opción de impresión',
      items: ['Último pago', 'Pago específico'],
    },
  },
}

const print_selected = {
  title: 'Opciones de impresión:',
  description: 'Seleccione la opción deseada para la impresión del pago.',
  error: {
    title: 'Obtención de datos',
    description: 'Ha ocurrido un error inesperado',
  },
  button: {
    close: 'Volver a la pestaña anterior',
    print: 'Imprimir',
  },
  form: {
    pay: {
      label: 'Número del pago:',
      placeholder: 'Seleccione el pago',
    },
    options: {
      label: 'Opciones:',
      placeholder: 'Seleccione la opción de impresión',
    },
  },
}

const credit_by_id = {
  title: 'Detalles:',
  error: 'Ha ocurrido un error',
  errorDescription: 'Ha fallado la obtención de los detalles del préstamo.',
  back: 'Atras',
  button: {
    update: 'Editar',
    delete: 'Eliminar',
  },
  details: {
    title: 'Detalles del préstamo:',
    name: 'Nombre del cliente',
    user: 'Cobrador',
    ref: 'Garante',
    amount: 'Monto prestamo',
    interest: 'Tasa de interés',
    cuoteNumber: 'Número de cuotas',
    cuote: 'Próxima Cuota',
    pending: 'Pendiente',
    pay: 'Monto a pagar',
    installments: (type: TMORA_TYPE) =>
      type === 'Valor fijo' ? 'Monto por mora' : 'Tasa por mora',
    frequency: 'Frecuencia del crédito',
    status: 'Estado',
    date: 'Fecha de aprobación',
    comment: 'Comentario',
    cuotes: 'Número de cuotas',
    additionalDays: 'Días adicionales',
  },
  cuotes: {
    title: 'Historial de pagos:',
    payDate: 'Fecha de pago',
    installmentsDate: 'Fecha de aplicación de mora',
    payValue: 'Monto del pago',
    payInstallments: 'Monto de la mora',
    payStatus: 'Pagada',
    total: 'Monto total',
  },
  pay: {
    title: 'Historial de pagos:',
  },
}

const update = {
  title: 'Editar préstamos:',
  error: 'Ha ocurrido un error',
  errorDescription: 'Ha fallado la obtención de los detalles del préstamo.',
  back: 'Atras',
  button: {
    update: 'Actualizar',
    close: 'Cancelar',
  },
  notification: {
    title: 'Actualización de un préstamo',
    description: ({ username }: { username: string }) =>
      'Se ha actualizado el préstamo para el usuario ' +
      username +
      ' con éxito.',
    error: 'Error: la actualización del préstamo ha fallado',
    undo: 'Deshacer',
  },
  form: {
    details: {
      title: 'Estado del préstamo:',
      amount: {
        label: 'Monto total:',
        placeholder: 'Escriba el monto total',
      },
      date: {
        label: 'Fecha de aprobación:',
        placeholder: 'Seleccione la fecha de aprobación',
      },
      comment: {
        label: 'Comentario:',
        placeholder: 'Escriba un comentario',
      },
      interest: {
        label: 'Tasa de interés:',
        placeholder: 'Escriba la tasa de interés',
      },
      additionalDays: {
        label: 'Días adicionales:',
        placeholder: 'Cantidad de días adicionales',
      },
      clients: {
        label: 'Cliente:',
        placeholder: 'Escriba o seleccione el cliente',
      },
      guarantor: {
        label: 'Garante:',
        placeholder: 'Escriba el garante',
      },
      cuotes: {
        label: 'Número de cuotas:',
        placeholder: 'Escriba la cantidad de cuotas',
      },
      users: {
        label: 'Cobrador:',
        placeholder: 'Escriba o seleccione el cobrador',
      },
      installments: {
        label: 'Monto de mora:',
        placeholder: {
          ['Valor fijo' as TMORA_TYPE]: 'Monto adicional en cada cuota',
          ['Porciento' as TMORA_TYPE]: 'Porcentaje adicional en cada cuota',
        },
      },
      frequency: {
        label: 'Frecuencia:',
        placeholder: 'Seleccione una opción',
        items: ['Anual', 'Quincenal', 'Mensual', 'Semanal'],
      },
    },
    pay: {
      title: 'Listado de pagos:',
      payDate: {
        label: 'Fecha de pago:',
        placeholder: 'Seleccione la fecha de pago',
      },
      installmentsDate: {
        label: 'Fecha de aplicación de mora:',
        placeholder: 'Seleccione la fecha de aplicación de mora',
      },
      payValue: {
        label: 'Monto de pago:',
        placeholder: 'Valor del pago',
      },
      comment: {
        label: 'Comentario:',
        placeholder: 'Escriba un comentario',
      },
    },
  },
}

const update_confirmation = {
  title: 'Actualización del préstamo',
  alert: {
    title: 'Se actualizará el préstamo en la base de datos',
    description: ({ username }: { username: string }) =>
      '¿Estás seguro de que deseas actualizar el préstamo del cliente ' +
      username +
      ' en la base de datos? Esta acción es irreversible y actualizará los datos relacionados con el préstamo.',
  },
  button: {
    close: 'No, volver a la pestaña anterior',
    update: 'Sí, actualizar el préstamo',
    checkbox: 'Marca la casilla de verificación para proceder con la acción',
  },
  notification: {
    payment: {
      title: 'Actualización de un pago',
      description: ({ username }: { username?: string }) =>
        'Se ha actualizado el pago del cliente ' + username + ' con éxito.',
      error: ({ username }: { username: string }) =>
        'Ha fallado la actualización del pago para el usuario ' +
        username +
        '.',
    },
    deletePayment: {
      title: 'Eliminación de un pago',
      description: ({ username }: { username?: string }) =>
        'Se ha eliminado el pago del cliente ' + username + ' con éxito.',
      error: ({ username }: { username: string }) =>
        'Ha fallado la eliminación del préstamo para el usuario ' +
        username +
        '.',
    },
    credit: {
      title: 'Actualización de un préstamo',
      description: ({ username }: { username?: string }) =>
        'Se ha actualizado el préstamo del cliente ' + username + ' con éxito.',
      error: ({ username }: { username: string }) =>
        'Ha fallado la actualización del préstamo para el usuario ' +
        username +
        '.',
    },
    retry: 'Reintentar',
  },
}

const credit_table = {
  payDate: 'Fecha de pago',
  installmentsDate: 'Fecha de aplicación de mora',
  payValue: 'Monto del pago',
  payInstallments: 'Monto de la mora',
  payStatus: 'Pagada',
  total: 'Monto total',
}

const credit_print = {
  title: 'Comprobante de pago',
  client: 'Cliente',
  ssn: 'Cédula',
  telephone: 'Teléfono',
  phone: 'Celular',
  date: 'Fecha',
  pay: 'Pago cuota',
  mora: 'Mora',
  cuoteNumber: 'Número de cuota',
  pending: 'Pendiente',
  comment: 'Comentario',
  services: 'Servicios',
}

export {
  news,
  main,
  delete_by_id,
  pay_by_id,
  pay_selected,
  print_by_id,
  print_selected,
  credit_by_id,
  update,
  update_confirmation,
  credit_table,
  credit_print,
}
