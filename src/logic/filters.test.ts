import { describe, expect, it } from 'vitest';
import type { Filters, Product } from '../types';
import {
  DEFAULT_FILTERS,
  applyFilters,
  countByCategory,
  matchesCategory,
  matchesPrice,
  matchesRarity,
  matchesSearch,
  sortProducts,
} from './filters';

const vigor: Product = {
  id: 'vigor',
  name: 'Эликсир бодрости',
  category: 'healing',
  rarity: 'common',
  price: 1500,
  image: 'vigor',
  description: '',
};
const invisibility: Product = {
  id: 'invisibility',
  name: 'Зелье невидимости',
  category: 'magic',
  rarity: 'legendary',
  price: 9000,
  image: 'invisibility',
  description: '',
};
const courage: Product = {
  id: 'courage',
  name: 'Отвар смелости',
  category: 'magic',
  rarity: 'rare',
  price: 4500,
  image: 'courage',
  description: '',
};
const products: Product[] = [vigor, invisibility, courage];

function filters(patch: Partial<Filters>): Filters {
  return { ...DEFAULT_FILTERS, ...patch };
}

function ids(list: Product[]): string[] {
  return list.map((product) => product.id);
}

describe('matchesSearch', () => {
  it('не учитывает регистр', () => {
    expect(matchesSearch(invisibility, 'ЗЕЛЬЕ')).toBe(true);
  });

  it('находит по части слова', () => {
    expect(matchesSearch(vigor, 'бод')).toBe(true);
  });

  it('пустой запрос и пробелы подходят всем', () => {
    expect(matchesSearch(vigor, '')).toBe(true);
    expect(matchesSearch(vigor, '   ')).toBe(true);
  });

  it('возвращает false, если совпадения нет', () => {
    expect(matchesSearch(vigor, 'дракон')).toBe(false);
  });
});

describe('matchesCategory и matchesRarity', () => {
  it('«all» подходит любому товару', () => {
    expect(matchesCategory(vigor, 'all')).toBe(true);
    expect(matchesRarity(vigor, 'all')).toBe(true);
  });

  it('сравнивает категорию', () => {
    expect(matchesCategory(vigor, 'healing')).toBe(true);
    expect(matchesCategory(vigor, 'magic')).toBe(false);
  });

  it('сравнивает редкость', () => {
    expect(matchesRarity(courage, 'rare')).toBe(true);
    expect(matchesRarity(courage, 'legendary')).toBe(false);
  });
});

describe('matchesPrice', () => {
  it('включает товар ровно на границе', () => {
    expect(matchesPrice(vigor, 1500, 1500)).toBe(true);
  });

  it('отсекает товар за границей', () => {
    expect(matchesPrice(vigor, 1501, null)).toBe(false);
    expect(matchesPrice(vigor, null, 1499)).toBe(false);
  });

  it('null означает «без границы»', () => {
    expect(matchesPrice(invisibility, null, null)).toBe(true);
  });
});

describe('sortProducts', () => {
  it('сортирует по возрастанию цены', () => {
    expect(ids(sortProducts(products, 'price-asc'))).toEqual(['vigor', 'courage', 'invisibility']);
  });

  it('сортирует по убыванию цены', () => {
    expect(ids(sortProducts(products, 'price-desc'))).toEqual(['invisibility', 'courage', 'vigor']);
  });

  it('в режиме default сохраняет исходный порядок', () => {
    expect(ids(sortProducts(products, 'default'))).toEqual(['vigor', 'invisibility', 'courage']);
  });

  it('не меняет исходный массив', () => {
    sortProducts(products, 'price-desc');

    expect(ids(products)).toEqual(['vigor', 'invisibility', 'courage']);
  });
});

describe('applyFilters', () => {
  it('без фильтров возвращает все товары', () => {
    expect(applyFilters(products, DEFAULT_FILTERS)).toEqual(products);
  });

  it('совмещает категорию, цену и сортировку', () => {
    const result = applyFilters(
      products,
      filters({ category: 'magic', maxPrice: 9000, sort: 'price-asc' }),
    );

    expect(ids(result)).toEqual(['courage', 'invisibility']);
  });

  it('совмещает поиск и редкость', () => {
    expect(ids(applyFilters(products, filters({ search: 'зелье', rarity: 'legendary' })))).toEqual([
      'invisibility',
    ]);
  });

  it('возвращает пустой массив, если ничего не подошло', () => {
    expect(applyFilters(products, filters({ search: 'дракон' }))).toEqual([]);
  });
});

describe('countByCategory', () => {
  it('считает товары по категориям', () => {
    expect(countByCategory(products)).toEqual({ healing: 1, magic: 2, cursed: 0, love: 0 });
  });
});
