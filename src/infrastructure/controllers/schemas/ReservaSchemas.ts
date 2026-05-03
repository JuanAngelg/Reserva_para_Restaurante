import { z } from 'zod';

/**
 * Schemas de validación para reservas
 */

export const CrearReservaSchema = z.object({
  usuarioId: z.string().uuid().optional(),
  nombreCliente: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  emailCliente: z.string().email('Email inválido'),
  comensales: z.number().int().positive('El número de comensales debe ser positivo'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD'),
  horaInicio: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora debe ser HH:mm'),
  mesaId: z.string().uuid().optional(),
});

export const VerificarDisponibilidadSchema = z.object({
  comensales: z.number().int().positive(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horaInicio: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
});

export const ActualizarEstadoReservaSchema = z.object({
  estado: z.enum(['RESERVED', 'OCCUPIED', 'CANCELLED', 'NO_SHOW']),
});

export const FiltrosReservaQuerySchema = z.object({
  usuarioId: z.string().uuid().optional(),
  mesaId: z.string().uuid().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  estado: z.enum(['RESERVED', 'OCCUPIED', 'CANCELLED', 'NO_SHOW']).optional(),
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  pagina: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limite: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
});
