import { api } from '../core/api.js';

export interface Reserva {
  id: string;
  usuarioId: string | null;
  nombreCliente: string;
  emailCliente: string;
  mesaId: string;
  comensales: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export interface ReservaPage {
  datos: Reserva[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface DisponibilidadResult {
  disponible: boolean;
  motivo?: string;
  mesasSugeridas?: Array<{ id: string; numero: number; capacidad: number; forma: string }>;
}

export class ReservasModel {
  checkAvailability(payload: { comensales: number; fecha: string; horaInicio: string }): Promise<DisponibilidadResult> {
    return api.post<DisponibilidadResult>('/api/reservations/check-availability', payload);
  }

  create(payload: {
    nombreCliente: string;
    emailCliente: string;
    comensales: number;
    fecha: string;
    horaInicio: string;
    mesaId?: string;
  }): Promise<Reserva> {
    return api.post<Reserva>('/api/reservations', payload);
  }

  list(query: Record<string, string>): Promise<ReservaPage> {
    const params = new URLSearchParams(query);
    return api.get<ReservaPage>(`/api/reservations?${params.toString()}`);
  }

  updateStatus(id: string, estado: string): Promise<Reserva> {
    return api.patch<Reserva>(`/api/reservations/${id}/status`, { estado });
  }

  cancel(id: string): Promise<{ mensaje: string }> {
    return api.delete<{ mensaje: string }>(`/api/reservations/${id}`);
  }
}
