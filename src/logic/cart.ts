import type { CartItem } from '../types';
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

export function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return MIN_QUANTITY;
  }
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.floor(quantity)));
}

export function getQuantity(cart: CartItem[], productId: string): number {
  return cart.find((item) => item.productId === productId)?.quantity ?? 0;
}

export function setQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[] {
  const normalized = normalizeQuantity(quantity);
  return cart.map((item) =>
    item.productId === productId ? { ...item, quantity: normalized } : item,
  );
}

export function addToCart(cart: CartItem[], productId: string): CartItem[] {
  const current = getQuantity(cart, productId);
  if (current === 0) {
    return [...cart, { productId, quantity: MIN_QUANTITY }];
  }
  return setQuantity(cart, productId, current + 1);
}

export function removeFromCart(cart: CartItem[], productId: string): CartItem[] {
  return cart.filter((item) => item.productId !== productId);
}

export function incrementQuantity(cart: CartItem[], productId: string): CartItem[] {
  return setQuantity(cart, productId, getQuantity(cart, productId) + 1);
}

export function decrementQuantity(cart: CartItem[], productId: string): CartItem[] {
  return setQuantity(cart, productId, getQuantity(cart, productId) - 1);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
