import { applyTranslations } from '../core/i18n.js';

export class BaseView {
  constructor(protected readonly root: HTMLElement) {}

  protected setContent(html: string): void {
    this.root.innerHTML = html;
    applyTranslations(this.root);
  }

  protected setNotice(message: string, type: 'error' | 'success' = 'success'): void {
    const notice = this.root.querySelector('[data-notice]') as HTMLElement | null;
    if (!notice) return;
    notice.textContent = message;
    notice.className = `notice ${type}`;
  }
}
