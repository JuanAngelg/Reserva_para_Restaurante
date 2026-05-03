import { Usuario } from '../entities/Usuario';
import { OpcionesPaginacion, ResultadoPaginado } from '../../types';

/**
 * Puerto para el repositorio de Usuario
 * Define las operaciones de persistencia para usuarios
 */
export interface IUsuarioRepository {
  /**
   * Guarda un nuevo usuario
   */
  guardar(usuario: Usuario): Promise<void>;

  /**
   * Busca un usuario por ID
   */
  buscarPorId(id: string): Promise<Usuario | null>;

  /**
   * Busca un usuario por email
   */
  buscarPorEmail(email: string): Promise<Usuario | null>;

  /**
   * Actualiza un usuario existente
   */
  actualizar(usuario: Usuario): Promise<void>;

  /**
   * Lista todos los usuarios con paginación
   */
  listar(opciones: OpcionesPaginacion): Promise<ResultadoPaginado<Usuario>>;

  /**
   * Elimina un usuario
   */
  eliminar(id: string): Promise<void>;
}
