/**
 * Constantes del dominio
 * Define valores inmutables y configuraciones de reglas de negocio
 */

/**
 * Constantes para el servicio de asignación inteligente de mesas
 */
export const ASIGNACION_INTELIGENTE = {
  /**
   * Peso de la eficiencia de ocupación en el cálculo de puntuación (70%)
   * Mayor peso = prioriza llenar mesas cercanas a su capacidad máxima
   */
  PESO_EFICIENCIA: 0.7,

  /**
   * Peso de la penalización por desperdicio de capacidad (30%)
   * Mayor peso = evita asignar mesas demasiado grandes
   */
  PESO_PENALIZACION_DESPERDICIO: 0.3,

  /**
   * Factor divisor para calcular penalización por desperdicio
   * Reduce la penalización si la diferencia de capacidad es menor a este valor
   */
  FACTOR_DESPERDICIO: 10,

  /**
   * Número máximo de alternativas a sugerir
   */
  LIMITE_SUGERENCIAS_DEFAULT: 3,
} as const;

/**
 * Constantes para validación de contraseñas
 */
export const PASSWORD_VALIDACION = {
  /**
   * Longitud mínima requerida para contraseñas
   */
  LONGITUD_MINIMA: 8,

  /**
   * Mensajes de error para validación de contraseñas
   */
  ERRORES: {
    LONGITUD_MINIMA: 'La contraseña debe tener al menos 8 caracteres',
    REQUIERE_MAYUSCULA: 'La contraseña debe contener al menos una letra mayúscula',
    REQUIERE_MINUSCULA: 'La contraseña debe contener al menos una letra minúscula',
    REQUIERE_NUMERO: 'La contraseña debe contener al menos un número',
  },
} as const;

/**
 * Constantes para autenticación
 */
export const AUTH = {
  /**
   * Número de rondas de salt para bcrypt
   * Más rondas = más seguro pero más lento
   * 10 rondas ~100ms de procesamiento
   */
  BCRYPT_SALT_ROUNDS: 10,

  /**
   * Prefijo para el esquema Bearer en headers de autorización
   */
  BEARER_PREFIX: 'Bearer ',
  
  /**
   * Longitud del prefijo Bearer (incluye espacio)
   */
  BEARER_PREFIX_LENGTH: 7,
} as const;

/**
 * Constantes para formateo de tiempo
 */
export const TIEMPO = {
  /**
   * Regex para validar formato HH:mm (24 horas)
   */
  REGEX_HORA_24H: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,

  /**
   * Minutos en una hora
   */
  MINUTOS_POR_HORA: 60,

  /**
   * Horas en un día
   */
  HORAS_POR_DIA: 24,
} as const;

/**
 * Constantes para validación de mesas
 */
export const MESA_VALIDACION = {
  /**
   * Capacidad mínima permitida para una mesa
   */
  CAPACIDAD_MINIMA: 1,

  /**
   * Mensajes de error
   */
  ERRORES: {
    CAPACIDAD_INVALIDA: 'La capacidad debe ser mayor a 0',
    NUMERO_INVALIDO: 'El número de mesa debe ser mayor a 0',
  },
} as const;

/**
 * Constantes para validación de reservas
 */
export const RESERVA_VALIDACION = {
  /**
   * Número mínimo de comensales
   */
  COMENSALES_MINIMO: 1,

  /**
   * Mensajes de error
   */
  ERRORES: {
    COMENSALES_INVALIDO: 'El número de comensales debe ser mayor a 0',
    FORMATO_HORA_INVALIDO: 'Hora de inicio inválida',
    FORMATO_FECHA_INVALIDO: 'Formato de fecha inválido. Use YYYY-MM-DD',
  },
} as const;

/**
 * Constantes para paginación
 */
export const PAGINACION = {
  /**
   * Página predeterminada
   */
  PAGINA_DEFAULT: 1,

  /**
   * Límite de resultados por página predeterminado
   */
  LIMITE_DEFAULT: 10,

  /**
   * Límite máximo de resultados por página
   */
  LIMITE_MAXIMO: 100,
} as const;
