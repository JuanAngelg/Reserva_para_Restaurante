import { IUsuarioRepository } from '../../domain/ports/IUsuarioRepository';
import { RecuperarPasswordDTO } from '../dtos/AuthDTO';
import { Email } from '../../domain/value-objects/Email';

/**
 * Caso de uso: Recuperacion de contrasena (simulada)
 */
export class RecuperarPasswordUseCase {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async ejecutar(dto: RecuperarPasswordDTO): Promise<{ mensaje: string }> {
    const email = new Email(dto.email);
    const usuario = await this.usuarioRepository.buscarPorEmail(
      email.obtenerValor()
    );

    // Simulacion: si existe, se consideraria envio de enlace
    if (usuario) {
      // No hacemos cambios persistentes en la simulacion
    }

    return {
      mensaje: 'Si el email existe, se enviara un enlace de recuperacion.',
    };
  }
}
