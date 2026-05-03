import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { MesaDTO } from '../dtos/MesaDTO';
import { ErrorNoEncontrado } from '../errors';

/**
 * Caso de uso: Obtener mesa por ID
 */
export class ObtenerMesaUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async ejecutar(mesaId: string): Promise<MesaDTO> {
    const mesa = await this.mesaRepository.buscarPorId(mesaId);

    if (!mesa) {
      throw new ErrorNoEncontrado('Mesa', mesaId);
    }

    return {
      id: mesa.id,
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      forma: mesa.forma,
      posicionX: mesa.posicionX,
      posicionY: mesa.posicionY,
      createdAt: mesa.createdAt,
      updatedAt: mesa.updatedAt,
    };
  }
}
