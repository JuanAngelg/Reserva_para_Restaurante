export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] || '';
}

export function toNumber(value: string, fallback: number = 0): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
