import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../domain/ports/IAuthService';
import { AUTH } from '../../domain/constants';

/**
 * Adaptador de autenticación usando bcryptjs y JWT
 * Implementa el puerto IAuthService
 */

export class AuthAdapter implements IAuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'secret_super_seguro_cambiar_en_produccion';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Hashea una contraseña usando bcrypt
   * @param password - Contraseña en texto plano
   * @returns Hash bcrypt de la contraseña
   */
  async hashearPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, AUTH.BCRYPT_SALT_ROUNDS);
  }

  /**
   * Compara una contraseña con su hash
   * @param password - Contraseña en texto plano
   * @param hash - Hash almacenado
   * @returns true si coinciden, false en caso contrario
   */
  async compararPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Genera un token JWT para un usuario autenticado
   * @param payload - Datos del usuario a incluir en el token
   * @returns Token JWT firmado
   */
  generarToken(payload: { id: string; email: string; rol: string }): string {
    return jwt.sign(payload, this.jwtSecret, { 
      expiresIn: this.jwtExpiresIn 
    } as jwt.SignOptions);
  }

  async verificarToken(token: string): Promise<{
    id: string;
    email: string;
    rol: string;
  }> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.jwtSecret, (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string') {
          reject(new Error('Token inválido'));
        } else {
          resolve({
            id: (decoded as any).id,
            email: (decoded as any).email,
            rol: (decoded as any).rol,
          });
        }
      });
    });
  }
}
