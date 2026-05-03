/**
 * Value Object Email
 * Representa un email válido en el dominio
 */
export class Email {
  private readonly valor: string;

  constructor(email: string) {
    this.validar(email);
    this.valor = email.toLowerCase().trim();
  }

  private validar(email: string): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  obtenerValor(): string {
    return this.valor;
  }

  equals(otro: Email): boolean {
    return this.valor === otro.valor;
  }

  toString(): string {
    return this.valor;
  }
}
