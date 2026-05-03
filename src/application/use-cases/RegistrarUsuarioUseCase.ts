import { Usuario } from '../../domain/entities/Usuario';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { IUsuarioRepository } from '../../domain/ports/IUsuarioRepository';
import { IAuthService } from '../../domain/ports/IAuthService';
import { RegistrarUsuarioDTO, TokenDTO } from '../dtos/AuthDTO';
import { ErrorConflicto } from '../errors';
import { Rol } from '../../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de uso: Registrar nuevo usuario
 */
export class RegistrarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly authService: IAuthService
  ) {}

  async ejecutar(dto: RegistrarUsuarioDTO): Promise<TokenDTO> {
    // Validar email
    const email = new Email(dto.email);

    // Verificar que el email no esté registrado
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(
      email.obtenerValor()
    );

    if (usuarioExistente) {
      throw new ErrorConflicto('El email ya está registrado');
    }

    // Validar y hashear password
    const password = new Password(dto.password);
    const passwordHash = await this.authService.hashearPassword(
      password.obtenerValor()
    );

    // Crear usuario (por defecto es CLIENT si no se especifica)
    const usuario = new Usuario(
      uuidv4(),
      dto.nombre,
      email.obtenerValor(),
      passwordHash,
      dto.rol || Rol.CLIENT
    );

    // Guardar usuario
    await this.usuarioRepository.guardar(usuario);

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
