import { describe, it, expect } from 'vitest';
import { ServicioAsignacionInteligente } from '../../domain/services/ServicioAsignacionInteligente';
import { Mesa } from '../../domain/entities/Mesa';
import { FormaMesa } from '../../types';

describe('ServicioAsignacionInteligente - Lógica de Negocio', () => {
  const servicio = new ServicioAsignacionInteligente();

  it('debe seleccionar la mesa óptima para minimizar desperdicio', () => {
    const mesas = [
      new Mesa('1', 1, 2, FormaMesa.REDONDA, 10, 10),
      new Mesa('2', 2, 4, FormaMesa.REDONDA, 20, 10),
      new Mesa('3', 3, 8, FormaMesa.CUADRADA, 30, 10),
    ];

    const mesaOptima = servicio.seleccionarMesaOptima(mesas, 4);

    // Debe elegir la mesa de 4 (ocupación 100%)
    expect(mesaOptima?.id).toBe('2');
  });

  it('debe preferir mesa más cercana al tamaño requerido', () => {
    const mesas = [
      new Mesa('1', 1, 4, FormaMesa.REDONDA, 10, 10),
      new Mesa('2', 2, 6, FormaMesa.REDONDA, 20, 10),
    ];

    const mesaOptima = servicio.seleccionarMesaOptima(mesas, 3);

    // Debe elegir la mesa de 4 (75% ocupación vs 50%)
    expect(mesaOptima?.id).toBe('1');
  });

  it('debe retornar null si no hay mesas disponibles', () => {
    const mesas: Mesa[] = [];

    const mesaOptima = servicio.seleccionarMesaOptima(mesas, 4);

    expect(mesaOptima).toBeNull();
  });

  it('debe sugerir alternativas ordenadas por idoneidad', () => {
    const mesas = [
      new Mesa('1', 1, 8, FormaMesa.CUADRADA, 10, 10),
      new Mesa('2', 2, 4, FormaMesa.REDONDA, 20, 10),
      new Mesa('3', 3, 6, FormaMesa.REDONDA, 30, 10),
    ];

    const alternativas = servicio.sugerirAlternativas(mesas, 4, 3);

    expect(alternativas).toHaveLength(3);
    // La primera debe ser la de 4 (ocupación perfecta)
    expect(alternativas[0]?.id).toBe('2');
  });
});
