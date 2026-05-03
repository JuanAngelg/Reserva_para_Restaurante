import { Response, NextFunction } from 'express';
import { RequestAutenticado, Rol } from '../../types';

/**
 * Middleware RBAC (Role-Based Access Control)
 * Controla el acceso basado en roles
 */
export class RBACMiddleware {
  /**
   * Verifica que el usuario tenga alguno de los roles permitidos
   */
  static requiereRol(...rolesPermitidos: Rol[]) {
    return (req: RequestAutenticado, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          error: 'No autorizado',
          mensaje: 'Debe estar autenticado',
        });
        return;
      }

      if (!rolesPermitidos.includes(req.user.rol)) {
        res.status(403).json({
          error: 'Prohibido',
          mensaje: 'No tiene permisos para realizar esta acción',
        });
        return;
      }

      next();
    };
  }

  /**
   * Verifica que el usuario sea CLIENT
   */
  static esCliente() {
    return RBACMiddleware.requiereRol(Rol.CLIENT);
  }

  /**
   * Verifica que el usuario sea HOST
   */
  static esHost() {
    return RBACMiddleware.requiereRol(Rol.HOST);
  }

  /**
   * Verifica que el usuario sea MANAGER
   */
  static esManager() {
    return RBACMiddleware.requiereRol(Rol.MANAGER);
  }

  /**
   * Verifica que el usuario sea HOST o MANAGER
   */
  static esHostOManager() {
    return RBACMiddleware.requiereRol(Rol.HOST, Rol.MANAGER);
  }

  /**
   * Permite acceso a cualquier usuario autenticado
   */
  static cualquierUsuarioAutenticado() {
    return RBACMiddleware.requiereRol(Rol.CLIENT, Rol.HOST, Rol.MANAGER);
  }
}
