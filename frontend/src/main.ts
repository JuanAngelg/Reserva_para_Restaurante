import { appState } from './core/state.js';
import { applyTheme } from './core/theme.js';
import { applyTranslations } from './core/i18n.js';
import { getRoute, navigate } from './core/router.js';
import { AppController } from './controllers/app-controller.js';
import './components/app-header.js';

appState.load();
applyTheme(appState.get().theme);

const root = document.getElementById('app');
if (!root) {
  throw new Error('Missing root element');
}

const controller = new AppController(root);
controller.init();

window.addEventListener('hashchange', () => {
  controller.render(getRoute());
});

window.addEventListener('load', () => {
  const initial = getRoute();
  if (!initial) {
    navigate('login');
  } else {
    controller.render(initial);
    applyTranslations(document.body);
  }
});
