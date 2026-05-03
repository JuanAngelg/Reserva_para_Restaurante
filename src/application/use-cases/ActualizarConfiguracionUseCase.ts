import { ConfiguracionRestaurante } from '../../domain/entities/ConfiguracionRestaurante';
import { IConfiguracionRepository } from '../../domain/ports/IConfiguracionRepository';
import {
  ActualizarConfiguracionDTO,
  ConfiguracionRestauranteDTO,
} from '../dtos/ConfiguracionDTO';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de uso: Actualizar configuración del restaurante
 */
export class ActualizarConfiguracionUseCase {
  constructor(
    private readonly configuracionRepository: IConfiguracionRepository
  ) {}

  async ejecutar(
    dto: ActualizarConfiguracionDTO
  ): Promise<ConfiguracionRestauranteDTO> {
    let configuracion = await this.configuracionRepository.obtener();

    if (configuracion) {
      // Actualizar configuración existente
      configuracion.actualizar(dto);
    } else {
      // Crear nueva configuración si no existe
      configuracion = new ConfiguracionRestaurante(
        uuidv4(),
        dto.horaApertura || '10:00',
        dto.horaCierre || '23:00',
        dto.duracionReserva || 90
      );
    }

    await this.configuracionRepository.guardar(configuracion);

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
