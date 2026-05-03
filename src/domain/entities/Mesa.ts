import { FormaMesa } from '../../types';
import { MESA_VALIDACION } from '../constants';

/**
 * Entidad Mesa del dominio
 * Representa una mesa del restaurante con su capacidad y ubicación
 */

export class Mesa {
  constructor(
    public readonly id: string,
    public numero: number,
    public capacidad: number,
    public forma: FormaMesa,
    public posicionX: number,
    public posicionY: number,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  /**
   * Valida que los datos de la mesa sean correctos
   */
  private validar(): void {
    if (this.capacidad < MESA_VALIDACION.CAPACIDAD_MINIMA) {
      throw new Error(MESA_VALIDACION.ERRORES.CAPACIDAD_INVALIDA);
    }
    if (this.numero < MESA_VALIDACION.CAPACIDAD_MINIMA) {
      throw new Error(MESA_VALIDACION.ERRORES.NUMERO_INVALIDO);
    }
  }

  /**
   * Verifica si la mesa puede acomodar a un número de comensales
   */
  puedeAcomodar(comensales: number): boolean {
    return this.capacidad >= comensales;
  }

  /**
   * Calcula la eficiencia de ocupación dado un número de comensales
   * Retorna un valor entre 0 y 1, donde 1 es ocupación perfecta
   */
  calcularEficienciaOcupacion(comensales: number): number {
    if (comensales > this.capacidad) return 0;
    return comensales / this.capacidad;
  }

  /**
   * Actualiza la información de la mesa
   */
  actualizar(datos: {
    numero?: number;
    capacidad?: number;
    forma?: FormaMesa;
    posicionX?: number;
    posicionY?: number;
  }): void {
    if (datos.numero !== undefined) this.numero = datos.numero;
    if (datos.capacidad !== undefined) this.capacidad = datos.capacidad;
    if (datos.forma !== undefined) this.forma = datos.forma;
    if (datos.posicionX !== undefined) this.posicionX = datos.posicionX;
    if (datos.posicionY !== undefined) this.posicionY = datos.posicionY;
    
    this.updatedAt = new Date();
    this.validar();
  }
}
