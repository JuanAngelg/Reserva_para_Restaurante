import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { ActualizarEstadoReservaDTO, ReservaDTO } from '../dtos/ReservaDTO';
import { ErrorNoEncontrado } from '../errors';

/**
 * Caso de uso: Actualizar estado de reserva
 * Usado para check-in, cancelaciones y no-shows
 */
export class ActualizarEstadoReservaUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(
    reservaId: string,
    dto: ActualizarEstadoReservaDTO
  ): Promise<ReservaDTO> {
    const reserva = await this.reservaRepository.buscarPorId(reservaId);

    if (!reserva) {
      throw new ErrorNoEncontrado('Reserva', reservaId);
    }

    // Cambiar estado (valida transición internamente)
    reserva.cambiarEstado(dto.estado);

    await this.reservaRepository.actualizar(reserva);

    return {
      id: reserva.id,
      usuarioId: reserva.usuarioId,
      nombreCliente: reserva.nombreCliente,
      emailCliente: reserva.emailCliente,
      mesaId: reserva.mesaId,
      comensales: reserva.comensales,
      fecha: reserva.fecha,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      estado: reserva.estado,
      createdAt: reserva.createdAt,
      updatedAt: reserva.updatedAt,
    };
  }
}
