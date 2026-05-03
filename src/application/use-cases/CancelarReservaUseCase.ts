import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { ErrorNoEncontrado } from '../errors';

/**
 * Caso de uso: Cancelar reserva
 */
export class CancelarReservaUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(reservaId: string): Promise<void> {
    const reserva = await this.reservaRepository.buscarPorId(reservaId);

    if (!reserva) {
      throw new ErrorNoEncontrado('Reserva', reservaId);
    }

    // Cancelar reserva (valida internamente si es posible)
    reserva.cancelar();

    await this.reservaRepository.actualizar(reserva);
  }
}
