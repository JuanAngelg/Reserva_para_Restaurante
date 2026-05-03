import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { IConfiguracionRepository } from '../../domain/ports/IConfiguracionRepository';
import { ServicioDisponibilidad } from '../../domain/services/ServicioDisponibilidad';
import { ServicioAsignacionInteligente } from '../../domain/services/ServicioAsignacionInteligente';
import {
  VerificarDisponibilidadDTO,
  ResultadoDisponibilidadDTO,
} from '../dtos/ReservaDTO';
import { ErrorNoEncontrado, ErrorValidacion } from '../errors';

/**
 * Caso de uso: Verificar disponibilidad de mesas
 */
export class VerificarDisponibilidadUseCase {
  private readonly servicioDisponibilidad = new ServicioDisponibilidad();
  private readonly servicioAsignacion = new ServicioAsignacionInteligente();

  constructor(
    private readonly mesaRepository: IMesaRepository,
    private readonly reservaRepository: IReservaRepository,
    private readonly configuracionRepository: IConfiguracionRepository
  ) {}

  async ejecutar(
    dto: VerificarDisponibilidadDTO
  ): Promise<ResultadoDisponibilidadDTO> {
    // Obtener configuración
    const configuracion = await this.configuracionRepository.obtener();
    if (!configuracion) {
      throw new ErrorNoEncontrado('Configuración del restaurante');
    }

    // Parsear fecha
    const fecha = new Date(dto.fecha);
    if (isNaN(fecha.getTime())) {
      throw new ErrorValidacion('Formato de fecha inválido');
    }

    // Calcular hora de fin
    const horaFin = configuracion.calcularHoraFin(dto.horaInicio);

    // Validar horario del restaurante
    const resultadoHorario = this.servicioDisponibilidad.validarHorarioRestaurante(
      dto.horaInicio,
      horaFin,
      configuracion
    );

    if (!resultadoHorario.disponible) {
      return {
        disponible: false,
        motivo: resultadoHorario.motivo,
      };
    }

    // Obtener mesas con capacidad suficiente
    const mesasConCapacidad = await this.mesaRepository.listarPorCapacidadMinima(
      dto.comensales
    );

    if (mesasConCapacidad.length === 0) {
      return {
        disponible: false,
        motivo: `No hay mesas con capacidad para ${dto.comensales} comensales`,
      };
    }

    // Obtener reservas activas por mesa
    const reservasPorMesa = new Map();
    for (const mesa of mesasConCapacidad) {
      const reservas =
        await this.reservaRepository.buscarReservasActivasPorMesaYRango(
          mesa.id,
          fecha,
          dto.horaInicio,
          horaFin
        );
      reservasPorMesa.set(mesa.id, reservas);
    }

    // Filtrar mesas disponibles
    const mesasDisponibles =
      this.servicioDisponibilidad.filtrarMesasDisponibles(
        mesasConCapacidad,
        dto.comensales,
        reservasPorMesa,
        dto.horaInicio,
        horaFin
      );

    if (mesasDisponibles.length === 0) {
      return {
        disponible: false,
        motivo: 'No hay mesas disponibles en ese horario',
      };
    }

    // Sugerir mejores alternativas
    const alternativas = this.servicioAsignacion.sugerirAlternativas(
      mesasDisponibles,
      dto.comensales,
      5
    );

    return {
      disponible: true,
      mesasSugeridas: alternativas.map((mesa) => ({
        id: mesa.id,
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        forma: mesa.forma,
      })),
    };
  }
}
