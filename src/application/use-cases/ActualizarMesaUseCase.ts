import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { ActualizarMesaDTO, MesaDTO } from '../dtos/MesaDTO';
import { ErrorNoEncontrado, ErrorConflicto } from '../errors';

/**
 * Caso de uso: Actualizar mesa
 */
export class ActualizarMesaUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async ejecutar(mesaId: string, dto: ActualizarMesaDTO): Promise<MesaDTO> {
    const mesa = await this.mesaRepository.buscarPorId(mesaId);

    if (!mesa) {
      throw new ErrorNoEncontrado('Mesa', mesaId);
    }

    // Si cambia el número, verificar que no esté en uso
    if (dto.numero && dto.numero !== mesa.numero) {
      const mesaConNumero = await this.mesaRepository.buscarPorNumero(
        dto.numero
      );

      if (mesaConNumero) {
        throw new ErrorConflicto(
          `Ya existe una mesa con el número ${dto.numero}`
        );
      }
    }

    // Actualizar mesa
    mesa.actualizar(dto);
    await this.mesaRepository.actualizar(mesa);

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
