import { TIEMPO } from '../constants';

/**
 * Value Object RangoHorario
 * Representa un rango de tiempo válido
 */
export class RangoHorario {
  constructor(
    public readonly inicio: string,
    public readonly fin: string
  ) {
    this.validar();
  }

    /**
     * Valida que las horas sean válidas y que inicio < fin
     * @throws Error si el formato es inválido o inicio >= fin
     */
  private validar(): void {
    if (!this.esHoraValida(this.inicio)) {
      throw new Error('Hora de inicio inválida');
    }
    if (!this.esHoraValida(this.fin)) {
      throw new Error('Hora de fin inválida');
    }
    if (this.inicio >= this.fin) {
      throw new Error('La hora de inicio debe ser anterior a la de fin');
    }
  }

    /**
     * Verifica si una hora tiene el formato HH:mm válido
     * @param hora - Hora a validar
     * @returns true si el formato es válido
     */
  private esHoraValida(hora: string): boolean {
      return TIEMPO.REGEX_HORA_24H.test(hora);
  }

  /**
   * Verifica si hay conflicto con otro rango horario
   */
  conflictoCon(otro: RangoHorario): boolean {
    return !(this.fin <= otro.inicio || this.inicio >= otro.fin);
  }

  /**
   * Calcula la duración en minutos
   */
  duracionEnMinutos(): number {
    const [horasInicio, minutosInicio] = this.inicio.split(':').map(Number);
    const [horasFin, minutosFin] = this.fin.split(':').map(Number);
    
    if (
      horasInicio === undefined || isNaN(horasInicio) ||
      minutosInicio === undefined || isNaN(minutosInicio) ||
      horasFin === undefined || isNaN(horasFin) ||
      minutosFin === undefined || isNaN(minutosFin)
    ) {
      return 0;
    }
    
    const minutosTotalInicio = horasInicio * TIEMPO.MINUTOS_POR_HORA + minutosInicio;
    const minutosTotalFin = horasFin * TIEMPO.MINUTOS_POR_HORA + minutosFin;
    
    return minutosTotalFin - minutosTotalInicio;
  }
}
