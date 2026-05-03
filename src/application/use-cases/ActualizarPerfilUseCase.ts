import { IUsuarioRepository } from '../../domain/ports/IUsuarioRepository';
import { ActualizarPerfilDTO, UsuarioDTO } from '../dtos/AuthDTO';
import { ErrorNoEncontrado, ErrorConflicto } from '../errors';
import { Email } from '../../domain/value-objects/Email';

/**
 * Caso de uso: Actualizar perfil de usuario
 */
export class ActualizarPerfilUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async ejecutar(
    usuarioId: string,
    dto: ActualizarPerfilDTO
  ): Promise<UsuarioDTO> {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new ErrorNoEncontrado('Usuario', usuarioId);
    }

    // Si cambia el email, verificar que no esté en uso
    if (dto.email && dto.email !== usuario.email) {
      const emailObj = new Email(dto.email);
      const usuarioConEmail = await this.usuarioRepository.buscarPorEmail(
        emailObj.obtenerValor()
      );

      if (usuarioConEmail) {
        throw new ErrorConflicto('El email ya está en uso');
      }
    }

    // Actualizar usuario
    usuario.actualizar(dto.nombre, dto.email);
    await this.usuarioRepository.actualizar(usuario);

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      createdAt: usuario.createdAt,
    };
  }
}
