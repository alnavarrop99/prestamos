import { TMORA_TYPE } from "@/lib/type/moraType"

const main = {
  title: 'Prestamos:',
  error: 'Ups!!! ha ocurrido un error',
  errorDescription: 'El listado de prestamos ha fallado.',
  back: 'Intente volver a la pestaña anterior',
  browser: 'Prestamos',
  notfound: 'No existen prestamos activos.',
  select: ({ total }: { total: number }) => `${total} credito(s) activos.`,
  pagination: {
    back: 'Anterior',
    next: 'Siguiente',
  },
  alert: {
    info: {
      title: 'Fecha limite',
      description: ({ date }: { date: Date }) =>
        'El cobro se aproxima a su fecha limite ' + date + '.',
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
    pay: 'Numero de cuotas',
    cuote: 'Monto por cuota',
    mora: 'Monto por mora',
    frecuency: 'Frecuencia',
    history: 'Historial de pagos',
  },
  print: {
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
  },
}

const delete_by_id = {
  title: 'Eliminacion de un prestamo',
  alert: {
    title: 'Se eiminara el prestamo de la base de datos',
    description: ({ username }: { username: string }) =>
      'Estas seguro de eliminar prestamo del cliente ' +
      username +
      ' de la basde de datos?. Esta accion es irreversible y se eliminaran todos los datos relacionados con el prestamo.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, elimina el prestamo.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Eliminacion de un credito',
    decription: ({ username }: { username?: string }) =>
      'Se ha eliminado prestamo del cliente ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'La eliminacion del prestamo del cliente ' + username + ' ha fallado',
    retry: 'Reintentar',
  },
}

const news = {
  title: 'Crear prestamo:',
  descriiption:
    'Introdusca los datos correctamente para la creacion de un prestamo en la plataforma',
  error: {
    title: 'Obtencion de datos',
    descriiption: 'Ha ocurrido un error inesperado',
  },
  button: {
    close: 'Cerrar',
    update: 'Crear',
  },
  notification: {
    titile: 'Creacion de un nuevos prestamo',
    decription: ({ username }: { username: string }) =>
      'Se ha creado el prestamo para el usuario ' + username + ' con exito.',
    error: ({ username }: { username: string }) =>
      'Ha fallado la creacion del prestamo para el usuario ' + username + '.',
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
      placeholder: 'Escriba un commentario',
    },
    amount: {
      label: 'Monto:',
      placeholder: 'Monto total del prestamo',
    },
    frecuency: {
      label: 'Frecuencia:',
      placeholder: 'Seleccione una opcion',
      items: ['Anual', 'Quincenal', 'Mensual', 'Semanal'],
    },
    aditionalDays: {
      label: 'Dias Adicionales:',
      placeholder: 'Cantidad de dias',
    },
    date: {
      label: 'Fecha de aprobacion:',
      placeholder: 'Seleccione la fecha',
    },
    interest: {
      label: 'Tasa de Interes:',
      placeholder: 'Porcentaje de interes por cuota',
    },
    installments: {
      label: 'Mora:',
      placeholder: {
        ['Valor fijo' as TMORA_TYPE]: 'Monto adicional en cada cuota',
        ['Porciento' as TMORA_TYPE]: 'Porcentaje adicional en cada cuota',
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
  descriiption: 'Introdusca los datos correctamente para realizar un pago.',
  button: {
    close: 'No, vuelve a la pestaña anterior',
    pay: 'Si, realiza el pago',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Ejecucion de un pago',
    decription: ({ username, number }: { username: string; number: number }) =>
      'Se ha pagado la cuota con un monto de $' +
      number +
      ' del usuario ' +
      username +
      ' con exito.',
    error: (username: string) =>
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
      label: 'Fecha de aprobacion',
      placeholder: 'Seleccione una fecha',
    },
  },
}

const pay_selected = {
  title: 'Realizar un pago:',
  descriiption: 'Introdusca los datos correctamente para realizar un pago.',
  button: {
    close: 'No, vuelve a la pestaña anterior',
    pay: 'Si, realiza el pago',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    titile: 'Ejecucion de un pago',
    decription: ({ username, number }: { username: string; number: number }) =>
      'Se ha pagado la cuota con un monto de $' +
      number +
      ' del usuario ' +
      username +
      ' con exito.',
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
      label: 'Fecha de aprobacion',
      placeholder: 'Seleccione una fecha',
    },
  },
}

const print_by_id = {
  title: 'Opciones de impresion:',
  description: "Seleccione la opcion deseada para la impresion del pago.",
  button: {
    close: 'Volver a la pestaña anterior',
    print: 'Imprimir',
  },
  form: {
    pay: {
      label: 'Numero del pago:',
      placeholder: 'Seleccione el pago',
    },
    options: {
      label: 'Opciones:',
      placeholder: 'Seleccione la opcion de impresion',
      items: [ "Ultimo pago","Pago especifico" ]
    },
  }
}

const print_selected = {
  title: 'Opciones de impresion:',
  description: 'Seleccione la opcion deseada para la impresion del pago.',
  error: {
    title: 'Obtencion de datos',
    descriiption: 'Ha ocurrido un error inesperado',
  },
  button: {
    close: 'Volver a la pestaña anterior',
    print: 'Imprimir',
  },
  form: {
    pay: {
      label: 'Numero del pago:',
      placeholder: 'Seleccione el pago',
    },
    options: {
      label: 'Opciones:',
      placeholder: 'Seleccione la opcion de impresion',
    },
  },
}

const credit_by_id = {
  title: 'Detalles:',
  error: 'Ups!!! ha ocurrido un error',
  errorDescription: 'Los detalles del prestamo ha fallado.',
  back: 'Intente volver a la pestaña anterior',
  button: {
    update: 'Editar',
    delete: 'Eliminar',
  },
  details: {
    title: 'Detalles del prestamo:',
    name: 'Nombre del cliente',
    user: 'Cobrador',
    ref: 'Referencia',
    amount: 'Monto total',
    interest: 'Tasa de interes',
    cuoteNumber: 'Numero de cuotas',
    cuote: 'Monto por cuota',
    pay: 'Monto a pagar',
    installmants: (type: TMORA_TYPE) =>
      type === 'Valor fijo' ? 'Monta por mora' : 'Tasa por mora',
    frecuency: 'Frecuencia del credito',
    status: 'Estado',
    date: 'Fecha de aprobacion',
    comment: 'Comentario',
    cuotes: 'Numero de cuotas',
    aditionalsDays: 'Dias adicionales',
  },
  cuotes: {
    title: 'Historial de pagos:',
    payDate: 'Fecha de pago',
    installmantsDate: 'Fecha de aplicacion de mora',
    payValue: 'Monto del pago',
    payInstallmants: 'Monto de la mora',
    payStatus: 'Pagada',
    total: 'Monto total',
  },
  pay: {
    title: 'Historial de pagos:',
  },
}

const update = {
  title: 'Editar prestamos:',
  error: 'Ups!!! ha ocurrido un error',
  errorDescription: 'Los detalles del prestamo ha fallado.',
  back: 'Intente volver a la pestaña anterior',
  button: {
    update: 'Actualizar',
    close: 'Cancelar',
  },
  notification: {
    titile: 'Actualizacion de un prestamo',
    decription: ({ username }: { username: string }) =>
      'Se ha actualizado el prestamo para el usuario ' +
      username +
      ' con exito.',
    error: 'Error: la actualizacion del prestamo ha fallado',
    undo: 'Deshacer',
  },
  form: {
    details: {
      title: 'Estado del prestamo:',
      amount: {
        label: 'Monto total:',
        placeholder: 'Escriba el nombre del usuario',
      },
      date: {
        label: 'Fecha de aprobacion:',
        placeholder: 'Seleccione la fecha',
      },
      comment: {
        label: 'Comentario:',
        placeholder: 'Escriba un comentario',
      },
      interest: {
        label: 'Tasa de interes:',
        placeholder: 'Escriba la tasa de interes',
      },
      aditionalsDays: {
        label: 'Dias adicionales:',
        placeholder: 'Cantidad de dias adicionales',
      },
      clients: {
        label: 'Cliente:',
        placeholder: 'Escribe | Seleccione el cliente',
      },
      ref: {
        label: 'Garante:',
        placeholder: 'Escribe el garante',
      },
      cuotes: {
        label: 'Numeros de cuotas:',
        placeholder: 'Escribe la cantidad de cuotas',
      },
      users: {
        label: 'Cobrador:',
        placeholder: 'Escribe | Seleccione el cobrador',
      },
      installmants: {
        label: 'Monto de mora:',
        placeholder: {
          ['Valor fijo' as TMORA_TYPE]: 'Monto adicional en cada cuota',
          ['Porciento' as TMORA_TYPE]: 'Porcentaje adicional en cada cuota',
        },
      },
      frecuency: {
        label: 'Frecuencia:',
        placeholder: 'Seleccione una opcion',
        items: ['Anual', 'Quincenal', 'Mensual', 'Semanal'],
      },
    },
    pay: {
      title: 'Listado de pagos:',
      payDate: {
        label: 'Fecha de pago:',
        placeholder: 'Seleccione la fecha',
      },
      installmantsDate: {
        label: 'Fecha de aplicacion de mora:',
        placeholder: 'Seleccione la fecha',
      },
      payValue: {
        label: 'Monto de pago:',
        placeholder: 'Valor del pago',
      },
      comment: {
        label: 'Comentario:',
        placeholder: 'Escribe un comentario',
      },
    },
  },
}

const update_confirmation = {
  title: 'Actualizacion del prestamo',
  alert: {
    title: 'Se actualizara el prestamo de la base de datos',
    description: ({ username }: { username: string }) =>
      'Estas seguro de actualizar el prestamo del cliente ' + username + ' de la basde de datos?. Esta accion es irreversible y se actualizara los datos relacionados con el prestamo.',
  },
  button: {
    close: 'No, vuelve a la pestaña anterior.',
    delete: 'Si, actualiza el prestamo.',
    checkbox: 'Marca la casilla de verificacon para proceder con la accion.',
  },
  notification: {
    payment: {
      titile: 'Actualizacion de un pago',
      decription: ({ username }: { username?: string }) =>
        'Se ha actualizado el pago del cliente ' + username + ' con exito.',
      error: ({ username }: { username: string }) =>
      'Ha fallado la actualizacion pago para el usuario ' + username + '.',
    },
    deletePayment: {
      titile: 'Elminacion de un pago',
      decription: ({ username }: { username?: string }) =>
        'Se ha eliminado el pago del cliente ' + username + ' con exito.',
      error: ({ username }: { username: string }) =>
        'Ha fallado la eliminacion del prestamo para el usuario ' + username + '.',
    },
    credit: {
      titile: 'Actualizacion de un prestamo',
      decription: ({ username }: { username?: string }) =>
        'Se ha actualizado el prestamo del cliente ' + username + ' con exito.',
      error: ({ username }: { username: string }) =>
        'Ha fallado la actualizacion del prestamo para el usuario ' + username + '.',
    },
    retry: 'Reintentar',
  },
}

const credit_table = {
  payDate: 'Fecha de pago',
  installmantsDate: 'Fecha de aplicacion de mora',
  payValue: 'Monto del pago',
  payInstallmants: 'Monto de la mora',
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
  credit_print
}
