import { api } from '../core/api.js';

export interface Configuracion {
  id: string;
  horaApertura: string;
  horaCierre: string;
  duracionReserva: number;
}

export class ConfigModel {
  get(): Promise<Configuracion> {
    return api.get<Configuracion>('/api/config');
  }

  update(payload: Partial<Configuracion>): Promise<Configuracion> {
    return api.put<Configuracion>('/api/config', payload);
  }
}
