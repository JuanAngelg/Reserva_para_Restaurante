import { appState } from './state.js';

export function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
  appState.set({ theme });
}

export function toggleTheme(): void {
  const { theme } = appState.get();
  applyTheme(theme === 'light' ? 'dark' : 'light');
}
