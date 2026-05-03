import { z } from 'zod';

/**
 * Schemas de validación para configuración y reportes
 */

export const ActualizarConfiguracionSchema = z.object({
  horaApertura: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  horaCierre: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  duracionReserva: z.number().int().positive().optional(),
});

export const FiltrosReporteQuerySchema = z.object({
  fechaDesde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),
  fechaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato debe ser YYYY-MM-DD'),
});
