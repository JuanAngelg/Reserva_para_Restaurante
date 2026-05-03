import { IConfiguracionRepository } from '../../domain/ports/IConfiguracionRepository';
import { ConfiguracionRestauranteDTO } from '../dtos/ConfiguracionDTO';
import { ErrorNoEncontrado } from '../errors';

/**
 * Caso de uso: Obtener configuración del restaurante
 */
export class ObtenerConfiguracionUseCase {
  constructor(
    private readonly configuracionRepository: IConfiguracionRepository
  ) {}

  async ejecutar(): Promise<ConfiguracionRestauranteDTO> {
    const configuracion = await this.configuracionRepository.obtener();

    if (!configuracion) {
      throw new ErrorNoEncontrado('Configuración del restaurante');
    }

    return {
      id: configuracion.id,
      horaApertura: configuracion.horaApertura,
      horaCierre: configuracion.horaCierre,
      duracionReserva: configuracion.duracionReserva,
      createdAt: configuracion.createdAt,
      updatedAt: configuracion.updatedAt,
    };
  }
}
