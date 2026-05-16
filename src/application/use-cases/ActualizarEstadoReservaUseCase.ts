import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { ActualizarEstadoReservaDTO, ReservaDTO } from '../dtos/ReservaDTO';
import { ErrorNoEncontrado, ErrorNegocio } from '../errors';

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
    try {
      reserva.cambiarEstado(dto.estado);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Estado de reserva inválido';
      throw new ErrorNegocio(mensaje);
    }

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
