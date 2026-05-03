import { Reserva } from '../entities/Reserva';
import { EstadoReserva, OpcionesPaginacion, ResultadoPaginado } from '../../types';

/**
 * Filtros para búsqueda de reservas
 */
export interface FiltrosReserva {
  usuarioId?: string;
  mesaId?: string;
  fecha?: Date;
  estado?: EstadoReserva;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

/**
 * Puerto para el repositorio de Reserva
 * Define las operaciones de persistencia para reservas
 */
export interface IReservaRepository {
  /**
   * Guarda una nueva reserva (debe ser transaccional)
   */
  guardar(reserva: Reserva): Promise<void>;

  /**
   * Busca una reserva por ID
   */
  buscarPorId(id: string): Promise<Reserva | null>;

  /**
   * Lista reservas con filtros y paginación
   */
  listar(
    filtros: FiltrosReserva,
    opciones: OpcionesPaginacion
  ): Promise<ResultadoPaginado<Reserva>>;

  /**
   * Busca reservas activas para una mesa en una fecha y rango horario
   * Crucial para validar disponibilidad y prevenir overbooking
   */
  buscarReservasActivasPorMesaYRango(
    mesaId: string,
    fecha: Date,
    horaInicio: string,
    horaFin: string
  ): Promise<Reserva[]>;

  /**
   * Actualiza una reserva existente
   */
  actualizar(reserva: Reserva): Promise<void>;

  /**
   * Elimina una reserva
   */
  eliminar(id: string): Promise<void>;

  /**
   * Cuenta reservas por estado en un rango de fechas
   */
  contarPorEstado(
    estado: EstadoReserva,
    fechaDesde: Date,
    fechaHasta: Date
  ): Promise<number>;

  /**
   * Inicia una transacción para operaciones atómicas
   */
  iniciarTransaccion(): Promise<void>;

  /**
   * Confirma la transacción actual
   */
  confirmarTransaccion(): Promise<void>;

  /**
   * Revierte la transacción actual
   */
  revertirTransaccion(): Promise<void>;
}
