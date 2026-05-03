import { api } from '../core/api.js';
import { UserInfo } from '../core/state.js';

export interface AuthResponse {
  token: string;
  usuario: UserInfo;
}

export class AuthModel {
  register(payload: { nombre: string; email: string; password: string; rol?: string }): Promise<AuthResponse> {
    return api.post<AuthResponse>('/api/auth/register', payload);
  }

  login(payload: { email: string; password: string }): Promise<AuthResponse> {
    return api.post<AuthResponse>('/api/auth/login', payload);
  }

  logout(): Promise<{ mensaje: string }> {
    return api.post<{ mensaje: string }>('/api/auth/logout');
  }

  recover(email: string): Promise<{ mensaje: string }> {
    return api.post<{ mensaje: string }>('/api/auth/recover-password', { email });
  }

  profile(): Promise<UserInfo> {
    return api.get<UserInfo>('/api/users/profile');
  }

  updateProfile(payload: { nombre?: string; email?: string }): Promise<UserInfo> {
    return api.put<UserInfo>('/api/users/profile', payload);
  }

  changePassword(payload: { passwordActual: string; passwordNueva: string }): Promise<{ mensaje: string }> {
    return api.put<{ mensaje: string }>('/api/users/change-password', payload);
  }
}
