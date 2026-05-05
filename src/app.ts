import express, { Express, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { DatabaseManager } from './infrastructure/database/DatabaseManager';
import { UsuarioRepository } from './infrastructure/repositories/UsuarioRepository';
import { MesaRepository } from './infrastructure/repositories/MesaRepository';
import { ReservaRepository } from './infrastructure/repositories/ReservaRepository';
import { ConfiguracionRepository } from './infrastructure/repositories/ConfiguracionRepository';
import { AuthAdapter } from './infrastructure/adapters/AuthAdapter';
import { GoogleCalendarAdapter } from './infrastructure/adapters/GoogleCalendarAdapter';
import { AuthMiddleware } from './infrastructure/middlewares/AuthMiddleware';
import { RBACMiddleware } from './infrastructure/middlewares/RBACMiddleware';
import { ValidationMiddleware } from './infrastructure/middlewares/ValidationMiddleware';
import { ErrorMiddleware } from './infrastructure/middlewares/ErrorMiddleware';
import { AuthController } from './infrastructure/controllers/AuthController';
import { MesaController } from './infrastructure/controllers/MesaController';
import { ReservaController } from './infrastructure/controllers/ReservaController';
import { ConfiguracionController } from './infrastructure/controllers/ConfiguracionController';
import * as AuthSchemas from './infrastructure/controllers/schemas/AuthSchemas';
import * as MesaSchemas from './infrastructure/controllers/schemas/MesaSchemas';
import * as ReservaSchemas from './infrastructure/controllers/schemas/ReservaSchemas';
import * as ConfigSchemas from './infrastructure/controllers/schemas/ConfiguracionSchemas';
import { RegistrarUsuarioUseCase } from './application/use-cases/RegistrarUsuarioUseCase';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { ObtenerPerfilUseCase } from './application/use-cases/ObtenerPerfilUseCase';
import { ActualizarPerfilUseCase } from './application/use-cases/ActualizarPerfilUseCase';
import { CambiarPasswordUseCase } from './application/use-cases/CambiarPasswordUseCase';
import { RecuperarPasswordUseCase } from './application/use-cases/RecuperarPasswordUseCase';
import { CrearMesaUseCase } from './application/use-cases/CrearMesaUseCase';
import { ObtenerMesaUseCase } from './application/use-cases/ObtenerMesaUseCase';
import { ListarMesasUseCase } from './application/use-cases/ListarMesasUseCase';
import { ActualizarMesaUseCase } from './application/use-cases/ActualizarMesaUseCase';
import { EliminarMesaUseCase } from './application/use-cases/EliminarMesaUseCase';
import { CrearReservaUseCase } from './application/use-cases/CrearReservaUseCase';
import { VerificarDisponibilidadUseCase } from './application/use-cases/VerificarDisponibilidadUseCase';
import { ListarReservasUseCase } from './application/use-cases/ListarReservasUseCase';
import { ActualizarEstadoReservaUseCase } from './application/use-cases/ActualizarEstadoReservaUseCase';
import { CancelarReservaUseCase } from './application/use-cases/CancelarReservaUseCase';
import { ObtenerConfiguracionUseCase } from './application/use-cases/ObtenerConfiguracionUseCase';
import { ActualizarConfiguracionUseCase } from './application/use-cases/ActualizarConfiguracionUseCase';
import { GenerarReporteOcupacionUseCase } from './application/use-cases/GenerarReporteOcupacionUseCase';
import { GenerarReporteNoShowsUseCase } from './application/use-cases/GenerarReporteNoShowsUseCase';
import { openApiSpec } from './config/openapi';

/**
 * Configuración y bootstrap de la aplicación
 * Implementa inyección de dependencias manual
 */
export class App {
  private app: Express;
  private dbManager: DatabaseManager;

  constructor() {
    this.app = express();
    this.dbManager = new DatabaseManager();
    this.configurarMiddlewares();
    this.configurarDocumentacion();
    this.configurarRutas();
    this.configurarManejadorErrores();
  }

  /**
   * Configura middlewares globales
   */
  private configurarMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS simple (en producción usar paquete cors)
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      // Responder directamente a preflight para evitar que pase por middlewares que requieren autenticación
      if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
      }
      next();
    });
  }

  /**
   * Configura documentación OpenAPI + Swagger UI
   */
  private configurarDocumentacion(): void {
    this.app.get('/api/openapi.json', (_req, res) => {
      res.status(200).json(openApiSpec);
    });

    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  }

  /**
   * Configura todas las rutas de la aplicación
   */
  private configurarRutas(): void {
    const db = this.dbManager.obtenerDb();

    // Inicializar repositorios
    const usuarioRepo = new UsuarioRepository(db);
    const mesaRepo = new MesaRepository(db);
    const reservaRepo = new ReservaRepository(db, this.dbManager);
    const configRepo = new ConfiguracionRepository(db);

    // Inicializar servicios/adaptadores
    const authService = new AuthAdapter();
    const calendarioService = new GoogleCalendarAdapter();

    // Inicializar middlewares
    const authMiddleware = new AuthMiddleware(authService);

    // Inicializar casos de uso - Auth
    const registrarUsuarioUC = new RegistrarUsuarioUseCase(usuarioRepo, authService);
    const loginUC = new LoginUseCase(usuarioRepo, authService);
    const obtenerPerfilUC = new ObtenerPerfilUseCase(usuarioRepo);
    const actualizarPerfilUC = new ActualizarPerfilUseCase(usuarioRepo);
    const cambiarPasswordUC = new CambiarPasswordUseCase(usuarioRepo, authService);
    const recuperarPasswordUC = new RecuperarPasswordUseCase(usuarioRepo);

    // Casos de uso - Mesa
    const crearMesaUC = new CrearMesaUseCase(mesaRepo);
    const obtenerMesaUC = new ObtenerMesaUseCase(mesaRepo);
    const listarMesasUC = new ListarMesasUseCase(mesaRepo);
    const actualizarMesaUC = new ActualizarMesaUseCase(mesaRepo);
    const eliminarMesaUC = new EliminarMesaUseCase(mesaRepo);

    // Casos de uso - Reserva
    const crearReservaUC = new CrearReservaUseCase(
      reservaRepo,
      mesaRepo,
      configRepo,
      calendarioService
    );
    const verificarDisponibilidadUC = new VerificarDisponibilidadUseCase(
      mesaRepo,
      reservaRepo,
      configRepo
    );
    const listarReservasUC = new ListarReservasUseCase(reservaRepo);
    const actualizarEstadoReservaUC = new ActualizarEstadoReservaUseCase(reservaRepo);
    const cancelarReservaUC = new CancelarReservaUseCase(reservaRepo);

    // Casos de uso - Configuración y Reportes
    const obtenerConfigUC = new ObtenerConfiguracionUseCase(configRepo);
    const actualizarConfigUC = new ActualizarConfiguracionUseCase(configRepo);
    const reporteOcupacionUC = new GenerarReporteOcupacionUseCase(reservaRepo, mesaRepo);
    const reporteNoShowsUC = new GenerarReporteNoShowsUseCase(reservaRepo);

    // Inicializar controladores
    const authController = new AuthController(
      registrarUsuarioUC,
      loginUC,
      obtenerPerfilUC,
      actualizarPerfilUC,
      cambiarPasswordUC,
      recuperarPasswordUC
    );
    const mesaController = new MesaController(
      crearMesaUC,
      obtenerMesaUC,
      listarMesasUC,
      actualizarMesaUC,
      eliminarMesaUC
    );
    const reservaController = new ReservaController(
      crearReservaUC,
      verificarDisponibilidadUC,
      listarReservasUC,
      actualizarEstadoReservaUC,
      cancelarReservaUC
    );
    const configController = new ConfiguracionController(
      obtenerConfigUC,
      actualizarConfigUC,
      reporteOcupacionUC,
      reporteNoShowsUC
    );

    // Health check - siempre disponible
    this.app.get('/api/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Rutas públicas
    const publicRouter = Router();
    publicRouter.post(
      '/auth/register',
      ValidationMiddleware.validarBody(AuthSchemas.RegistrarUsuarioSchema),
      authController.registrar
    );
    publicRouter.post(
      '/auth/login',
      ValidationMiddleware.validarBody(AuthSchemas.LoginSchema),
      authController.login
    );
    publicRouter.post('/auth/logout', authController.logout);
    publicRouter.post(
      '/auth/recover-password',
      ValidationMiddleware.validarBody(AuthSchemas.RecuperarPasswordSchema),
      authController.recuperarPassword
    );

    // Disponibilidad pública
    publicRouter.post(
      '/reservations/check-availability',
      ValidationMiddleware.validarBody(ReservaSchemas.VerificarDisponibilidadSchema),
      reservaController.verificarDisponibilidad
    );

    this.app.use('/api', publicRouter);

    // Rutas protegidas - Usuario
    const userRouter = Router();
    userRouter.use(authMiddleware.autenticar);
    userRouter.get('/profile', authController.obtenerPerfil);
    userRouter.put(
      '/profile',
      ValidationMiddleware.validarBody(AuthSchemas.ActualizarPerfilSchema),
      authController.actualizarPerfil
    );
    userRouter.put(
      '/change-password',
      ValidationMiddleware.validarBody(AuthSchemas.CambiarPasswordSchema),
      authController.cambiarPassword
    );

    this.app.use('/api/users', userRouter);

    // Rutas protegidas - Mesas (solo MANAGER)
    const mesaRouter = Router();
    mesaRouter.use(authMiddleware.autenticar);
    mesaRouter.post(
      '/',
      RBACMiddleware.esManager(),
      ValidationMiddleware.validarBody(MesaSchemas.CrearMesaSchema),
      mesaController.crear
    );
    mesaRouter.get(
      '/:id',
      ValidationMiddleware.validarParams(MesaSchemas.IdParamSchema),
      mesaController.obtenerPorId
    );
    mesaRouter.get('/', mesaController.listar);
    mesaRouter.put(
      '/:id',
      RBACMiddleware.esManager(),
      ValidationMiddleware.validarParams(MesaSchemas.IdParamSchema),
      ValidationMiddleware.validarBody(MesaSchemas.ActualizarMesaSchema),
      mesaController.actualizar
    );
    mesaRouter.delete(
      '/:id',
      RBACMiddleware.esManager (),
      ValidationMiddleware.validarParams(MesaSchemas.IdParamSchema),
      mesaController.eliminar
    );

    this.app.use('/api/mesas', mesaRouter);

    // Rutas protegidas - Reservas
    const reservaRouter = Router();
    reservaRouter.use(authMiddleware.autenticacionOpcional);
    reservaRouter.post(
      '/',
      ValidationMiddleware.validarBody(ReservaSchemas.CrearReservaSchema),
      reservaController.crear
    );
    reservaRouter.get(
      '/',
      ValidationMiddleware.validarQuery(ReservaSchemas.FiltrosReservaQuerySchema),
      reservaController.listar
    );
    reservaRouter.patch(
      '/:id/status',
      authMiddleware.autenticar,
      RBACMiddleware.esHostOManager(),
      ValidationMiddleware.validarParams(MesaSchemas.IdParamSchema),
      ValidationMiddleware.validarBody(ReservaSchemas.ActualizarEstadoReservaSchema),
      reservaController.actualizarEstado
    );
    reservaRouter.delete(
      '/:id',
      authMiddleware.autenticar,
      ValidationMiddleware.validarParams(MesaSchemas.IdParamSchema),
      reservaController.cancelar
    );

    this.app.use('/api/reservations', reservaRouter);

    // Rutas protegidas - Configuración (solo MANAGER)
    const configRouter = Router();
    configRouter.use(authMiddleware.autenticar, RBACMiddleware.esManager());
    configRouter.get('/', configController.obtener);
    configRouter.put(
      '/',
      ValidationMiddleware.validarBody(ConfigSchemas.ActualizarConfiguracionSchema),
      configController.actualizar
    );

    this.app.use('/api/config', configRouter);

    // Rutas protegidas - Reportes (solo MANAGER)
    const reportesRouter = Router();
    reportesRouter.use(authMiddleware.autenticar, RBACMiddleware.esManager());
    reportesRouter.get(
      '/occupancy',
      ValidationMiddleware.validarQuery(ConfigSchemas.FiltrosReporteQuerySchema),
      configController.reporteOcupacion
    );
    reportesRouter.get(
      '/no-shows',
      ValidationMiddleware.validarQuery(ConfigSchemas.FiltrosReporteQuerySchema),
      configController.reporteNoShows
    );

    this.app.use('/api/reports', reportesRouter);

    // Ruta de salud
    this.app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  /**
   * Configura el manejador de errores global
   */
  private configurarManejadorErrores(): void {
    this.app.use(ErrorMiddleware.noEncontrado);
    this.app.use(ErrorMiddleware.manejar);
  }

  /**
   * Obtiene la instancia de Express
   */
  obtenerApp(): Express {
    return this.app;
  }

  /**
   * Cierra la conexión a la base de datos
   */
  cerrarConexion(): void {
    this.dbManager.cerrar();
  }
}
