import { BaseView } from './base-view.js';
import { MesasController } from '../controllers/mesas-controller.js';
import { toNumber } from '../core/utils.js';
import { t } from '../core/i18n.js';

export class MesasView extends BaseView {
  private editingId: string | null = null;

  constructor(root: HTMLElement, private readonly controller: MesasController) {
    super(root);
  }

  render(): void {
    this.setContent(`
      <div class="page-shell">
        <section class="page-hero">
          <h1 data-i18n="mesas">${t('mesas')}</h1>
          <p>Administra números, capacidades y posición del plano para que el salón responda visualmente como un mapa operativo real.</p>
        </section>

        <section class="card">
          <div data-notice class="notice"></div>
          <form id="mesa-form">
            <div class="grid">
              <div class="field">
                <label data-i18n="table_number">${t('table_number')}</label>
                <input type="number" name="numero" min="1" required />
              </div>
              <div class="field">
                <label data-i18n="capacity">${t('capacity')}</label>
                <input type="number" name="capacidad" min="1" required />
              </div>
              <div class="field">
                <label data-i18n="shape">${t('shape')}</label>
                <select name="forma">
                  <option value="round">round</option>
                  <option value="square">square</option>
                </select>
              </div>
              <div class="field">
                <label data-i18n="position_x">${t('position_x')}</label>
                <input type="number" name="posicionX" required />
              </div>
              <div class="field">
                <label data-i18n="position_y">${t('position_y')}</label>
                <input type="number" name="posicionY" required />
              </div>
            </div>
            <div class="actions">
              <button class="btn btn--primary" type="submit" data-i18n="save">${t('save')}</button>
              <button class="btn btn--ghost" type="button" id="mesa-cancel" data-i18n="cancel">${t('cancel')}</button>
            </div>
          </form>
        </section>
        <section class="card">
          <h2 data-i18n="list">${t('list')}</h2>
          <table class="table">
            <thead>
              <tr>
                <th data-i18n="table_number">${t('table_number')}</th>
                <th data-i18n="capacity">${t('capacity')}</th>
                <th data-i18n="shape">${t('shape')}</th>
                <th data-i18n="actions">${t('actions')}</th>
              </tr>
            </thead>
            <tbody id="mesas-body"></tbody>
          </table>
        </section>
      </div>
    `);

    const form = this.root.querySelector('#mesa-form') as HTMLFormElement | null;
    const cancelBtn = this.root.querySelector('#mesa-cancel') as HTMLButtonElement | null;

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form) return;
      const data = new FormData(form);
      const payload = {
        numero: toNumber(String(data.get('numero'))),
        capacidad: toNumber(String(data.get('capacidad'))),
        forma: String(data.get('forma') || 'round') as 'round' | 'square',
        posicionX: toNumber(String(data.get('posicionX'))),
        posicionY: toNumber(String(data.get('posicionY'))),
      };

      try {
        if (this.editingId) {
          await this.controller.update(this.editingId, payload);
        } else {
          await this.controller.create(payload);
        }
        this.editingId = null;
        form.reset();
        await this.loadMesas();
        this.setNotice(t('table_saved'), 'success');
      } catch (error: any) {
        this.setNotice(error.message || t('error_save'), 'error');
      }
    });

    cancelBtn?.addEventListener('click', () => {
      this.editingId = null;
      form?.reset();
    });

    this.loadMesas().catch((error) => this.setNotice(error.message, 'error'));
  }

  private async loadMesas(): Promise<void> {
    const body = this.root.querySelector('#mesas-body') as HTMLElement | null;
    if (!body) return;

    const result = await this.controller.list();
    body.innerHTML = result.datos
      .map(
        (mesa) => `
        <tr>
          <td>${mesa.numero}</td>
          <td>${mesa.capacidad}</td>
          <td>${mesa.forma}</td>
          <td>
            <button class="btn btn--ghost" data-edit="${mesa.id}">Editar</button>
            <button class="btn btn--ghost" data-delete="${mesa.id}">Eliminar</button>
          </td>
        </tr>
      `
      )
      .join('');

    body.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit');
        if (!id) return;
        const mesa = result.datos.find((item) => item.id === id);
        if (!mesa) return;
        this.editingId = id;
        const form = this.root.querySelector('#mesa-form') as HTMLFormElement | null;
        if (!form) return;
        (form.elements.namedItem('numero') as HTMLInputElement).value = String(mesa.numero);
        (form.elements.namedItem('capacidad') as HTMLInputElement).value = String(mesa.capacidad);
        (form.elements.namedItem('forma') as HTMLSelectElement).value = mesa.forma;
        (form.elements.namedItem('posicionX') as HTMLInputElement).value = String(mesa.posicionX);
        (form.elements.namedItem('posicionY') as HTMLInputElement).value = String(mesa.posicionY);
      });
    });

    body.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete');
        if (!id) return;
        await this.controller.remove(id);
        await this.loadMesas();
      });
    });
  }
}
