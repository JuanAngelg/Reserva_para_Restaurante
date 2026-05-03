import { BaseView } from './base-view.js';
import { ConfigController } from '../controllers/config-controller.js';
import { toNumber } from '../core/utils.js';

export class ConfigView extends BaseView {
  constructor(root: HTMLElement, private readonly controller: ConfigController) {
    super(root);
  }

  render(): void {
    this.setContent(`
      <div class="page-shell">
        <section class="page-hero">
          <h1>Configuración del restaurante</h1>
          <p>Ajusta horarios operativos y duración estándar de reservas para mantener el flujo del salón bajo control.</p>
        </section>

        <section class="card">
          <div data-notice class="notice"></div>
          <form id="config-form" class="grid">
            <div class="field">
              <label>Hora apertura</label>
              <input type="time" name="apertura" required />
            </div>
            <div class="field">
              <label>Hora cierre</label>
              <input type="time" name="cierre" required />
            </div>
            <div class="field">
              <label>Duracion reserva (min)</label>
              <input type="number" name="duracion" min="30" required />
            </div>
            <div class="field">
              <label>&nbsp;</label>
              <button class="btn btn--primary" type="submit">Guardar</button>
            </div>
          </form>
        </section>
      </div>
    `);

    const form = this.root.querySelector('#config-form') as HTMLFormElement | null;
    this.loadConfig();

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form) return;
      const data = new FormData(form);
      try {
        await this.controller.update({
          horaApertura: String(data.get('apertura') || ''),
          horaCierre: String(data.get('cierre') || ''),
          duracionReserva: toNumber(String(data.get('duracion'))),
        });
        this.setNotice('Configuracion guardada', 'success');
      } catch (error: any) {
        this.setNotice(error.message || 'Error al guardar', 'error');
      }
    });
  }

  private async loadConfig(): Promise<void> {
    try {
      const config = await this.controller.get();
      const form = this.root.querySelector('#config-form') as HTMLFormElement | null;
      if (!form) return;
      (form.elements.namedItem('apertura') as HTMLInputElement).value = config.horaApertura;
      (form.elements.namedItem('cierre') as HTMLInputElement).value = config.horaCierre;
      (form.elements.namedItem('duracion') as HTMLInputElement).value = String(config.duracionReserva);
    } catch (error: any) {
      this.setNotice(error.message || 'Error cargando configuracion', 'error');
    }
  }
}
