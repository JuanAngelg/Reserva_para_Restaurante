import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { ErrorNoEncontrado } from '../errors';

/**
 * Caso de uso: Eliminar mesa
 */
export class EliminarMesaUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async ejecutar(mesaId: string): Promise<void> {
    const mesa = await this.mesaRepository.buscarPorId(mesaId);

    if (!mesa) {
      throw new ErrorNoEncontrado('Mesa', mesaId);
    }

    await this.mesaRepository.eliminar(mesaId);
  }
}
