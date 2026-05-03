import { EstadoReserva } from '../../types';
import { RESERVA_VALIDACION, TIEMPO } from '../constants';

/**
 * Entidad Reserva del dominio
 * Representa una reserva de mesa en el restaurante
 */
export class Reserva {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string | null,
    public nombreCliente: string,
    public emailCliente: string,
    public mesaId: string,
    public comensales: number,
    public fecha: Date,
    public horaInicio: string,
    public horaFin: string,
    public estado: EstadoReserva,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  /**
   * Valida que los datos de la reserva sean correctos
   */
  private validar(): void {
    if (this.comensales < RESERVA_VALIDACION.COMENSALES_MINIMO) {
      throw new Error(RESERVA_VALIDACION.ERRORES.COMENSALES_INVALIDO);
    }
    if (!this.esHoraValida(this.horaInicio)) {
      throw new Error(RESERVA_VALIDACION.ERRORES.FORMATO_HORA_INVALIDO);
    }
    if (!this.esHoraValida(this.horaFin)) {
      throw new Error(RESERVA_VALIDACION.ERRORES.FORMATO_HORA_INVALIDO);
    }
    if (this.horaInicio >= this.horaFin) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin');
    }
  }

  /**
   * Valida formato de hora HH:mm
   */
  private esHoraValida(hora: string): boolean {
    return TIEMPO.REGEX_HORA_24H.test(hora);
  }

  /**
   * Verifica si la reserva está en un rango de tiempo dado
   */
  conflictoConRango(horaInicio: string, horaFin: string): boolean {
    // Hay conflicto si se solapan los rangos
    return !(this.horaFin <= horaInicio || this.horaInicio >= horaFin);
  }

  /**
   * Cambia el estado de la reserva
   */
  cambiarEstado(nuevoEstado: EstadoReserva): void {
    this.validarTransicionEstado(nuevoEstado);
    this.estado = nuevoEstado;
    this.updatedAt = new Date();
  }

  /**
   * Valida que la transición de estado sea permitida
   */
  private validarTransicionEstado(nuevoEstado: EstadoReserva): void {
    const transicionesValidas: Record<EstadoReserva, EstadoReserva[]> = {
      [EstadoReserva.RESERVADA]: [
        EstadoReserva.OCUPADA,
        EstadoReserva.CANCELADA,
        EstadoReserva.NO_SHOW,
      ],
      [EstadoReserva.OCUPADA]: [EstadoReserva.CANCELADA],
      [EstadoReserva.CANCELADA]: [],
      [EstadoReserva.NO_SHOW]: [],
    };

    const permitidas = transicionesValidas[this.estado];
    if (!permitidas || !permitidas.includes(nuevoEstado)) {
      throw new Error(
        `No se puede cambiar de ${this.estado} a ${nuevoEstado}`
      );
    }
  }

  /**
   * Completa el check-in de la reserva
   */
  hacerCheckIn(): void {
    this.cambiarEstado(EstadoReserva.OCUPADA);
  }

  /**
   * Cancela la reserva
   */
  cancelar(): void {
    this.cambiarEstado(EstadoReserva.CANCELADA);
  }

  /**
   * Marca como no-show
   */
  marcarNoShow(): void {
    this.cambiarEstado(EstadoReserva.NO_SHOW);
  }

  /**
   * Obtiene la duración de la reserva en minutos
   */
  obtenerDuracionMinutos(): number {
    const [horas, minutos] = this.horaInicio.split(':').map(Number);
    const [horasF, minutosF] = this.horaFin.split(':').map(Number);
    
    if (horas === undefined || minutos === undefined || horasF === undefined || minutosF === undefined) {
      return 0;
    }
    
    const inicio = horas * TIEMPO.MINUTOS_POR_HORA + minutos;
    const fin = horasF * TIEMPO.MINUTOS_POR_HORA + minutosF;
    return fin - inicio;
  }
}
