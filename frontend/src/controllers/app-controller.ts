import { AppState, appState } from '../core/state.js';
import { getRoute, navigate } from '../core/router.js';
import { AuthController } from './auth-controller.js';
import { MesasController } from './mesas-controller.js';
import { ReservasController } from './reservas-controller.js';
import { ConfigController } from './config-controller.js';
import { ReportesController } from './reportes-controller.js';
import { LoginView } from '../views/login-view.js';
import { ProfileView } from '../views/profile-view.js';
import { MesasView } from '../views/mesas-view.js';
import { ReservasView } from '../views/reservas-view.js';
import { PlanView } from '../views/plan-view.js';
import { ReportesView } from '../views/reportes-view.js';
import { ConfigView } from '../views/config-view.js';

export class AppController {
  private authController = new AuthController();
  private mesasController = new MesasController();
  private reservasController = new ReservasController();
  private configController = new ConfigController();
  private reportesController = new ReportesController();

  constructor(private readonly root: HTMLElement) {}

  init(): void {
    appState.subscribe((state) => this.onStateChange(state));
    this.render(getRoute());
  }

  render(route: string): void {
    const view = route || 'login';
    const state = appState.get();
    const role = state.user?.rol;

    if (!state.token && ['profile', 'reservas', 'mesas', 'config', 'plan', 'reportes'].includes(view)) {
      navigate('login');
      return;
    }

    if (state.token) {
      if (['mesas', 'config', 'reportes'].includes(view) && role !== 'MANAGER') {
        navigate('reservas');
        return;
      }
      if (view === 'plan' && !(role === 'HOST' || role === 'MANAGER')) {
        navigate('reservas');
        return;
      }
    }

    switch (view) {
      case 'login':
      case 'register':
      case 'recover':
        new LoginView(this.root, this.authController).render();
        break;
      case 'profile':
        new ProfileView(this.root, this.authController).render();
        break;
      case 'mesas':
        new MesasView(this.root, this.mesasController).render();
        break;
      case 'reservas':
        new ReservasView(this.root, this.reservasController).render();
        break;
      case 'plan':
        new PlanView(this.root, this.reservasController, this.mesasController).render();
        break;
      case 'config':
        new ConfigView(this.root, this.configController).render();
        break;
      case 'reportes':
        new ReportesView(this.root, this.reportesController).render();
        break;
      default:
        navigate('login');
    }
  }

  private onStateChange(state: AppState): void {
    if (!state.token) {
      navigate('login');
    }
  }
}
