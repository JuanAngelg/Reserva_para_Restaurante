import { TIEMPO } from '../constants';

/**
 * Entidad ConfiguracionRestaurante del dominio
 * Almacena los parámetros operativos del restaurante
 */
export class ConfiguracionRestaurante {
  constructor(
    public readonly id: string,
    public horaApertura: string,
    public horaCierre: string,
    public duracionReserva: number,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  /**
   * Valida que la configuración sea correcta
   */
  private validar(): void {
    if (!this.esHoraValida(this.horaApertura)) {
      throw new Error('Hora de apertura inválida');
    }
    if (!this.esHoraValida(this.horaCierre)) {
      throw new Error('Hora de cierre inválida');
    }
    if (this.horaApertura >= this.horaCierre) {
      throw new Error('La hora de apertura debe ser anterior a la de cierre');
    }
    if (this.duracionReserva <= 0) {
      throw new Error('La duración de reserva debe ser mayor a 0');
    }
  }

  /**
   * Valida formato de hora HH:mm
   */
  private esHoraValida(hora: string): boolean {
    return TIEMPO.REGEX_HORA_24H.test(hora);
  }

  /**
   * Calcula la hora de fin dada una hora de inicio
   */
  calcularHoraFin(horaInicio: string): string {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    if (horas === undefined || isNaN(horas) || minutos === undefined || isNaN(minutos)) {
      throw new Error('Formato de hora inválido');
    }
    
    const totalMinutos = horas * TIEMPO.MINUTOS_POR_HORA + minutos + this.duracionReserva;
    const nuevasHoras = Math.floor(totalMinutos / TIEMPO.MINUTOS_POR_HORA) % TIEMPO.HORAS_POR_DIA;
    const nuevosMinutos = totalMinutos % TIEMPO.MINUTOS_POR_HORA;
    return `${String(nuevasHoras).padStart(2, '0')}:${String(nuevosMinutos).padStart(2, '0')}`;
  }

  /**
   * Verifica si una hora está dentro del horario de operación
   */
  estaDentroHorario(hora: string): boolean {
    return hora >= this.horaApertura && hora <= this.horaCierre;
  }

  /**
   * Actualiza la configuración del restaurante
   */
  actualizar(datos: {
    horaApertura?: string;
    horaCierre?: string;
    duracionReserva?: number;
  }): void {
    if (datos.horaApertura) this.horaApertura = datos.horaApertura;
    if (datos.horaCierre) this.horaCierre = datos.horaCierre;
    if (datos.duracionReserva) this.duracionReserva = datos.duracionReserva;
    
    this.updatedAt = new Date();
    this.validar();
  }
}
