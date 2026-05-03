import { IUsuarioRepository } from '../../domain/ports/IUsuarioRepository';
import { UsuarioDTO } from '../dtos/AuthDTO';
import { ErrorNoEncontrado } from '../errors';

/**
 * Caso de uso: Obtener perfil de usuario
 */
export class ObtenerPerfilUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async ejecutar(usuarioId: string): Promise<UsuarioDTO> {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new ErrorNoEncontrado('Usuario', usuarioId);
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      createdAt: usuario.createdAt,
    };
  }
}
