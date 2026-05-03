import { Mesa } from '../entities/Mesa';
import { OpcionesPaginacion, ResultadoPaginado } from '../../types';

/**
 * Puerto para el repositorio de Mesa
 * Define las operaciones de persistencia para mesas
 */
export interface IMesaRepository {
  /**
   * Guarda una nueva mesa
   */
  guardar(mesa: Mesa): Promise<void>;

  /**
   * Busca una mesa por ID
   */
  buscarPorId(id: string): Promise<Mesa | null>;

  /**
   * Busca una mesa por número
   */
  buscarPorNumero(numero: number): Promise<Mesa | null>;

  /**
   * Lista todas las mesas con paginación
   */
  listar(opciones: OpcionesPaginacion): Promise<ResultadoPaginado<Mesa>>;

  /**
   * Lista mesas con capacidad mínima
   */
  listarPorCapacidadMinima(capacidadMinima: number): Promise<Mesa[]>;

  /**
   * Actualiza una mesa existente
   */
  actualizar(mesa: Mesa): Promise<void>;

  /**
   * Elimina una mesa
   */
  eliminar(id: string): Promise<void>;
}
