import { ReservasModel } from '../models/reservas-model.js';

export class ReservasController {
  private model = new ReservasModel();

  checkAvailability(payload: { comensales: number; fecha: string; horaInicio: string }) {
    return this.model.checkAvailability(payload);
  }

  create(payload: { nombreCliente: string; emailCliente: string; comensales: number; fecha: string; horaInicio: string; mesaId?: string }) {
    return this.model.create(payload);
  }

  list(query: Record<string, string>) {
    return this.model.list(query);
  }

  updateStatus(id: string, estado: string) {
    return this.model.updateStatus(id, estado);
  }

  cancel(id: string) {
    return this.model.cancel(id);
  }
}
