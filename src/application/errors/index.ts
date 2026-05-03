/**
 * Clase base para errores de aplicación
 */
export abstract class ErrorAplicacion extends Error {
  constructor(
    message: string,
    public readonly codigoEstado: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error cuando un recurso no es encontrado
 */
export class ErrorNoEncontrado extends ErrorAplicacion {
  constructor(recurso: string, id?: string) {
    const mensaje = id
      ? `${recurso} con id ${id} no encontrado`
      : `${recurso} no encontrado`;
    super(mensaje, 404);
  }
}

/**
 * Error de validación de datos
 */
export class ErrorValidacion extends ErrorAplicacion {
  constructor(mensaje: string, public readonly campo?: string) {
    super(mensaje, 400);
  }
}

/**
 * Error de autenticación
 */
export class ErrorAutenticacion extends ErrorAplicacion {
  constructor(mensaje: string = 'Credenciales inválidas') {
    super(mensaje, 401);
  }
}

/**
 * Error de autorización (permisos insuficientes)
 */
export class ErrorAutorizacion extends ErrorAplicacion {
  constructor(mensaje: string = 'No tiene permisos para realizar esta acción') {
    super(mensaje, 403);
  }
}

/**
 * Error de conflicto (ej: email duplicado, mesa ya reservada)
 */
export class ErrorConflicto extends ErrorAplicacion {
  constructor(mensaje: string) {
    super(mensaje, 409);
  }
}

/**
 * Error de regla de negocio
 */
export class ErrorNegocio extends ErrorAplicacion {
  constructor(mensaje: string) {
    super(mensaje, 422);
  }
}
