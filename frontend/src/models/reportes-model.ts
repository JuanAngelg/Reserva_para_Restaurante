import { api } from '../core/api.js';

export interface ReporteOcupacion {
  fecha: string;
  porcentajeOcupacion: number;
  capacidadUtilizada: number;
  capacidadTotal: number;
}

export interface ReporteNoShows {
  totalNoShows: number;
}

export class ReportesModel {
  ocupacion(fechaDesde: string, fechaHasta: string): Promise<ReporteOcupacion[]> {
    return api.get<ReporteOcupacion[]>(`/api/reports/occupancy?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }

  noShows(fechaDesde: string, fechaHasta: string): Promise<ReporteNoShows> {
    return api.get<ReporteNoShows>(`/api/reports/no-shows?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }
}
