import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { ErrorNoEncontrado, ErrorAutorizacion } from '../errors';
import { Rol } from '../../types';

/**
 * Caso de uso: Cancelar reserva
 */
export class CancelarReservaUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(reservaId: string, actor?: { id: string; rol: Rol }): Promise<void> {
    const reserva = await this.reservaRepository.buscarPorId(reservaId);

    if (!reserva) {
      throw new ErrorNoEncontrado('Reserva', reservaId);
    }

    // Verificar permisos: si hay actor y no es HOST/MANAGER, debe ser propietario
    if (actor) {
      const actorIsPrivileged = actor.rol === Rol.HOST || actor.rol === Rol.MANAGER;
      if (!actorIsPrivileged && reserva.usuarioId && reserva.usuarioId !== actor.id) {
        throw new ErrorAutorizacion('No puede cancelar reservas de otros usuarios');
      }
    }

    // Cancelar reserva (valida internamente si es posible)
    reserva.cancelar();

    await this.reservaRepository.actualizar(reserva);
  }
}
