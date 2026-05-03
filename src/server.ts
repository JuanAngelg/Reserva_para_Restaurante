import { App } from './app';
import { config } from './config';

/**
 * Punto de entrada de la aplicación
 * Inicia el servidor Express
 */
const app = new App();
const server = app.obtenerApp();

server.listen(config.port, () => {
  console.log('===========================================');
  console.log('🚀 Servidor iniciado exitosamente');
  console.log(`📍 Puerto: ${config.port}`);
  console.log(`🌍 Entorno: ${config.nodeEnv}`);
  console.log(`💾 Base de datos: ${config.databasePath}`);
  console.log('===========================================');
  console.log('\n📋 Endpoints disponibles:');
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/login');
  console.log('  POST   /api/auth/logout');
  console.log('  GET    /api/users/profile');
  console.log('  PUT    /api/users/profile');
  console.log('  PUT    /api/users/change-password');
  console.log('  POST   /api/mesas');
  console.log('  GET    /api/mesas');
  console.log('  GET    /api/mesas/:id');
  console.log('  PUT    /api/mesas/:id');
  console.log('  DELETE /api/mesas/:id');
  console.log('  POST   /api/reservations');
  console.log('  POST   /api/reservations/check-availability');
  console.log('  GET    /api/reservations');
  console.log('  PATCH  /api/reservations/:id/status');
  console.log('  DELETE /api/reservations/:id');
  console.log('  GET    /api/config');
  console.log('  PUT    /api/config');
  console.log('  GET    /api/reports/occupancy');
  console.log('  GET    /api/reports/no-shows');
  console.log('  GET    /api/openapi.json');
  console.log('  GET    /api/docs');
  console.log('  GET    /health');
  console.log('===========================================\n');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM recibido, cerrando servidor...');
  app.cerrarConexion();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT recibido, cerrando servidor...');
  app.cerrarConexion();
  process.exit(0);
});
