import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

/**
 * Middleware de validación usando Zod
 */
export class ValidationMiddleware {
  /**
   * Valida el body del request contra un schema Zod
   */
  static validarBody(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            error: 'Error de validación',
            detalles: error.issues.map((err: { path: unknown[]; message: string }) => ({
              campo: err.path.join('.'),
              mensaje: err.message,
            })),
          });
        } else {
          res.status(400).json({
            error: 'Error de validación',
            mensaje: 'Datos inválidos',
          });
        }
      }
    };
  }

  /**
   * Valida los query params del request
   */
  static validarQuery(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse(req.query);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            error: 'Error de validación',
            detalles: error.issues.map((err: { path: unknown[]; message: string }) => ({
              campo: err.path.join('.'),
              mensaje: err.message,
            })),
          });
        } else {
          res.status(400).json({
            error: 'Error de validación',
            mensaje: 'Parámetros inválidos',
          });
        }
      }
    };
  }

  /**
   * Valida los params de la URL
   */
  static validarParams(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse(req.params);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({
            error: 'Error de validación',
            detalles: error.issues.map((err: { path: unknown[]; message: string }) => ({
              campo: err.path.join('.'),
              mensaje: err.message,
            })),
          });
        } else {
          res.status(400).json({
            error: 'Error de validación',
            mensaje: 'Parámetros de ruta inválidos',
          });
        }
      }
    };
  }
}
