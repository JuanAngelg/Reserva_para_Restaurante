export type Role = 'CLIENT' | 'HOST' | 'MANAGER';

export interface UserInfo {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
}

export interface AppState {
  token: string | null;
  user: UserInfo | null;
  language: 'es' | 'en';
  theme: 'light' | 'dark';
  view: string;
}

type Listener = (state: AppState) => void;

class Store {
  private state: AppState = {
    token: null,
    user: null,
    language: 'es',
    theme: 'light',
    view: 'login',
  };
  private listeners: Listener[] = [];

  get(): AppState {
    return { ...this.state };
  }

  set(partial: Partial<AppState>): void {
    this.state = { ...this.state, ...partial };
    this.persist();
    this.listeners.forEach((listener) => listener(this.get()));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  load(): void {
    const raw = localStorage.getItem('reservas_state');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      this.state = { ...this.state, ...parsed } as AppState;
    } catch {
      // ignore invalid storage
    }
  }

  clearAuth(): void {
    this.state = { ...this.state, token: null, user: null };
    this.persist();
    this.listeners.forEach((listener) => listener(this.get()));
  }

  private persist(): void {
    localStorage.setItem('reservas_state', JSON.stringify(this.state));
  }
}

export const appState = new Store();
