import { AuthModel } from '../models/auth-model.js';
import { appState } from '../core/state.js';

export class AuthController {
  private model = new AuthModel();

  async register(payload: { nombre: string; email: string; password: string; rol?: string }) {
    const result = await this.model.register(payload);
    appState.set({ token: result.token, user: result.usuario });
    return result;
  }

  async login(payload: { email: string; password: string }) {
    const result = await this.model.login(payload);
    appState.set({ token: result.token, user: result.usuario });
    return result;
  }

  async logout() {
    await this.model.logout();
    appState.clearAuth();
  }

  recover(email: string) {
    return this.model.recover(email);
  }

  profile() {
    return this.model.profile();
  }

  async updateProfile(payload: { nombre?: string; email?: string }) {
    const user = await this.model.updateProfile(payload);
    appState.set({ user });
    return user;
  }

  changePassword(payload: { passwordActual: string; passwordNueva: string }) {
    return this.model.changePassword(payload);
  }
}
