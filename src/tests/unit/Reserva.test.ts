import { describe, it, expect } from 'vitest';
import { Reserva } from '../../domain/entities/Reserva';
import { EstadoReserva } from '../../types';

describe('Reserva - Entidad de Dominio', () => {
  it('debe crear una reserva válida', () => {
    const reserva = new Reserva(
      '123',
      'user-123',
      'Juan Pérez',
      'juan@example.com',
      'mesa-1',
      4,
      new Date('2026-03-15'),
      '19:00',
      '20:30',
      EstadoReserva.RESERVADA
    );

    expect(reserva.id).toBe('123');
    expect(reserva.comensales).toBe(4);
    expect(reserva.estado).toBe(EstadoReserva.RESERVADA);
  });

  it('debe validar que comensales sea mayor a 0', () => {
    expect(() => {
      new Reserva(
        '123',
        'user-123',
        'Juan Pérez',
        'juan@example.com',
        'mesa-1',
        0,
        new Date('2026-03-15'),
        '19:00',
        '20:30',
        EstadoReserva.RESERVADA
      );
    }).toThrow('El número de comensales debe ser mayor a 0');
  });

  it('debe validar formato de hora', () => {
    expect(() => {
      new Reserva(
        '123',
        'user-123',
        'Juan Pérez',
        'juan@example.com',
        'mesa-1',
        4,
        new Date('2026-03-15'),
        '25:00',
        '20:30',
        EstadoReserva.RESERVADA
      );
    }).toThrow('Hora de inicio inválida');
  });

  it('debe detectar conflictos de horario', () => {
    const reserva = new Reserva(
      '123',
      'user-123',
      'Juan Pérez',
      'juan@example.com',
      'mesa-1',
      4,
      new Date('2026-03-15'),
      '19:00',
      '20:30',
      EstadoReserva.RESERVADA
    );

    expect(reserva.conflictoConRango('18:00', '19:30')).toBe(true); // Se solapa
    expect(reserva.conflictoConRango('20:00', '21:00')).toBe(true); // Se solapa
    expect(reserva.conflictoConRango('17:00', '18:30')).toBe(false); // No se solapa
    expect(reserva.conflictoConRango('21:00', '22:00')).toBe(false); // No se solapa
  });

  it('debe permitir transiciones de estado válidas', () => {
    const reserva = new Reserva(
      '123',
      'user-123',
      'Juan Pérez',
      'juan@example.com',
      'mesa-1',
      4,
      new Date('2026-03-15'),
      '19:00',
      '20:30',
      EstadoReserva.RESERVADA
    );

    // RESERVADA -> OCUPADA (válido)
    reserva.hacerCheckIn();
    expect(reserva.estado).toBe(EstadoReserva.OCUPADA);
  });

  it('debe rechazar transiciones de estado inválidas', () => {
    const reserva = new Reserva(
      '123',
      'user-123',
      'Juan Pérez',
      'juan@example.com',
      'mesa-1',
      4,
      new Date('2026-03-15'),
      '19:00',
      '20:30',
      EstadoReserva.CANCELADA
    );

    // CANCELADA -> OCUPADA (inválido)
    expect(() => {
      reserva.cambiarEstado(EstadoReserva.OCUPADA);
    }).toThrow();
  });
});
