import { BaseView } from './base-view.js';
import { ReportesController } from '../controllers/reportes-controller.js';

export class ReportesView extends BaseView {
  constructor(root: HTMLElement, private readonly controller: ReportesController) {
    super(root);
  }

  render(): void {
    this.setContent(`
      <div class="page-shell">
        <section class="page-hero">
          <h1>Reportes</h1>
          <p>Visualiza patrones de ocupación, horas pico y no-shows para tomar decisiones operativas con mejor contexto.</p>
        </section>

        <section class="card">
          <div data-notice class="notice"></div>
          <form id="reporte-form" class="grid">
            <div class="field">
              <label>Fecha desde</label>
              <input type="date" name="desde" required />
            </div>
            <div class="field">
              <label>Fecha hasta</label>
              <input type="date" name="hasta" required />
            </div>
            <div class="field">
              <label>&nbsp;</label>
              <button class="btn btn--primary" type="submit">Cargar</button>
            </div>
          </form>
          <div class="card" id="ocupacion"></div>
          <div class="card" id="no-shows"></div>
        </section>
      </div>
    `);

    const form = this.root.querySelector('#reporte-form') as HTMLFormElement | null;
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form) return;
      const data = new FormData(form);
      const desde = String(data.get('desde') || '');
      const hasta = String(data.get('hasta') || '');

      try {
        const ocupacion = await this.controller.ocupacion(desde, hasta);
        const noShows = await this.controller.noShows(desde, hasta);

        const ocupacionEl = this.root.querySelector('#ocupacion') as HTMLElement | null;
        const noShowsEl = this.root.querySelector('#no-shows') as HTMLElement | null;

        if (ocupacionEl) {
          const data = Array.isArray(ocupacion) ? ocupacion : (ocupacion.datos || ocupacion.ocupancy || []);
          ocupacionEl.innerHTML = `
            <h3>Ocupacion</h3>
            <ul>
              ${data
                .map((item) => {
                  const porcentaje = Number(item.porcentajeOcupacion) || 0;
                  const capacidadUtilizada = item.totalComensales ?? item.capacidadUtilizada ?? 0;
                  const capacidadTotal = item.capacidadTotal ?? 0;
                  return `<li>${item.fecha}: ${(porcentaje * 100).toFixed(1)}% (${capacidadUtilizada}/${capacidadTotal})</li>`;
                })
                .join('')}
            </ul>
          `;
        }

        if (noShowsEl) {
          noShowsEl.innerHTML = `
            <h3>No shows</h3>
            <p>Total: ${noShows.totalNoShows}</p>
          `;
        }
      } catch (error: any) {
        this.setNotice(error.message || 'Error cargando reportes', 'error');
      }
    });
  }
}
