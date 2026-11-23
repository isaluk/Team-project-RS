import { describe, expect, it } from 'vitest';
import type { CartItem, Product, PromoCode } from '../types';
import { calculateTotals } from './totals';

function product(id: string, price: number): Product {
  return { id, price, name: id, category: 'magic', rarity: 'common', image: id, description: '' };
}

const products: Product[] = [
  product('vigor', 1500),
  product('invisibility', 9000),
  product('bugfix', 1990),
  product('cheap', 33),
];

const tenPercent: PromoCode = { code: 'ALCHEMY10', percent: 10 };

describe('calculateTotals', () => {
  it('возвращает нули для пустой корзины', () => {
    expect(calculateTotals([], products, null)).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0,
      count: 0,
    });
  });

  it('умножает цену на количество и складывает позиции', () => {
    const cart: CartItem[] = [
      { productId: 'vigor', quantity: 2 },
      { productId: 'invisibility', quantity: 1 },
    ];

    expect(calculateTotals(cart, products, null)).toEqual({
      subtotal: 12000,
      discount: 0,
      total: 12000,
      count: 3,
    });
  });

  it('считает корзину из макета: $139.90 − 10% = $125.91', () => {
    const cart: CartItem[] = [
      { productId: 'vigor', quantity: 2 },
      { productId: 'invisibility', quantity: 1 },
      { productId: 'bugfix', quantity: 1 },
    ];

    expect(calculateTotals(cart, products, tenPercent)).toEqual({
      subtotal: 13990,
      discount: 1399,
      total: 12591,
      count: 4,
    });
  });

  it('округляет скидку до целого цента', () => {
    const cart: CartItem[] = [{ productId: 'cheap', quantity: 1 }];

    expect(calculateTotals(cart, products, tenPercent)).toMatchObject({ discount: 3, total: 30 });
  });

  it('пропускает товары, которых нет в каталоге', () => {
    const cart: CartItem[] = [
      { productId: 'vigor', quantity: 1 },
      { productId: 'ghost', quantity: 5 },
    ];

    expect(calculateTotals(cart, products, null)).toMatchObject({ subtotal: 1500, count: 1 });
  });

  it('не даёт скидке превысить 100%', () => {
    const cart: CartItem[] = [{ productId: 'vigor', quantity: 1 }];

    expect(calculateTotals(cart, products, { code: 'X', percent: 150 })).toMatchObject({
      discount: 1500,
      total: 0,
    });
  });
});
