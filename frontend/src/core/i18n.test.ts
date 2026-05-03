import { describe, it, expect, beforeEach } from 'vitest';
import { t, setLanguage } from './i18n';
import { appState } from './state';

// Minimal localStorage mock for Node environment
const mockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  } as Storage;
};

describe('i18n', () => {
  beforeEach(() => {
    // attach mock localStorage for tests
    // @ts-ignore
    globalThis.localStorage = mockStorage();
    appState.set({ language: 'es' });
  });

  it('returns spanish translation by default', () => {
    expect(t('login')).toBe('Iniciar sesion');
  });

  it('switches language to english', () => {
    setLanguage('en');
    expect(t('login')).toBe('Login');
  });
});
