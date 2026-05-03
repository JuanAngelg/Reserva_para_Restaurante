import { BaseView } from './base-view.js';
import { AuthController } from '../controllers/auth-controller.js';
import { appState } from '../core/state.js';
import { t } from '../core/i18n.js';

export class ProfileView extends BaseView {
  constructor(root: HTMLElement, private readonly controller: AuthController) {
    super(root);
  }

  render(): void {
    const state = appState.get();
    const user = state.user;

    this.setContent(`
      <div class="page-shell">
        <section class="page-hero">
          <h1 data-i18n="profile_title">${t('profile_title')}</h1>
          <p>Consulta y actualiza tus datos personales, credenciales y preferencias de acceso desde una pantalla clara y directa.</p>
        </section>

        <section class="card">
          <div class="notice" data-notice></div>
          <div class="metrics">
            <div class="metric"><strong>${user?.rol || ''}</strong><span class="muted">Rol activo</span></div>
            <div class="metric"><strong>${user?.nombre || ''}</strong><span class="muted">Nombre de usuario</span></div>
          </div>
          <p><strong>ID:</strong> ${user?.id || ''}</p>
          <p><strong data-i18n="name">${t('name')}:</strong> ${user?.nombre || ''}</p>
          <p><strong data-i18n="email">${t('email')}:</strong> ${user?.email || ''}</p>
          <p><strong data-i18n="role">${t('role')}:</strong> ${user?.rol || ''}</p>
        </section>

        <section class="card">
          <h2 data-i18n="update_profile">${t('update_profile')}</h2>
          <form id="profile-form">
            <div class="field">
              <label data-i18n="name">${t('name')}</label>
              <input type="text" name="nombre" value="${user?.nombre || ''}" />
            </div>
            <div class="field">
              <label data-i18n="email">${t('email')}</label>
              <input type="email" name="email" value="${user?.email || ''}" />
            </div>
            <button class="btn btn--primary" type="submit" data-i18n="update_action">${t('update_action')}</button>
          </form>
        </section>

        <section class="card">
          <h2 data-i18n="change_password">${t('change_password')}</h2>
          <form id="password-form">
            <div class="field">
              <label data-i18n="current_password">${t('current_password')}</label>
              <input type="password" name="actual" required />
            </div>
            <div class="field">
              <label data-i18n="new_password">${t('new_password')}</label>
              <input type="password" name="nueva" required />
            </div>
            <button class="btn btn--secondary" type="submit" data-i18n="change_action">${t('change_action')}</button>
          </form>
        </section>
      </div>
    `);

    const profileForm = this.root.querySelector('#profile-form') as HTMLFormElement | null;
    const passwordForm = this.root.querySelector('#password-form') as HTMLFormElement | null;

    profileForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(profileForm);
      try {
        await this.controller.updateProfile({
          nombre: String(form.get('nombre') || ''),
          email: String(form.get('email') || ''),
        });
        this.setNotice(t('profile_updated'), 'success');
      } catch (error: any) {
        this.setNotice(error.message || t('error_update'), 'error');
      }
    });

    passwordForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(passwordForm);
      try {
        await this.controller.changePassword({
          passwordActual: String(form.get('actual') || ''),
          passwordNueva: String(form.get('nueva') || ''),
        });
        this.setNotice(t('password_updated'), 'success');
        passwordForm.reset();
      } catch (error: any) {
        this.setNotice(error.message || t('error_change_password'), 'error');
      }
    });
  }
}
