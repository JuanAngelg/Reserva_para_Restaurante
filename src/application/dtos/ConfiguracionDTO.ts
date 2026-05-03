/**
 * DTOs para configuración del restaurante
 */

export interface ConfiguracionRestauranteDTO {
  id: string;
  horaApertura: string;
  horaCierre: string;
  duracionReserva: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActualizarConfiguracionDTO {
  horaApertura?: string;
  horaCierre?: string;
  duracionReserva?: number;
}
