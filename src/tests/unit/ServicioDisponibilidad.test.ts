import { describe, it, expect } from 'vitest';
import { ServicioDisponibilidad } from '../../domain/services/ServicioDisponibilidad';
import { Mesa } from '../../domain/entities/Mesa';
import { Reserva } from '../../domain/entities/Reserva';
import { ConfiguracionRestaurante } from '../../domain/entities/ConfiguracionRestaurante';
import { FormaMesa, EstadoReserva } from '../../types';

describe('ServicioDisponibilidad - Lógica de Negocio Crítica', () => {
  const servicio = new ServicioDisponibilidad();

  it('debe verificar disponibilidad de mesa sin conflictos', () => {
    const mesa = new Mesa('1', 5, 4, FormaMesa.REDONDA, 10, 10);
    const reservasActivas: Reserva[] = [];

    const resultado = servicio.verificarDisponibilidadMesa(
      mesa,
      3,
      reservasActivas,
      '19:00',
      '20:30'
    );

    expect(resultado.disponible).toBe(true);
  });

  it('debe rechazar si la capacidad es insuficiente', () => {
    const mesa = new Mesa('1', 5, 2, FormaMesa.REDONDA, 10, 10);
    const reservasActivas: Reserva[] = [];

    const resultado = servicio.verificarDisponibilidadMesa(
      mesa,
      4,
      reservasActivas,
      '19:00',
      '20:30'
    );

    expect(resultado.disponible).toBe(false);
    expect(resultado.motivo).toContain('capacidad');
  });

  it('debe detectar conflictos de horario', () => {
    const mesa = new Mesa('1', 5, 4, FormaMesa.REDONDA, 10, 10);
    const reservaExistente = new Reserva(
      '123',
      'user-1',
      'Cliente Test',
      'test@example.com',
      mesa.id,
      2,
      new Date('2026-03-15'),
      '19:00',
      '20:30',
      EstadoReserva.RESERVADA
    );

    const resultado = servicio.verificarDisponibilidadMesa(
      mesa,
      3,
      [reservaExistente],
      '19:30',
      '21:00'
    );

    expect(resultado.disponible).toBe(false);
    expect(resultado.motivo).toContain('ya está reservada');
  });

  it('debe validar horario del restaurante', () => {
    const config = new ConfiguracionRestaurante(
      '1',
      '10:00',
      '23:00',
      90
    );

    const resultado1 = servicio.validarHorarioRestaurante(
      '20:00',
      '21:30',
      config
    );
    expect(resultado1.disponible).toBe(true);

    const resultado2 = servicio.validarHorarioRestaurante(
      '08:00',
      '09:30',
      config
    );
    expect(resultado2.disponible).toBe(false);
  });

  it('debe filtrar mesas disponibles correctamente', () => {
    const mesas = [
      new Mesa('1', 1, 4, FormaMesa.REDONDA, 10, 10),
      new Mesa('2', 2, 2, FormaMesa.CUADRADA, 20, 10),
      new Mesa('3', 3, 6, FormaMesa.REDONDA, 30, 10),
    ];

    const reservasPorMesa = new Map();
    reservasPorMesa.set('1', []); // Libre
    reservasPorMesa.set('2', []); // Libre pero capacidad insuficiente
    reservasPorMesa.set('3', []); // Libre

    const disponibles = servicio.filtrarMesasDisponibles(
      mesas,
      4,
      reservasPorMesa,
      '19:00',
      '20:30'
    );

    expect(disponibles).toHaveLength(2); // Mesa 1 y 3
    expect(disponibles.find((m) => m.id === '2')).toBeUndefined(); // Mesa 2 excluida por capacidad
  });
});
