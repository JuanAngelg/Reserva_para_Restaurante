/**
 * Value Object Password
 * Representa una contraseña con validación de seguridad
 */
export class Password {
  private readonly valor: string;

  constructor(password: string, validar: boolean = true) {
    if (validar) {
      this.validar(password);
    }
    this.valor = password;
  }

  private validar(password: string): void {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('La contraseña debe contener al menos un número');
    }
  }

  obtenerValor(): string {
    return this.valor;
  }

  /**
   * Crea un Password sin validación (usado para passwords ya hasheados)
   */
  static crearSinValidacion(hash: string): Password {
    return new Password(hash, false);
  }
}
