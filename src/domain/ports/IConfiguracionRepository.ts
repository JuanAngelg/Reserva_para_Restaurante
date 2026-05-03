import { ConfiguracionRestaurante } from '../entities/ConfiguracionRestaurante';

/**
 * Puerto para el repositorio de ConfiguracionRestaurante
 * Define las operaciones de persistencia para la configuración
 */
export interface IConfiguracionRepository {
  /**
   * Obtiene la configuración actual del restaurante
   */
  obtener(): Promise<ConfiguracionRestaurante | null>;

  /**
   * Guarda o actualiza la configuración del restaurante
   */
  guardar(configuracion: ConfiguracionRestaurante): Promise<void>;
}
