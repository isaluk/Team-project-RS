import type { Category, Filters, Product, Rarity, SortMode } from '../types';

export const DEFAULT_FILTERS: Filters = {
  search: '',
  category: 'all',
  rarity: 'all',
  minPrice: null,
  maxPrice: null,
  sort: 'default',
};

export function matchesSearch(product: Product, search: string): boolean {
  const query = search.trim().toLocaleLowerCase('ru');
  return query === '' || product.name.toLocaleLowerCase('ru').includes(query);
}

export function matchesCategory(product: Product, category: Category | 'all'): boolean {
  return category === 'all' || product.category === category;
}

export function matchesRarity(product: Product, rarity: Rarity | 'all'): boolean {
  return rarity === 'all' || product.rarity === rarity;
}

export function matchesPrice(
  product: Product,
  minPrice: number | null,
  maxPrice: number | null,
): boolean {
  const aboveMin = minPrice === null || product.price >= minPrice;
  const belowMax = maxPrice === null || product.price <= maxPrice;
  return aboveMin && belowMax;
}

export function sortProducts(products: Product[], mode: SortMode): Product[] {
  const copy = [...products];
  if (mode === 'price-asc') {
    return copy.sort((a, b) => a.price - b.price);
  }
  if (mode === 'price-desc') {
    return copy.sort((a, b) => b.price - a.price);
  }
  return copy;
}

export function applyFilters(products: Product[], filters: Filters): Product[] {
  const filtered = products.filter(
    (product) =>
      matchesSearch(product, filters.search) &&
      matchesCategory(product, filters.category) &&
      matchesRarity(product, filters.rarity) &&
      matchesPrice(product, filters.minPrice, filters.maxPrice),
  );
  return sortProducts(filtered, filters.sort);
}

export function countByCategory(products: Product[]): Record<Category, number> {
  const counts: Record<Category, number> = { healing: 0, magic: 0, cursed: 0, love: 0 };
  for (const product of products) {
    counts[product.category] += 1;
  }
  return counts;
}
