/**
 * DTOs para reportes y analítica
 */

export interface ReporteOcupacionDTO {
  fecha: string;
  porcentajeOcupacion: number;
  totalReservas: number;
  totalComensales: number;
  capacidadTotal: number;
  horasPico: HoraPicoDTO[];
}

export interface HoraPicoDTO {
  hora: string;
  numeroReservas: number;
  comensales: number;
}

export interface ReporteNoShowsDTO {
  periodo: {
    desde: string;
    hasta: string;
  };
  totalNoShows: number;
  totalReservas: number;
  porcentajeNoShows: number;
  detallesPorDia: {
    fecha: string;
    noShows: number;
    reservas: number;
  }[];
}

export interface FiltrosReporteDTO {
  fechaDesde: string;
  fechaHasta: string;
}
