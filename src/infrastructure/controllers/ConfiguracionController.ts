import { Request, Response, NextFunction } from 'express';
import { ObtenerConfiguracionUseCase } from '../../application/use-cases/ObtenerConfiguracionUseCase';
import { ActualizarConfiguracionUseCase } from '../../application/use-cases/ActualizarConfiguracionUseCase';
import { GenerarReporteOcupacionUseCase } from '../../application/use-cases/GenerarReporteOcupacionUseCase';
import { GenerarReporteNoShowsUseCase } from '../../application/use-cases/GenerarReporteNoShowsUseCase';

/**
 * Controlador de configuración y reportes
 */
export class ConfiguracionController {
  constructor(
    private readonly obtenerConfiguracionUseCase: ObtenerConfiguracionUseCase,
    private readonly actualizarConfiguracionUseCase: ActualizarConfiguracionUseCase,
    private readonly generarReporteOcupacionUseCase: GenerarReporteOcupacionUseCase,
    private readonly generarReporteNoShowsUseCase: GenerarReporteNoShowsUseCase
  ) {}

  /**
   * GET /config
   * Obtiene la configuración del restaurante
   */
  obtener = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const config = await this.obtenerConfiguracionUseCase.ejecutar();
      res.status(200).json(config);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /config
   * Actualiza la configuración del restaurante
   */
  actualizar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const config = await this.actualizarConfiguracionUseCase.ejecutar(
        req.body
      );
      res.status(200).json(config);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /reports/occupancy
   * Genera reporte de ocupación
   */
  reporteOcupacion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const reporte = await this.generarReporteOcupacionUseCase.ejecutar(
        req.query as any
      );
      res.status(200).json(reporte);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /reports/no-shows
   * Genera reporte de no-shows
   */
  reporteNoShows = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const reporte = await this.generarReporteNoShowsUseCase.ejecutar(
        req.query as any
      );
      res.status(200).json(reporte);
    } catch (error) {
      next(error);
    }
  };
}
