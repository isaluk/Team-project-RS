import { describe, expect, it } from 'vitest';
import { parseHash, toHash } from './route';

describe('parseHash', () => {
  it.each([
    ['#/catalog', 'catalog'],
    ['#/cart', 'cart'],
    ['#/about', 'about'],
    ['#catalog', 'catalog'],
    ['#/cart/', 'cart'],
  ])('читает "%s" как страницу %s', (hash, expected) => {
    expect(parseHash(hash)).toBe(expected);
  });

  it.each(['', '#', '#/', '#/unknown', '#/Catalog'])(
    'для "%s" возвращает стартовую страницу',
    (hash) => {
      expect(parseHash(hash)).toBe('about');
    },
  );
});

describe('toHash', () => {
  it('собирает адрес страницы', () => {
    expect(toHash('cart')).toBe('#/cart');
  });

  it('обратима через parseHash', () => {
    expect(parseHash(toHash('catalog'))).toBe('catalog');
  });
});
