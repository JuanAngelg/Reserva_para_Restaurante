import { Response, NextFunction } from 'express';
import { IAuthService } from '../../domain/ports/IAuthService';
import { RequestAutenticado } from '../../types';
import { AUTH } from '../../domain/constants';

/**
 * Middleware de autenticación JWT
 * Verifica el token y adjunta el usuario al request
 */
export class AuthMiddleware {
  constructor(private readonly authService: IAuthService) {}

  /**
   * Valida el token JWT y extrae el usuario
   */
  autenticar = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith(AUTH.BEARER_PREFIX)) {
        res.status(401).json({
          error: 'No autorizado',
          mensaje: 'Token no proporcionado',
        });
        return;
      }

      const token = authHeader.substring(AUTH.BEARER_PREFIX_LENGTH);

      // Verificar token
      const payload = await this.authService.verificarToken(token);

      // Adjuntar usuario al request
      req.user = {
        id: payload.id,
        email: payload.email,
        rol: payload.rol as any,
      };

      next();
    } catch (error) {
      res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Token inválido o expirado',
      });
    }
  };

  /**
   * Middleware opcional: permite acceso sin autenticación
   */
  autenticacionOpcional = async (
    req: RequestAutenticado,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith(AUTH.BEARER_PREFIX)) {
        const token = authHeader.substring(AUTH.BEARER_PREFIX_LENGTH);
        const payload = await this.authService.verificarToken(token);
        req.user = {
          id: payload.id,
          email: payload.email,
          rol: payload.rol as any,
        };
      }

      next();
    } catch (error) {
      // Si falla, continuar sin usuario
      next();
    }
  };
}
