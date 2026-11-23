import { describe, expect, it } from 'vitest';
import { normalizeCode, validatePromo } from './promo';

describe('normalizeCode', () => {
  it('убирает пробелы и переводит в верхний регистр', () => {
    expect(normalizeCode('  alchemy10 ')).toBe('ALCHEMY10');
  });
});

describe('validatePromo', () => {
  it('принимает известный код', () => {
    expect(validatePromo('ALCHEMY10')).toEqual({
      ok: true,
      promo: { code: 'ALCHEMY10', percent: 10 },
    });
  });

  it('не зависит от регистра и пробелов', () => {
    expect(validatePromo(' potion20 ')).toEqual({
      ok: true,
      promo: { code: 'POTION20', percent: 20 },
    });
  });

  it('сообщает о пустом вводе', () => {
    expect(validatePromo('   ')).toEqual({ ok: false, error: 'empty' });
  });

  it('сообщает о неизвестном коде', () => {
    expect(validatePromo('FREE')).toEqual({ ok: false, error: 'unknown' });
  });
});
