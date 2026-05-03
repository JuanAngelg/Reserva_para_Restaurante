import { Rol } from '../../types';

/**
 * Entidad Usuario del dominio
 * Representa un usuario del sistema con su rol y credenciales
 */
export class Usuario {
  constructor(
    public readonly id: string,
    public nombre: string,
    public email: string,
    public password: string,
    public rol: Rol,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  /**
   * Verifica si el usuario tiene un rol específico
   */
  tieneRol(rol: Rol): boolean {
    return this.rol === rol;
  }

  /**
   * Verifica si el usuario puede gestionar mesas
   */
  puedeGestionarMesas(): boolean {
    return this.rol === Rol.MANAGER;
  }

  /**
   * Verifica si el usuario puede hacer check-in
   */
  puedeHacerCheckIn(): boolean {
    return this.rol === Rol.HOST || this.rol === Rol.MANAGER;
  }

  /**
   * Verifica si el usuario puede ver reportes
   */
  puedeVerReportes(): boolean {
    return this.rol === Rol.MANAGER;
  }

  /**
   * Actualiza la información del usuario
   */
  actualizar(nombre?: string, email?: string): void {
    if (nombre) this.nombre = nombre;
    if (email) this.email = email;
    this.updatedAt = new Date();
  }
}
