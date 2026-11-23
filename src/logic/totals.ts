import type { CartItem, CartTotals, Product, PromoCode } from '../types';

export function calculateTotals(
  cart: CartItem[],
  products: Product[],
  promo: PromoCode | null,
): CartTotals {
  const priceById = new Map(products.map((product) => [product.id, product.price]));

  let subtotal = 0;
  let count = 0;
  for (const item of cart) {
    const price = priceById.get(item.productId);
    if (price === undefined) {
      continue;
    }
    subtotal += price * item.quantity;
    count += item.quantity;
  }

  const percent = promo ? Math.min(100, Math.max(0, promo.percent)) : 0;
  const discount = Math.round((subtotal * percent) / 100);

  return { subtotal, discount, total: subtotal - discount, count };
}
