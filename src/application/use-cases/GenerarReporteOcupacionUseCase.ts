import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { ServicioAsignacionInteligente } from '../../domain/services/ServicioAsignacionInteligente';
import {
  ReporteOcupacionDTO,
  HoraPicoDTO,
  FiltrosReporteDTO,
} from '../dtos/ReportesDTO';
import { ErrorValidacion } from '../errors';
import { EstadoReserva } from '../../types';

/**
 * Caso de uso: Generar reporte de ocupación
 */
export class GenerarReporteOcupacionUseCase {
  private readonly servicioAsignacion = new ServicioAsignacionInteligente();

  constructor(
    private readonly reservaRepository: IReservaRepository,
    private readonly mesaRepository: IMesaRepository
  ) {}

  async ejecutar(dto: FiltrosReporteDTO): Promise<ReporteOcupacionDTO[]> {
    // Parsear fechas
    const fechaDesde = new Date(dto.fechaDesde);
    const fechaHasta = new Date(dto.fechaHasta);

    if (isNaN(fechaDesde.getTime()) || isNaN(fechaHasta.getTime())) {
      throw new ErrorValidacion('Formato de fecha inválido');
    }

    // Obtener todas las mesas
    const resultadoMesas = await this.mesaRepository.listar({
      pagina: 1,
      limite: 1000,
    });
    const mesas = resultadoMesas.datos;

    // Generar reporte por cada día
    const reportes: ReporteOcupacionDTO[] = [];
    const fecha = new Date(fechaDesde);

    while (fecha <= fechaHasta) {
      const fechaStr = fecha.toISOString().split('T')[0] ?? '';
      const fechaDia = new Date(fechaStr);

      // Obtener reservas del día
      const resultadoReservas = await this.reservaRepository.listar(
        {
          fecha: fechaDia,
          estado: EstadoReserva.OCUPADA, // Solo contar las que se ocuparon
        },
        { pagina: 1, limite: 1000 }
      );

      const reservas = resultadoReservas.datos;

      // Calcular estadísticas
      const stats = this.servicioAsignacion.calcularEstadisticasOcupacion(
        mesas,
        reservas
      );

      // Agrupar reservas por hora
      const reservasPorHora = new Map<string, number>();
      const comensalesPorHora = new Map<string, number>();

      reservas.forEach((reserva) => {
        const hora = reserva.horaInicio.split(':')[0] + ':00';
        reservasPorHora.set(hora, (reservasPorHora.get(hora) || 0) + 1);
        comensalesPorHora.set(
          hora,
          (comensalesPorHora.get(hora) || 0) + reserva.comensales
        );
      });

      // Generar horas pico
      const horasPico: HoraPicoDTO[] = Array.from(reservasPorHora.entries())
        .map(([hora, numeroReservas]) => ({
          hora,
          numeroReservas,
          comensales: comensalesPorHora.get(hora) || 0,
        }))
        .sort((a, b) => b.numeroReservas - a.numeroReservas)
        .slice(0, 5);

      reportes.push({
        fecha: fechaStr,
        porcentajeOcupacion: stats.porcentajeOcupacion,
        totalReservas: reservas.length,
        totalComensales: stats.capacidadUtilizada,
        capacidadTotal: stats.capacidadTotal,
        horasPico,
      });

      // Siguiente día
      fecha.setDate(fecha.getDate() + 1);
    }

    return reportes;
  }
}
