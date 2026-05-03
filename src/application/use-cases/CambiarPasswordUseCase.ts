import { IUsuarioRepository } from '../../domain/ports/IUsuarioRepository';
import { IAuthService } from '../../domain/ports/IAuthService';
import { CambiarPasswordDTO } from '../dtos/AuthDTO';
import { ErrorNoEncontrado, ErrorAutenticacion } from '../errors';
import { Password } from '../../domain/value-objects/Password';

/**
 * Caso de uso: Cambiar contraseña
 */
export class CambiarPasswordUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly authService: IAuthService
  ) {}

  async ejecutar(usuarioId: string, dto: CambiarPasswordDTO): Promise<void> {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new ErrorNoEncontrado('Usuario', usuarioId);
    }

    // Verificar password actual
    const passwordValida = await this.authService.compararPassword(
      dto.passwordActual,
      usuario.password
    );

    if (!passwordValida) {
      throw new ErrorAutenticacion('La contraseña actual es incorrecta');
    }

    // Validar y hashear nueva password
    const nuevaPassword = new Password(dto.passwordNueva);
    const nuevoHash = await this.authService.hashearPassword(
      nuevaPassword.obtenerValor()
    );

    // Actualizar password
    usuario.password = nuevoHash;
    usuario.updatedAt = new Date();
    await this.usuarioRepository.actualizar(usuario);
  }
}
