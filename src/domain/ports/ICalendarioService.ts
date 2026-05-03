/**
 * Evento de calendario para sincronización externa
 */
export interface EventoCalendario {
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion?: string;
  asistentes?: string[];
}

/**
 * Puerto para el servicio de calendario
 * Permite integración con calendarios externos (Google Calendar, etc.)
 */
export interface ICalendarioService {
  /**
   * Crea un evento en el calendario externo
   */
  crearEvento(evento: EventoCalendario): Promise<string>;

  /**
   * Actualiza un evento existente
   */
  actualizarEvento(eventoId: string, evento: EventoCalendario): Promise<void>;

  /**
   * Elimina un evento del calendario
   */
  eliminarEvento(eventoId: string): Promise<void>;

  /**
   * Verifica si el servicio está disponible
   */
  estaDisponible(): Promise<boolean>;
}
