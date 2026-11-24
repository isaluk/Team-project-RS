import { normalizeQuantity } from '../logic/cart';
import type { CartItem } from '../types';

export const CART_STORAGE_KEY = 'lavka:cart';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseCart(raw: string | null, knownIds: string[]): CartItem[] {
  if (raw === null) {
    return [];
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) {
    return [];
  }

  const cart: CartItem[] = [];
  const seen = new Set<string>();
  for (const entry of data) {
    if (!isRecord(entry)) {
      continue;
    }
    const { productId, quantity } = entry;
    if (typeof productId !== 'string' || typeof quantity !== 'number') {
      continue;
    }
    if (!knownIds.includes(productId) || seen.has(productId)) {
      continue;
    }
    seen.add(productId);
    cart.push({ productId, quantity: normalizeQuantity(quantity) });
  }
  return cart;
}

export function getBrowserStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadCart(storage: StorageLike | null, knownIds: string[]): CartItem[] {
  if (!storage) {
    return [];
  }
  try {
    return parseCart(storage.getItem(CART_STORAGE_KEY), knownIds);
  } catch {
    return [];
  }
}

export function saveCart(storage: StorageLike | null, cart: CartItem[]): void {
  if (!storage) {
    return;
  }
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage is full or inaccessible: the cart will remain in memory only.
  }
}
