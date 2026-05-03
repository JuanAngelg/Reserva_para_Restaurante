import { appState } from '../core/state.js';
import { applyTranslations, setLanguage, t } from '../core/i18n.js';
import { navigate } from '../core/router.js';
import { toggleTheme } from '../core/theme.js';

class AppHeader extends HTMLElement {
  private unsubscribe?: () => void;

  connectedCallback(): void {
    this.render();
    this.unsubscribe = appState.subscribe(() => this.render());
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
  }

  private render(): void {
    const state = appState.get();
    const role = state.user?.rol;
    const isAuthed = Boolean(state.token);
    const userLabel = state.user
      ? `${state.user.nombre} · ${role ?? ''}`.trim()
      : 'Acceso público';

    this.innerHTML = `
      <header class="app-header">
        <div class="app-header__inner">
          <div class="brand">
            <span class="brand__mark" aria-hidden="true"></span>
            <div>
              <span>Reserva Bistro</span>
              <div class="muted" style="font-size: 0.82rem;">Sistema de reservas para restaurante</div>
            </div>
          </div>
          <nav class="nav" aria-label="Primary">
            ${this.navButton('profile', t('profile'), isAuthed)}
            ${this.navButton('reservas', t('reservas'), isAuthed)}
            ${this.navButton('plan', t('plan'), isAuthed && (role === 'HOST' || role === 'MANAGER'))}
            ${this.navButton('mesas', t('mesas'), isAuthed && role === 'MANAGER')}
            ${this.navButton('config', t('config'), isAuthed && role === 'MANAGER')}
            ${this.navButton('reportes', t('reportes'), isAuthed && role === 'MANAGER')}
          </nav>
          <div class="actions">
            <span class="status-pill available" title="${userLabel}">${userLabel}</span>
            <button class="btn btn--ghost" data-action="lang">${state.language.toUpperCase()}</button>
            <button class="btn btn--ghost" data-action="theme">${t('theme')}</button>
            ${isAuthed ? `<button class="btn btn--primary" data-action="logout">${t('logout')}</button>` : ''}
          </div>
        </div>
      </header>
    `;

    this.querySelector('[data-action="theme"]')?.addEventListener('click', () => {
      toggleTheme();
    });

    this.querySelector('[data-action="lang"]')?.addEventListener('click', () => {
      const next = state.language === 'es' ? 'en' : 'es';
      setLanguage(next);
      applyTranslations(document.body);
    });

    this.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
      appState.clearAuth();
      navigate('login');
    });

    this.querySelectorAll('[data-route]').forEach((button) => {
      button.addEventListener('click', () => {
        const route = button.getAttribute('data-route');
        if (route) navigate(route);
      });
    });

    applyTranslations(this);
  }

  private navButton(route: string, label: string, visible: boolean): string {
    if (!visible) return '';
    const active = window.location.hash === `#/${route}` ? 'active' : '';
    return `<button class="${active}" data-route="${route}">${label}</button>`;
  }
}

customElements.define('app-header', AppHeader);
