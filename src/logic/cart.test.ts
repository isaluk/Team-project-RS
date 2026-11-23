import { describe, expect, it } from 'vitest';
import type { CartItem } from '../types';
import {
  MAX_QUANTITY,
  addToCart,
  decrementQuantity,
  getCartCount,
  getQuantity,
  incrementQuantity,
  normalizeQuantity,
  removeFromCart,
  setQuantity,
} from './cart';

const cart: CartItem[] = [
  { productId: 'vigor', quantity: 2 },
  { productId: 'bugfix', quantity: 1 },
];

describe('addToCart', () => {
  it('добавляет новый товар с количеством 1', () => {
    expect(addToCart([], 'vigor')).toEqual([{ productId: 'vigor', quantity: 1 }]);
  });

  it('увеличивает количество, если товар уже в корзине', () => {
    const result = addToCart(cart, 'vigor');

    expect(result).toHaveLength(2);
    expect(getQuantity(result, 'vigor')).toBe(3);
  });

  it('не меняет исходную корзину', () => {
    const snapshot = structuredClone(cart);

    addToCart(cart, 'vigor');
    addToCart(cart, 'love');

    expect(cart).toEqual(snapshot);
  });

  it('не поднимает количество выше максимума', () => {
    const full: CartItem[] = [{ productId: 'vigor', quantity: MAX_QUANTITY }];

    expect(getQuantity(addToCart(full, 'vigor'), 'vigor')).toBe(MAX_QUANTITY);
  });
});

describe('removeFromCart', () => {
  it('убирает товар целиком', () => {
    expect(removeFromCart(cart, 'vigor')).toEqual([{ productId: 'bugfix', quantity: 1 }]);
  });

  it('возвращает ту же корзину по содержимому, если товара нет', () => {
    expect(removeFromCart(cart, 'unknown')).toEqual(cart);
  });
});

describe('normalizeQuantity', () => {
  it.each([
    [0, 1],
    [-5, 1],
    [2.7, 2],
    [150, MAX_QUANTITY],
    [Number.NaN, 1],
    [Number.POSITIVE_INFINITY, 1],
  ])('приводит %s к %s', (input, expected) => {
    expect(normalizeQuantity(input)).toBe(expected);
  });
});

describe('setQuantity', () => {
  it('ставит точное количество', () => {
    expect(getQuantity(setQuantity(cart, 'bugfix', 5), 'bugfix')).toBe(5);
  });

  it('не добавляет товар, которого нет в корзине', () => {
    expect(setQuantity(cart, 'love', 3)).toEqual(cart);
  });
});

describe('incrementQuantity и decrementQuantity', () => {
  it('увеличивает количество на 1', () => {
    expect(getQuantity(incrementQuantity(cart, 'bugfix'), 'bugfix')).toBe(2);
  });

  it('уменьшает количество на 1', () => {
    expect(getQuantity(decrementQuantity(cart, 'vigor'), 'vigor')).toBe(1);
  });

  it('не опускает количество ниже 1', () => {
    expect(getQuantity(decrementQuantity(cart, 'bugfix'), 'bugfix')).toBe(1);
  });
});

describe('getQuantity и getCartCount', () => {
  it('возвращает 0 для товара, которого нет', () => {
    expect(getQuantity(cart, 'love')).toBe(0);
  });

  it('считает общее число флаконов', () => {
    expect(getCartCount(cart)).toBe(3);
  });

  it('возвращает 0 для пустой корзины', () => {
    expect(getCartCount([])).toBe(0);
  });
});
