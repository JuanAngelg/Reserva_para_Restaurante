import { z } from 'zod';

/**
 * Schemas de validación para autenticación y usuarios
 */

export const RegistrarUsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  rol: z.enum(['CLIENT', 'HOST', 'MANAGER']).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const ActualizarPerfilSchema = z.object({
  nombre: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export const CambiarPasswordSchema = z.object({
  passwordActual: z.string().min(1, 'La contraseña actual es requerida'),
  passwordNueva: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
});

export const RecuperarPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});
