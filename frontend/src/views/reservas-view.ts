import { BaseView } from './base-view.js';
import { ReservasController } from '../controllers/reservas-controller.js';
import { toNumber } from '../core/utils.js';
import { appState } from '../core/state.js';

export class ReservasView extends BaseView {
  constructor(root: HTMLElement, private readonly controller: ReservasController) {
    super(root);
  }

  render(): void {
    this.setContent(`
      <div class="page-shell">
        <section class="page-hero">
          <h1>Reservas</h1>
          <p>Comprueba disponibilidad, crea reservas, filtra resultados y cambia estados sin salir de una vista clara y operativa.</p>
        </section>

        <section class="card">
          <div data-notice class="notice"></div>
          <form id="reserva-form">
            <div class="grid">
              <div class="field">
                <label>Nombre</label>
                <input type="text" name="nombre" required />
              </div>
              <div class="field">
                <label>Email</label>
                <input type="email" name="email" required />
              </div>
              <div class="field">
                <label>Comensales</label>
                <input type="number" name="comensales" min="1" required />
              </div>
              <div class="field">
                <label>Fecha</label>
                <input type="date" name="fecha" required />
              </div>
              <div class="field">
                <label>Hora inicio</label>
                <input type="time" name="hora" required />
              </div>
              <div class="field">
                <label>Mesa ID (opcional)</label>
                <input type="text" name="mesaId" />
              </div>
            </div>
            <div class="actions">
              <button class="btn btn--secondary" type="button" id="check-btn">Verificar</button>
              <button class="btn btn--primary" type="submit">Crear</button>
            </div>
          </form>
        </section>

        <section class="card">
          <h2>Listado de reservas</h2>
          <form id="filtros-form" class="grid">
            <div class="field">
              <label>Fecha</label>
              <input type="date" name="fecha" />
            </div>
            <div class="field">
              <label>Estado</label>
              <select name="estado">
                <option value="">Todos</option>
                <option value="RESERVED">RESERVED</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="NO_SHOW">NO_SHOW</option>
              </select>
            </div>
            <div class="field">
              <label>Pagina</label>
              <input type="number" name="pagina" value="1" min="1" />
            </div>
            <div class="field">
              <label>Limite</label>
              <input type="number" name="limite" value="10" min="1" />
            </div>
            <button class="btn btn--ghost" type="submit">Buscar</button>
          </form>
          <table class="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Mesa</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="reservas-body"></tbody>
          </table>
        </section>
      </div>
    `);

    const form = this.root.querySelector('#reserva-form') as HTMLFormElement | null;
    const filtrosForm = this.root.querySelector('#filtros-form') as HTMLFormElement | null;
    const checkBtn = this.root.querySelector('#check-btn') as HTMLButtonElement | null;

    checkBtn?.addEventListener('click', async () => {
      if (!form) return;
      const data = new FormData(form);
      try {
        const result = await this.controller.checkAvailability({
          comensales: toNumber(String(data.get('comensales'))),
          fecha: String(data.get('fecha') || ''),
          horaInicio: String(data.get('hora') || ''),
        });
        if (result.disponible) {
          this.setNotice('Disponible. Mesas sugeridas: ' + (result.mesasSugeridas?.map((m) => m.numero).join(', ') || ''), 'success');
        } else {
          this.setNotice(result.motivo || 'No disponible', 'error');
        }
      } catch (error: any) {
        this.setNotice(error.message || 'Error de disponibilidad', 'error');
      }
    });

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form) return;
      const data = new FormData(form);
      try {
        await this.controller.create({
          nombreCliente: String(data.get('nombre') || ''),
          emailCliente: String(data.get('email') || ''),
          comensales: toNumber(String(data.get('comensales'))),
          fecha: String(data.get('fecha') || ''),
          horaInicio: String(data.get('hora') || ''),
          mesaId: String(data.get('mesaId') || '') || undefined,
        });
        this.setNotice('Reserva creada', 'success');
        await this.loadReservas({ pagina: '1', limite: '10' });
      } catch (error: any) {
        this.setNotice(error.message || 'Error al crear reserva', 'error');
      }
    });

    filtrosForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!filtrosForm) return;
      const data = new FormData(filtrosForm);
      const query: Record<string, string> = {};
      data.forEach((value, key) => {
        if (String(value)) query[key] = String(value);
      });
      await this.loadReservas(query);
    });

    this.loadReservas({ pagina: '1', limite: '10' }).catch((error) => this.setNotice(error.message, 'error'));
  }

  private async loadReservas(query: Record<string, string>): Promise<void> {
    const body = this.root.querySelector('#reservas-body') as HTMLElement | null;
    if (!body) return;
    const result = await this.controller.list(query);
    const currentUser = appState.get().user;

    body.innerHTML = result.datos
      .map(
        (reserva) => {
          const isOwner = currentUser && reserva.usuarioId && currentUser.id === reserva.usuarioId;
          const canManage = currentUser && (currentUser.rol === 'HOST' || currentUser.rol === 'MANAGER');
          const showActions = Boolean(canManage || isOwner);
          return `
        <tr>
          <td>${reserva.nombreCliente}</td>
          <td>${reserva.fecha}</td>
          <td>${reserva.horaInicio} - ${reserva.horaFin}</td>
          <td>${reserva.mesaId}</td>
          <td>${reserva.estado}</td>
          <td>
            ${showActions ? `
              <select data-status="${reserva.id}">
                <option value="RESERVED">RESERVED</option>
                <option value="OCCUPIED">OCCUPIED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="NO_SHOW">NO_SHOW</option>
              </select>
              <button class="btn btn--ghost" data-update="${reserva.id}">Actualizar</button>
              <button class="btn btn--ghost" data-cancel="${reserva.id}">Cancelar</button>
            ` : `<span class="muted">Sin acciones</span>`}
          </td>
        </tr>
      `
        }
      )
      .join('');

    body.querySelectorAll('[data-update]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-update');
        if (!id) return;
        const select = body.querySelector(`[data-status="${id}"]`) as HTMLSelectElement | null;
        if (!select) return;
        await this.controller.updateStatus(id, select.value);
        await this.loadReservas(query);
      });
    });

    body.querySelectorAll('[data-cancel]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-cancel');
        if (!id) return;
        await this.controller.cancel(id);
        await this.loadReservas(query);
      });
    });
  }
}
