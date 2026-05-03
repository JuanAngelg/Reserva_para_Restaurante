import { BaseView } from './base-view.js';
import { ReservasController } from '../controllers/reservas-controller.js';
import { MesasController } from '../controllers/mesas-controller.js';
import { buildMesaVisual, MesaVisual } from '../prototypes/mesa-prototypes.js';

export class PlanView extends BaseView {
  constructor(
    root: HTMLElement,
    private readonly reservasController: ReservasController,
    private readonly mesasController: MesasController
  ) {
    super(root);
  }

  render(): void {
    this.setContent(`
      <section class="card">
        <h2>Plano del restaurante</h2>
        <div data-notice class="notice"></div>
        <div class="grid">
          <div class="field">
            <label>Fecha</label>
            <input type="date" id="plan-fecha" />
          </div>
          <div class="field">
            <label>Hora</label>
            <input type="time" id="plan-hora" />
          </div>
          <div class="field">
            <label>&nbsp;</label>
            <button class="btn btn--primary" id="plan-load">Cargar</button>
          </div>
        </div>
        <div class="legend">
          <span class="status-pill available">Disponible</span>
          <span class="status-pill reserved">Reservada</span>
          <span class="status-pill occupied">Ocupada</span>
        </div>
        <div class="table-grid" id="plan-grid"></div>
      </section>
    `);

    const loadBtn = this.root.querySelector('#plan-load') as HTMLButtonElement | null;
    loadBtn?.addEventListener('click', () => this.loadPlan());
  }

  private async loadPlan(): Promise<void> {
    const fechaInput = this.root.querySelector('#plan-fecha') as HTMLInputElement | null;
    const horaInput = this.root.querySelector('#plan-hora') as HTMLInputElement | null;
    const grid = this.root.querySelector('#plan-grid') as HTMLElement | null;
    if (!fechaInput || !horaInput || !grid) return;

    const fecha = fechaInput.value;
    const hora = horaInput.value;

    if (!fecha || !hora) {
      this.setNotice('Selecciona fecha y hora', 'error');
      return;
    }

    const mesasResult = await this.mesasController.list();
    const reservasResult = await this.reservasController.list({ fecha });

    const mesasVisuales: MesaVisual[] = mesasResult.datos.map((mesa) => {
      const estado = this.getEstadoMesa(mesa.id, hora, reservasResult.datos);
      return buildMesaVisual({
        id: mesa.id,
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        forma: mesa.forma,
        posicionX: mesa.posicionX,
        posicionY: mesa.posicionY,
        estado,
      });
    });

    grid.innerHTML = mesasVisuales
      .map(
        (mesa) => `
        <div class="table-card ${mesa.forma} ${mesa.estado}">
          <strong>Mesa ${mesa.numero}</strong>
          <div>${mesa.capacidad} pax</div>
          <div class="status-pill ${mesa.estado}">${mesa.estado}</div>
        </div>
      `
      )
      .join('');
  }

  private getEstadoMesa(
    mesaId: string,
    hora: string,
    reservas: Array<{ mesaId: string; horaInicio: string; horaFin: string; estado: string }>
  ): 'available' | 'reserved' | 'occupied' {
    const relevantes = reservas.filter((reserva) => reserva.mesaId === mesaId);
    const minutes = this.toMinutes(hora);

    const ocupada = relevantes.some((reserva) =>
      this.estaEnRango(minutes, reserva.horaInicio, reserva.horaFin) && reserva.estado === 'OCCUPIED'
    );
    if (ocupada) return 'occupied';

    const reservada = relevantes.some((reserva) =>
      this.estaEnRango(minutes, reserva.horaInicio, reserva.horaFin) && reserva.estado === 'RESERVED'
    );
    if (reservada) return 'reserved';

    return 'available';
  }

  private toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  private estaEnRango(target: number, inicio: string, fin: string): boolean {
    const start = this.toMinutes(inicio);
    const end = this.toMinutes(fin);
    return target >= start && target < end;
  }
}
