import { describe, it, expect } from 'vitest';
import { formatDate, toNumber, clamp } from './utils';

describe('utils', () => {
  it('formatDate returns ISO date portion', () => {
    const d = new Date('2026-04-29T19:00:00.000Z');
    expect(formatDate(d)).toBe('2026-04-29');
  });

  it('toNumber parses numbers and falls back', () => {
    expect(toNumber('42')).toBe(42);
    expect(toNumber('not-a-number', 7)).toBe(7);
  });

  it('clamp bounds values', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(100, 0, 50)).toBe(50);
  });
});
