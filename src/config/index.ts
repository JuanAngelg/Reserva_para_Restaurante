/**
 * Configuración centralizada de la aplicación
 * Carga variables de entorno y exporta configuración
 */

export const config = {
  // Servidor
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Base de datos
  databasePath: process.env.DATABASE_PATH || './database.sqlite',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'secret_super_seguro_cambiar_en_produccion',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Configuración por defecto del restaurante
  defaultOpeningTime: process.env.DEFAULT_OPENING_TIME || '10:00',
  defaultClosingTime: process.env.DEFAULT_CLOSING_TIME || '23:00',
  defaultReservationDuration: parseInt(
    process.env.DEFAULT_RESERVATION_DURATION || '90',
    10
  ),
};
