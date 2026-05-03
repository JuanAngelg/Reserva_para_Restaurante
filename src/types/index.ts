import { Request } from 'express';

// Roles del sistema
export enum Rol {
  CLIENT = 'CLIENT',
  HOST = 'HOST',
  MANAGER = 'MANAGER',
}

// Estados de reserva
export enum EstadoReserva {
  RESERVADA = 'RESERVED',
  OCUPADA = 'OCCUPIED',
  CANCELADA = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// Formas de mesa
export enum FormaMesa {
  REDONDA = 'round',
  CUADRADA = 'square',
}

// Usuario autenticado en request
export interface UsuarioAutenticado {
  id: string;
  email: string;
  rol: Rol;
}

// Extender Request de Express
export interface RequestAutenticado extends Request {
  user?: UsuarioAutenticado;
}

// Resultado paginado genérico
export interface ResultadoPaginado<T> {
  datos: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

// Opciones de paginación
export interface OpcionesPaginacion {
  pagina: number;
  limite: number;
}

// Rango de tiempo
export interface RangoTiempo {
  inicio: Date;
  fin: Date;
}
