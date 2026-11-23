import type { PromoCode, PromoResult } from '../types';

export const PROMO_CODES: PromoCode[] = [
  { code: 'ALCHEMY10', percent: 10 },
  { code: 'POTION20', percent: 20 },
];

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase();
}

export function validatePromo(input: string): PromoResult {
  const code = normalizeCode(input);
  if (code === '') {
    return { ok: false, error: 'empty' };
  }

  const promo = PROMO_CODES.find((item) => item.code === code);
  if (!promo) {
    return { ok: false, error: 'unknown' };
  }

  return { ok: true, promo };
}
