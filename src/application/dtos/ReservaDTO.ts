import { EstadoReserva } from '../../types';

/**
 * DTOs para gestión de reservas
 */

export interface CrearReservaDTO {
  usuarioId?: string; // Opcional si es anónimo
  nombreCliente: string;
  emailCliente: string;
  comensales: number;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  mesaId?: string; // Opcional: si no se especifica, se asigna automáticamente
}

export interface ActualizarEstadoReservaDTO {
  estado: EstadoReserva;
}

export interface ReservaDTO {
  id: string;
  usuarioId: string | null;
  nombreCliente: string;
  emailCliente: string;
  mesaId: string;
  comensales: number;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  estado: EstadoReserva;
  createdAt: Date;
  updatedAt: Date;
}

export interface FiltrosReservaDTO {
  usuarioId?: string;
  mesaId?: string;
  fecha?: string;
  estado?: EstadoReserva;
  fechaDesde?: string;
  fechaHasta?: string;
  pagina?: number;
  limite?: number;
}

export interface VerificarDisponibilidadDTO {
  comensales: number;
  fecha: string;
  horaInicio: string;
}

export interface ResultadoDisponibilidadDTO {
  disponible: boolean;
  mesasSugeridas?: {
    id: string;
    numero: number;
    capacidad: number;
    forma: string;
  }[];
  motivo?: string;
}
