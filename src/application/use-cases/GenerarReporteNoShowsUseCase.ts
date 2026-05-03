import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { ReporteNoShowsDTO, FiltrosReporteDTO } from '../dtos/ReportesDTO';
import { ErrorValidacion } from '../errors';
import { EstadoReserva } from '../../types';

/**
 * Caso de uso: Generar reporte de no-shows
 */
export class GenerarReporteNoShowsUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(dto: FiltrosReporteDTO): Promise<ReporteNoShowsDTO> {
    // Parsear fechas
    const fechaDesde = new Date(dto.fechaDesde);
    const fechaHasta = new Date(dto.fechaHasta);

    if (isNaN(fechaDesde.getTime()) || isNaN(fechaHasta.getTime())) {
      throw new ErrorValidacion('Formato de fecha inválido');
    }

    // Contar no-shows
    const totalNoShows = await this.reservaRepository.contarPorEstado(
      EstadoReserva.NO_SHOW,
      fechaDesde,
      fechaHasta
    );

    // Contar total de reservas (excluyendo canceladas)
    const totalReservadas = await this.reservaRepository.contarPorEstado(
      EstadoReserva.RESERVADA,
      fechaDesde,
      fechaHasta
    );

    const totalOcupadas = await this.reservaRepository.contarPorEstado(
      EstadoReserva.OCUPADA,
      fechaDesde,
      fechaHasta
    );

    const totalReservas = totalReservadas + totalOcupadas + totalNoShows;

    const porcentajeNoShows =
      totalReservas > 0 ? (totalNoShows / totalReservas) * 100 : 0;

    // Detalles por día
    const detallesPorDia: {
      fecha: string;
      noShows: number;
      reservas: number;
    }[] = [];

    const fecha = new Date(fechaDesde);
    while (fecha <= fechaHasta) {
      const fechaStr = fecha.toISOString().split('T')[0] ?? '';
      const fechaDia = new Date(fechaStr);
      const fechaSiguiente = new Date(fechaDia);
      fechaSiguiente.setDate(fechaSiguiente.getDate() + 1);

      const noShowsDia = await this.reservaRepository.contarPorEstado(
        EstadoReserva.NO_SHOW,
        fechaDia,
        fechaSiguiente
      );

      const reservadasDia = await this.reservaRepository.contarPorEstado(
        EstadoReserva.RESERVADA,
        fechaDia,
        fechaSiguiente
      );

      const ocupadasDia = await this.reservaRepository.contarPorEstado(
        EstadoReserva.OCUPADA,
        fechaDia,
        fechaSiguiente
      );

      const totalDia = reservadasDia + ocupadasDia + noShowsDia;

      detallesPorDia.push({
        fecha: fechaStr,
        noShows: noShowsDia,
        reservas: totalDia,
      });

      fecha.setDate(fecha.getDate() + 1);
    }

    return {
      periodo: {
        desde: dto.fechaDesde,
        hasta: dto.fechaHasta,
      },
      totalNoShows,
      totalReservas,
      porcentajeNoShows,
      detallesPorDia,
    };
  }
}
