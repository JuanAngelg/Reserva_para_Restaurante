import { ReportesModel } from '../models/reportes-model.js';

export class ReportesController {
  private model = new ReportesModel();

  ocupacion(fechaDesde: string, fechaHasta: string) {
    return this.model.ocupacion(fechaDesde, fechaHasta);
  }

  noShows(fechaDesde: string, fechaHasta: string) {
    return this.model.noShows(fechaDesde, fechaHasta);
  }
}
