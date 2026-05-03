import { z } from 'zod';

/**
 * Schemas de validación para mesas
 */

export const CrearMesaSchema = z.object({
  numero: z.number().int().positive('El número debe ser positivo'),
  capacidad: z.number().int().positive('La capacidad debe ser positiva'),
  forma: z.enum(['round', 'square']),
  posicionX: z.number(),
  posicionY: z.number(),
});

export const ActualizarMesaSchema = z.object({
  numero: z.number().int().positive().optional(),
  capacidad: z.number().int().positive().optional(),
  forma: z.enum(['round', 'square']).optional(),
  posicionX: z.number().optional(),
  posicionY: z.number().optional(),
});

export const IdParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const PaginacionQuerySchema = z.object({
  pagina: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limite: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
});
