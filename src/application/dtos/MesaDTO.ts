import { FormaMesa } from '../../types';

/**
 * DTOs para gestión de mesas
 */

export interface CrearMesaDTO {
  numero: number;
  capacidad: number;
  forma: FormaMesa;
  posicionX: number;
  posicionY: number;
}

export interface ActualizarMesaDTO {
  numero?: number;
  capacidad?: number;
  forma?: FormaMesa;
  posicionX?: number;
  posicionY?: number;
}

export interface MesaDTO {
  id: string;
  numero: number;
  capacidad: number;
  forma: FormaMesa;
  posicionX: number;
  posicionY: number;
  createdAt: Date;
  updatedAt: Date;
}
