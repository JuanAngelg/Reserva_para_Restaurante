import { Mesa } from '../../domain/entities/Mesa';
import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { CrearMesaDTO, MesaDTO } from '../dtos/MesaDTO';
import { ErrorConflicto } from '../errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de uso: Crear nueva mesa
 */
export class CrearMesaUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async ejecutar(dto: CrearMesaDTO): Promise<MesaDTO> {
    // Verificar que no exista una mesa con ese número
    const mesaExistente = await this.mesaRepository.buscarPorNumero(dto.numero);

    if (mesaExistente) {
      throw new ErrorConflicto(`Ya existe una mesa con el número ${dto.numero}`);
    }

    // Crear mesa
    const mesa = new Mesa(
      uuidv4(),
      dto.numero,
      dto.capacidad,
      dto.forma,
      dto.posicionX,
      dto.posicionY
    );

    // Guardar mesa
    await this.mesaRepository.guardar(mesa);

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
