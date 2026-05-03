import { Request, Response, NextFunction } from 'express';
import { CrearReservaUseCase } from '../../application/use-cases/CrearReservaUseCase';
import { VerificarDisponibilidadUseCase } from '../../application/use-cases/VerificarDisponibilidadUseCase';
import { ListarReservasUseCase } from '../../application/use-cases/ListarReservasUseCase';
import { ActualizarEstadoReservaUseCase } from '../../application/use-cases/ActualizarEstadoReservaUseCase';
import { CancelarReservaUseCase } from '../../application/use-cases/CancelarReservaUseCase';
import { RequestAutenticado } from '../../types';

/**
 * Controlador de reservas
 */
export class ReservaController {
  constructor(
    private readonly crearReservaUseCase: CrearReservaUseCase,
    private readonly verificarDisponibilidadUseCase: VerificarDisponibilidadUseCase,
    private readonly listarReservasUseCase: ListarReservasUseCase,
    private readonly actualizarEstadoReservaUseCase: ActualizarEstadoReservaUseCase,
    private readonly cancelarReservaUseCase: CancelarReservaUseCase
  ) {}

  /**
   * POST /reservations
   * Crea una nueva reserva
   */
  crear = async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Si está autenticado y no se especifica usuarioId, usar el del token
      if (req.user && !req.body.usuarioId) {
        req.body.usuarioId = req.user.id;
      }

      const reserva = await this.crearReservaUseCase.ejecutar(req.body);
      res.status(201).json(reserva);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /reservations/check-availability
   * Verifica disponibilidad de mesas
   */
  verificarDisponibilidad = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const resultado = await this.verificarDisponibilidadUseCase.ejecutar(
        req.body
      );
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /reservations
   * Lista reservas con filtros
   */
  listar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const resultado = await this.listarReservasUseCase.ejecutar(
        req.query as any
      );
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /reservations/:id/status
   * Actualiza el estado de una reserva (check-in, no-show)
   */
  actualizarEstado = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID faltante' });
        return;
      }
      
      const reserva = await this.actualizarEstadoReservaUseCase.ejecutar(
        id,
        req.body
      );
      res.status(200).json(reserva);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /reservations/:id
   * Cancela una reserva
   */
  cancelar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'ID faltante' });
        return;
      }
      
      await this.cancelarReservaUseCase.ejecutar(id);
      res.status(200).json({
        mensaje: 'Reserva cancelada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };
}
