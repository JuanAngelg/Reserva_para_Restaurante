import { IUsuarioRepository } from '../../domain/ports/IUsuarioRepository';
import { IAuthService } from '../../domain/ports/IAuthService';
import { LoginDTO, TokenDTO } from '../dtos/AuthDTO';
import { ErrorAutenticacion } from '../errors';

/**
 * Caso de uso: Login de usuario
 */
export class LoginUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly authService: IAuthService
  ) {}

  async ejecutar(dto: LoginDTO): Promise<TokenDTO> {
    // Buscar usuario por email
    const usuario = await this.usuarioRepository.buscarPorEmail(dto.email);

    if (!usuario) {
      throw new ErrorAutenticacion('Credenciales inválidas');
    }

    // Verificar password
    const passwordValida = await this.authService.compararPassword(
      dto.password,
      usuario.password
    );

    if (!passwordValida) {
      throw new ErrorAutenticacion('Credenciales inválidas');
    }

    // Generar token
    const token = this.authService.generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
      },
    };
  }
}
