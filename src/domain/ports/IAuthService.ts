/**
 * Puerto para el servicio de autenticación
 * Define las operaciones criptográficas independientes de la implementación
 */
export interface IAuthService {
  /**
   * Hashea una contraseña
   */
  hashearPassword(password: string): Promise<string>;

  /**
   * Compara una contraseña con su hash
   */
  compararPassword(password: string, hash: string): Promise<boolean>;

  /**
   * Genera un token JWT para un usuario
   */
  generarToken(payload: { id: string; email: string; rol: string }): string;

  /**
   * Verifica y decodifica un token JWT
   */
  verificarToken(token: string): Promise<{
    id: string;
    email: string;
    rol: string;
  }>;
}
