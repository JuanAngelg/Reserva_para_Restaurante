import { MesasModel } from '../models/mesas-model.js';

export class MesasController {
  private model = new MesasModel();

  list() {
    return this.model.list();
  }

  create(payload: { numero: number; capacidad: number; forma: 'round' | 'square'; posicionX: number; posicionY: number }) {
    return this.model.create(payload);
  }

  update(id: string, payload: { numero?: number; capacidad?: number; forma?: 'round' | 'square'; posicionX?: number; posicionY?: number }) {
    return this.model.update(id, payload);
  }

  remove(id: string) {
    return this.model.remove(id);
  }
}
