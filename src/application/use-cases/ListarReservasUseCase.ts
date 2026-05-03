import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { FiltrosReservaDTO, ReservaDTO } from '../dtos/ReservaDTO';
import { ResultadoPaginado } from '../../types';

/**
 * Caso de uso: Listar reservas con filtros
 */
export class ListarReservasUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(dto: FiltrosReservaDTO): Promise<ResultadoPaginado<ReservaDTO>> {
    const filtros: any = {
      usuarioId: dto.usuarioId,
      mesaId: dto.mesaId,
      estado: dto.estado,
    };

    if (dto.fecha) {
      filtros.fecha = new Date(dto.fecha);
    }

    if (dto.fechaDesde) {
      filtros.fechaDesde = new Date(dto.fechaDesde);
    }

    if (dto.fechaHasta) {
      filtros.fechaHasta = new Date(dto.fechaHasta);
    }

    const resultado = await this.reservaRepository.listar(filtros, {
      pagina: dto.pagina || 1,
      limite: dto.limite || 10,
    });

    return {
      datos: resultado.datos.map((reserva) => ({
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
      })),
      total: resultado.total,
      pagina: resultado.pagina,
      limite: resultado.limite,
      totalPaginas: resultado.totalPaginas,
    };
  }
}
