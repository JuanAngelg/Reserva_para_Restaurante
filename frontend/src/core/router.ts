export function getRoute(): string {
  const hash = window.location.hash.replace('#/', '');
  return hash || 'login';
}

export function navigate(route: string): void {
  window.location.hash = `#/${route}`;
}
