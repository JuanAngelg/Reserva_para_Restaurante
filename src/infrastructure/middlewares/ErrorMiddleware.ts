import { Request, Response, NextFunction } from 'express';
import { ErrorAplicacion } from '../../application/errors';

/**
 * Middleware centralizado de manejo de errores
 * Procesa errores de aplicación y errores inesperados
 */
export class ErrorMiddleware {
  /**
   * Manejador global de errores
   */
  static manejar(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    console.error('[Error]', {
      mensaje: error.message,
      stack: error.stack,
      url: req.url,
      metodo: req.method,
    });

    // Si es un error de aplicación conocido
    if (error instanceof ErrorAplicacion) {
      res.status(error.codigoEstado).json({
        error: error.name,
        mensaje: error.message,
      });
      return;
    }

    // JSON malformado en body (error de parseo de express.json)
    if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({
        error: 'Error de validación',
        mensaje: 'JSON inválido en el body de la petición',
      });
      return;
    }

    // Error inesperado
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Ha ocurrido un error inesperado',
    });
  }

  /**
   * Manejador de rutas no encontradas
   */
  static noEncontrado(req: Request, res: Response): void {
    res.status(404).json({
      error: 'No encontrado',
      mensaje: `Ruta ${req.method} ${req.url} no encontrada`,
    });
  }
}
