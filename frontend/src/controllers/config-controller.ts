import { ConfigModel } from '../models/config-model.js';

export class ConfigController {
  private model = new ConfigModel();

  get() {
    return this.model.get();
  }

  update(payload: { horaApertura?: string; horaCierre?: string; duracionReserva?: number }) {
    return this.model.update(payload);
  }
}
