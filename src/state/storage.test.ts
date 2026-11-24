import { describe, expect, it } from 'vitest';
import type { CartItem } from '../types';
import { CART_STORAGE_KEY, type StorageLike, loadCart, parseCart, saveCart } from './storage';

const knownIds = ['vigor', 'bugfix'];

function createFakeStorage(initial: Record<string, string> = {}): StorageLike {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
}

describe('parseCart', () => {
  it('возвращает пустую корзину, если данных нет', () => {
    expect(parseCart(null, knownIds)).toEqual([]);
  });

  it('читает корректные данные', () => {
    const raw = JSON.stringify([{ productId: 'vigor', quantity: 2 }]);

    expect(parseCart(raw, knownIds)).toEqual([{ productId: 'vigor', quantity: 2 }]);
  });

  it.each(['{broken', '"text"', '{"productId":"vigor"}', 'null'])(
    'возвращает пустую корзину для повреждённой строки %s',
    (raw) => {
      expect(parseCart(raw, knownIds)).toEqual([]);
    },
  );

  it('пропускает позиции неправильной формы', () => {
    const raw = JSON.stringify([
      null,
      'vigor',
      { productId: 42, quantity: 1 },
      { productId: 'vigor', quantity: '2' },
      { productId: 'bugfix', quantity: 1 },
    ]);

    expect(parseCart(raw, knownIds)).toEqual([{ productId: 'bugfix', quantity: 1 }]);
  });

  it('пропускает товары, которых нет в каталоге, и повторы', () => {
    const raw = JSON.stringify([
      { productId: 'ghost', quantity: 1 },
      { productId: 'vigor', quantity: 1 },
      { productId: 'vigor', quantity: 5 },
    ]);

    expect(parseCart(raw, knownIds)).toEqual([{ productId: 'vigor', quantity: 1 }]);
  });

  it('исправляет недопустимое количество', () => {
    const raw = JSON.stringify([
      { productId: 'vigor', quantity: -3 },
      { productId: 'bugfix', quantity: 2.9 },
    ]);

    expect(parseCart(raw, knownIds)).toEqual([
      { productId: 'vigor', quantity: 1 },
      { productId: 'bugfix', quantity: 2 },
    ]);
  });
});

describe('loadCart и saveCart', () => {
  it('сохраняет корзину и читает её обратно', () => {
    const storage = createFakeStorage();
    const cart: CartItem[] = [{ productId: 'vigor', quantity: 3 }];

    saveCart(storage, cart);

    expect(loadCart(storage, knownIds)).toEqual(cart);
  });

  it('пишет под своим ключом', () => {
    const storage = createFakeStorage();

    saveCart(storage, []);

    expect(storage.getItem(CART_STORAGE_KEY)).toBe('[]');
  });

  it('работает без хранилища', () => {
    expect(loadCart(null, knownIds)).toEqual([]);
    expect(() => saveCart(null, [])).not.toThrow();
  });

  it('не падает, если хранилище бросает ошибку', () => {
    const broken: StorageLike = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };

    expect(loadCart(broken, knownIds)).toEqual([]);
    expect(() => saveCart(broken, [])).not.toThrow();
  });
});
