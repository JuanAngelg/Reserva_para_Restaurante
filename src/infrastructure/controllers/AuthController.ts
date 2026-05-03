import { Request, Response, NextFunction } from 'express';
import { RegistrarUsuarioUseCase } from '../../application/use-cases/RegistrarUsuarioUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { ObtenerPerfilUseCase } from '../../application/use-cases/ObtenerPerfilUseCase';
import { ActualizarPerfilUseCase } from '../../application/use-cases/ActualizarPerfilUseCase';
import { CambiarPasswordUseCase } from '../../application/use-cases/CambiarPasswordUseCase';
import { RecuperarPasswordUseCase } from '../../application/use-cases/RecuperarPasswordUseCase';
import { RequestAutenticado } from '../../types';

/**
 * Controlador de autenticación y gestión de usuarios
 */
export class AuthController {
  constructor(
    private readonly registrarUsuarioUseCase: RegistrarUsuarioUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly obtenerPerfilUseCase: ObtenerPerfilUseCase,
    private readonly actualizarPerfilUseCase: ActualizarPerfilUseCase,
    private readonly cambiarPasswordUseCase: CambiarPasswordUseCase,
    private readonly recuperarPasswordUseCase: RecuperarPasswordUseCase
  ) {}

  /**
   * POST /auth/register
   * Registra un nuevo usuario
   */
  registrar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const resultado = await this.registrarUsuarioUseCase.ejecutar(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/login
   * Inicia sesión
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const resultado = await this.loginUseCase.ejecutar(req.body);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/logout
   * Cierra sesión (simulado, el cliente debe eliminar el token)
   */
  logout = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      mensaje: 'Sesión cerrada exitosamente',
    });
  };

  /**
   * POST /auth/recover-password
   * Recupera la contrasena (simulado)
   */
  recuperarPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const resultado = await this.recuperarPasswordUseCase.ejecutar(req.body);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /users/profile
   * Obtiene el perfil del usuario autenticado
   */
  obtenerPerfil = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const usuario = await this.obtenerPerfilUseCase.ejecutar(req.user!.id);
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /users/profile
   * Actualiza el perfil del usuario
   */
  actualizarPerfil = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const usuario = await this.actualizarPerfilUseCase.ejecutar(
        req.user!.id,
        req.body
      );
      res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /users/change-password
   * Cambia la contraseña del usuario
   */
  cambiarPassword = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.cambiarPasswordUseCase.ejecutar(req.user!.id, req.body);
      res.status(200).json({
        mensaje: 'Contraseña actualizada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };
}
