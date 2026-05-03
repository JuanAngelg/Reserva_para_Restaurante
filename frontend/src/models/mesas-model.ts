import { api } from '../core/api.js';

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  forma: 'round' | 'square';
  posicionX: number;
  posicionY: number;
}

export interface MesaPage {
  datos: Mesa[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export class MesasModel {
  list(): Promise<MesaPage> {
    return api.get<MesaPage>('/api/mesas');
  }

  create(payload: Omit<Mesa, 'id'>): Promise<Mesa> {
    return api.post<Mesa>('/api/mesas', payload);
  }

  update(id: string, payload: Partial<Omit<Mesa, 'id'>>): Promise<Mesa> {
    return api.put<Mesa>(`/api/mesas/${id}`, payload);
  }

  remove(id: string): Promise<{ mensaje: string }> {
    return api.delete<{ mensaje: string }>(`/api/mesas/${id}`);
  }
}
