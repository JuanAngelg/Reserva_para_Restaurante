import { Rol } from '../../types';

/**
 * DTOs para autenticación
 */

export interface RegistrarUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
  rol?: Rol;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  token: string;
  usuario: UsuarioDTO;
}

export interface UsuarioDTO {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  createdAt: Date;
}

export interface ActualizarPerfilDTO {
  nombre?: string;
  email?: string;
}

export interface CambiarPasswordDTO {
  passwordActual: string;
  passwordNueva: string;
}

export interface RecuperarPasswordDTO {
  email: string;
}
