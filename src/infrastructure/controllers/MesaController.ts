import { Request, Response, NextFunction } from 'express';
import { CrearMesaUseCase } from '../../application/use-cases/CrearMesaUseCase';
import { ObtenerMesaUseCase } from '../../application/use-cases/ObtenerMesaUseCase';
import { ListarMesasUseCase } from '../../application/use-cases/ListarMesasUseCase';
import { ActualizarMesaUseCase } from '../../application/use-cases/ActualizarMesaUseCase';
import { EliminarMesaUseCase } from '../../application/use-cases/EliminarMesaUseCase';

/**
 * Controlador de mesas
 */
export class MesaController {
  constructor(
    private readonly crearMesaUseCase: CrearMesaUseCase,
    private readonly obtenerMesaUseCase: ObtenerMesaUseCase,
    private readonly listarMesasUseCase: ListarMesasUseCase,
    private readonly actualizarMesaUseCase: ActualizarMesaUseCase,
    private readonly eliminarMesaUseCase: EliminarMesaUseCase
  ) {}

  /**
   * POST /mesas
   * Crea una nueva mesa
   */
  crear = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const mesa = await this.crearMesaUseCase.ejecutar(req.body);
      res.status(201).json(mesa);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /mesas/:id
   * Obtiene una mesa por ID
   */
  obtenerPorId = async (
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
      
      const mesa = await this.obtenerMesaUseCase.ejecutar(id);
      res.status(200).json(mesa);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /mesas
   * Lista todas las mesas con paginación
   */
  listar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { pagina, limite } = req.query as any;
      const resultado = await this.listarMesasUseCase.ejecutar(
        pagina || 1,
        limite || 10
      );
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /mesas/:id
   * Actualiza una mesa
   */
  actualizar = async (
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
      
      const mesa = await this.actualizarMesaUseCase.ejecutar(
        id,
        req.body
      );
      res.status(200).json(mesa);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /mesas/:id
   * Elimina una mesa
   */
  eliminar = async (
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
      
      await this.eliminarMesaUseCase.ejecutar(id);
      res.status(200).json({
        mensaje: 'Mesa eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };
}
