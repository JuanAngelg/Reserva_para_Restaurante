import { BaseView } from './base-view.js';
import { AuthController } from '../controllers/auth-controller.js';
import { navigate } from '../core/router.js';
import { t } from '../core/i18n.js';

export class LoginView extends BaseView {
  constructor(root: HTMLElement, private readonly controller: AuthController) {
    super(root);
  }

  render(): void {
    this.setContent(`
      <div class="auth-layout">
        <section class="card auth-panel">
          <div class="page-hero" style="margin-bottom: 18px;">
            <div class="eyebrow">Sistema de reservas</div>
            <h1>Reserva Bistro</h1>
            <p>
              Plataforma de reservas para restaurante con autenticación, roles, plano visual,
              control de mesas y reportes. Diseñada para operar con tema claro/oscuro e i18n.
            </p>
          </div>

          <div class="metric">
            <strong>+ Seguridad</strong>
            <span class="muted">JWT, RBAC y validación estricta para cada flujo crítico.</span>
          </div>
          <div class="metric" style="margin-top: 12px;">
            <strong>+ Experiencia</strong>
            <span class="muted">Interfaz simple para clientes y operativa clara para host y gerente.</span>
          </div>

          <ul class="feature-list" style="margin-top: 18px;">
            <li>Reserva rápida con comprobación de disponibilidad.</li>
            <li>Plano visual de mesas para host y gerente.</li>
            <li>Soporte bilingüe ES/EN y tema claro/oscuro.</li>
          </ul>
        </section>

        <div class="auth-stack">
          <section class="card">
            <h2 data-i18n="login">${t('login')}</h2>
            <div data-notice class="notice"></div>
            <form id="login-form">
              <div class="field">
                <label data-i18n="email">${t('email')}</label>
                <input type="email" name="email" required autocomplete="email" />
              </div>
              <div class="field">
                <label data-i18n="password">${t('password')}</label>
                <input type="password" name="password" required autocomplete="current-password" />
              </div>
              <button class="btn btn--primary" type="submit">${t('login')}</button>
            </form>
          </section>

          <section class="card">
            <h2 data-i18n="register">${t('register')}</h2>
            <form id="register-form">
              <div class="field">
                <label data-i18n="name">${t('name')}</label>
                <input type="text" name="nombre" required autocomplete="name" />
              </div>
              <div class="field">
                <label data-i18n="email">${t('email')}</label>
                <input type="email" name="email" required autocomplete="email" />
              </div>
              <div class="field">
                <label data-i18n="password">${t('password')}</label>
                <input type="password" name="password" required autocomplete="new-password" />
              </div>
              <div class="field">
                <label data-i18n="role">${t('role')}</label>
                <select name="rol">
                  <option value="CLIENT">CLIENT</option>
                  <option value="HOST">HOST</option>
                  <option value="MANAGER">MANAGER</option>
                </select>
              </div>
              <button class="btn btn--secondary" type="submit">${t('register')}</button>
            </form>
          </section>

          <section class="card">
            <h2 data-i18n="recover">${t('recover')}</h2>
            <form id="recover-form">
              <div class="field">
                <label data-i18n="email">${t('email')}</label>
                <input type="email" name="email" required autocomplete="email" />
              </div>
              <button class="btn btn--ghost" type="submit">${t('recover')}</button>
            </form>
          </section>
        </div>
      </div>
    `);

    const loginForm = this.root.querySelector('#login-form') as HTMLFormElement | null;
    const registerForm = this.root.querySelector('#register-form') as HTMLFormElement | null;
    const recoverForm = this.root.querySelector('#recover-form') as HTMLFormElement | null;

    loginForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(loginForm);
      try {
        await this.controller.login({
          email: String(form.get('email') || ''),
          password: String(form.get('password') || ''),
        });
        navigate('profile');
      } catch (error: any) {
        this.setNotice(error.message || t('error_login'), 'error');
      }
    });

    registerForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(registerForm);
      try {
        await this.controller.register({
          nombre: String(form.get('nombre') || ''),
          email: String(form.get('email') || ''),
          password: String(form.get('password') || ''),
          rol: String(form.get('rol') || 'CLIENT'),
        });
        navigate('profile');
      } catch (error: any) {
        this.setNotice(error.message || t('error_register'), 'error');
      }
    });

    recoverForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(recoverForm);
      try {
        const result = await this.controller.recover(String(form.get('email') || ''));
        this.setNotice(result.mensaje, 'success');
      } catch (error: any) {
        this.setNotice(error.message || t('error_recover'), 'error');
      }
    });
  }
}
