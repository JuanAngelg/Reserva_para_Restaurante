import { describe, it, expect } from 'vitest';
import { Mesa } from '../../domain/entities/Mesa';
import { FormaMesa } from '../../types';

describe('Mesa - Entidad de Dominio', () => {
  it('debe crear una mesa válida', () => {
    const mesa = new Mesa(
      '123',
      1,
      4,
      FormaMesa.REDONDA,
      10,
      20
    );

    expect(mesa.id).toBe('123');
    expect(mesa.numero).toBe(1);
    expect(mesa.capacidad).toBe(4);
    expect(mesa.forma).toBe(FormaMesa.REDONDA);
  });

  it('debe validar que la capacidad sea mayor a 0', () => {
    expect(() => {
      new Mesa('123', 1, 0, FormaMesa.REDONDA, 10, 20);
    }).toThrow('La capacidad debe ser mayor a 0');
  });

  it('debe verificar si puede acomodar comensales', () => {
    const mesa = new Mesa('123', 1, 4, FormaMesa.REDONDA, 10, 20);

    expect(mesa.puedeAcomodar(3)).toBe(true);
    expect(mesa.puedeAcomodar(4)).toBe(true);
    expect(mesa.puedeAcomodar(5)).toBe(false);
  });

  it('debe calcular eficiencia de ocupación correctamente', () => {
    const mesa = new Mesa('123', 1, 4, FormaMesa.REDONDA, 10, 20);

    expect(mesa.calcularEficienciaOcupacion(4)).toBe(1); // 100%
    expect(mesa.calcularEficienciaOcupacion(2)).toBe(0.5); // 50%
    expect(mesa.calcularEficienciaOcupacion(5)).toBe(0); // No puede acomodar
  });

  it('debe actualizar información correctamente', () => {
    const mesa = new Mesa('123', 1, 4, FormaMesa.REDONDA, 10, 20);

    mesa.actualizar({
      capacidad: 6,
      forma: FormaMesa.CUADRADA,
    });

    expect(mesa.capacidad).toBe(6);
    expect(mesa.forma).toBe(FormaMesa.CUADRADA);
    expect(mesa.numero).toBe(1); // No cambió
  });
});
