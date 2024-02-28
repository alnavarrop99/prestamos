declare module '@types' {
  export interface Body_login_users_login_post {
    grant_type?: string
    username: string
    password: string
    scope?: string
    client_id?: string
    client_secret?: string
  }

  export interface Cliente {
    nombres: string
    apellidos: string
    alias: string
    tipo_de_identificacion: number
    numero_de_identificacion: string
    celular: string
    telefono: string
    email: string
    direccion: string
    segunda_direccion: string
    estado: number
    id?: number
    created_at: string
    owner_id?: number
  }

  export interface ClienteCreate {
    nombres: string
    apellidos: string
    alias: string
    tipo_de_identificacion: number
    numero_de_identificacion: string
    celular: string
    telefono: string
    email: string
    direccion: string
    segunda_direccion: string
    estado: number
  }

  export interface ClienteRead {
    nombres: string
    apellidos: string
    alias: string
    tipo_de_identificacion: number
    numero_de_identificacion: string
    celular: string
    telefono: string
    email: string
    direccion: string
    segunda_direccion: string
    estado: number
    id: number
    created_at: string
    owner: {
      nombre: string
      password: string
      rol_id?: number
      id?: number
    }
  }

  export interface ClienteUpdate {
    nombres?: string
    apellidos?: string
    alias?: string
    tipo_de_identificacion?: number
    numero_de_identificacion?: string
    celular?: string
    telefono?: string
    email?: string
    direccion?: string
    segunda_direccion?: string
    estado?: number
  }

  export interface Credito {
    comentario: string
    abonar_al_credito: boolean
    fecha_de_aprobacion: string
    numero_de_cuotas: number
    porcentaje: number
    cantidad: number
    estado: number
    frecuencia_del_credito_id?: number
    dias_adicionales: number
    tipo_de_mora_id?: number
    valor_de_mora: number
    id?: number
    created_at: string
    owner_id?: number
  }

  export interface CreditoCreate {
    comentario: string
    abonar_al_credito: boolean
    fecha_de_aprobacion: string
    numero_de_cuotas: number
    porcentaje: number
    cantidad: number
    estado: number
    frecuencia_del_credito_id: number
    dias_adicionales: number
    tipo_de_mora_id: number
    valor_de_mora: number
    owner_id: number
  }

  export interface CreditoRead {
    comentario: string
    abonar_al_credito: boolean
    fecha_de_aprobacion: string
    numero_de_cuotas: number
    porcentaje: number
    cantidad: number
    estado: number
    frecuencia_del_credito_id: number
    dias_adicionales: number
    tipo_de_mora_id: number
    valor_de_mora: number
    id: number
    created_at: string
    frecuencia_del_credito: {
      id?: number
      tipo_enumerador_id?: number
      nombre: string
    }
    tipo_de_mora: {
      id?: number
      tipo_enumerador_id?: number
      nombre: string
    }
    pagos: {
      comentario: string
      fecha_de_pago: string
      valor_del_pago: number
      metodo_de_pago_id?: number
      id?: number
      created_at: string
      credito_id?: number
    }[]
    cuotas: {
      id?: number
      fecha_de_pago: string
      fecha_de_aplicacion_de_mora: string
      valor_pagado: number
      valor_de_cuota: number
      valor_de_mora: number
      pagada: boolean
      credito_id?: number
    }[]
  }

  export interface CreditoUpdate {
    comentario: string
    abonar_al_credito: boolean
    fecha_de_aprobacion: string
    numero_de_cuotas: number
    porcentaje: number
    cantidad: number
    estado: number
    dias_adicionales: number
    tipo_de_mora_id: number
    valor_de_mora: number
    frecuencia_del_credito_id: number
  }

  export interface Cuota {
    id?: number
    fecha_de_pago: string
    fecha_de_aplicacion_de_mora: string
    valor_pagado: number
    valor_de_cuota: number
    valor_de_mora: number
    pagada: boolean
    credito_id?: number
  }

  export interface Enumerador {
    id?: number
    tipo_enumerador_id?: number
    nombre: string
  }

  export interface EnumeradorCreate {
    tipo_enumerador_id: number
    nombre: string
  }

  export interface EnumeradorUpdate {
    nombre: string
  }

  export interface Pago {
    comentario: string
    fecha_de_pago: string
    valor_del_pago: number
    metodo_de_pago_id?: number
    id?: number
    created_at: string
    credito_id?: number
  }

  export interface PagoCreate {
    comentario: string
    fecha_de_pago: string
    valor_del_pago: number
    metodo_de_pago_id: number
    credito_id: number
  }

  export interface PagoRead {
    comentario: string
    fecha_de_pago: string
    valor_del_pago: number
    metodo_de_pago_id: number
    id: number
    created_at: string
    credito: {
      comentario: string
      abonar_al_credito: boolean
      fecha_de_aprobacion: string
      numero_de_cuotas: number
      porcentaje: number
      cantidad: number
      estado: number
      frecuencia_del_credito_id?: number
      dias_adicionales: number
      tipo_de_mora_id?: number
      valor_de_mora: number
      id?: number
      created_at: string
      owner_id?: number
    }
  }

  export interface PagoUpdate {
    comentario?: string
    fecha_de_pago?: string
    valor_del_pago?: number
    metodo_de_pago_id?: number
  }

  export interface ResumenDelCliente {
    cliente_id: number
    nombres: string
    apellidos: string
    celular: string
    telefono: string
    documento: string
    resumen_de_creditos: {
      credito_id: number
      hay_morosidad: boolean
      valor_mora: number
      total_debe_pagar: number
      cant_cuota_mora: number
      cuotas_por_pagar: {
        id?: number
        fecha_de_pago: string
        fecha_de_aplicacion_de_mora: string
        valor_pagado: number
        valor_de_cuota: number
        valor_de_mora: number
        pagada: boolean
        credito_id?: number
      }[]
    }[]
  }

  export interface ResumenDelCredito {
    credito_id: number
    hay_morosidad: boolean
    valor_mora: number
    total_debe_pagar: number
    cant_cuota_mora: number
    cuotas_por_pagar: {
      id?: number
      fecha_de_pago: string
      fecha_de_aplicacion_de_mora: string
      valor_pagado: number
      valor_de_cuota: number
      valor_de_mora: number
      pagada: boolean
      credito_id?: number
    }[]
  }

  export interface TipoEnumerador {
    id?: number
    nombre: string
  }

  export interface TipoEnumeradorCreate {
    nombre: string
  }

  export interface TipoEnumeradorRead {
    id: number
    nombre: string
    enumeradores: {
      id?: number
      tipo_enumerador_id?: number
      nombre: string
    }[]
  }

  export interface TipoEnumeradorUpdate {
    nombre: string
  }

  export interface User {
    nombre: string
    password: string
    rol_id?: number
    id?: number
  }

  export interface UserCreate {
    nombre: string
    password: string
    rol_id: number
  }

  export interface UserReadWithRol {
    id: number
    nombre: string
    clientes?: {
      nombres: string
      apellidos: string
      alias: string
      tipo_de_identificacion: number
      numero_de_identificacion: string
      celular: string
      telefono: string
      email: string
      direccion: string
      segunda_direccion: string
      estado: number
      id?: number
      created_at: string
      owner_id?: number
    }[]
    rol: {
      id?: number
      tipo_enumerador_id?: number
      nombre: string
    }
  }

  export interface ValidationError {
    loc: (string | number)[]
    msg: string
    type: string
  }

  export type HTTPValidationError = ValidationError[]
}
