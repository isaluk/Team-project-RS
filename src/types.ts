export type Category = 'healing' | 'magic' | 'cursed' | 'love';

export type Rarity = 'common' | 'rare' | 'legendary';

export interface Product {
  id: string;
  name: string;
  category: Category;
  rarity: Rarity;
  /** Price in cents: $19.90 is stored as 1990. Integers avoid rounding errors. */
  price: number;
  /** File name in public/images without the extension. */
  image: string;
  description: string;
}

export interface CartItem {
  productId: string;
  /** Integer from 1 to MAX_QUANTITY. */
  quantity: number;
}

export type SortMode = 'default' | 'price-asc' | 'price-desc';

export interface Filters {
  search: string;
  category: Category | 'all';
  rarity: Rarity | 'all';
  /** Lower price bound in cents. null means "no bound". */
  minPrice: number | null;
  /** Upper price bound in cents. null means "no bound". */
  maxPrice: number | null;
  sort: SortMode;
}

export interface PromoCode {
  code: string;
  /** Discount in percent: 10 means 10%. */
  percent: number;
}

export type PromoError = 'empty' | 'unknown';

export type PromoResult = { ok: true; promo: PromoCode } | { ok: false; error: PromoError };

export interface CartTotals {
  /** Sum before the discount, in cents. */
  subtotal: number;
  /** Discount amount, in cents. */
  discount: number;
  /** Amount to pay, in cents. */
  total: number;
  /** Total number of bottles in the cart. */
  count: number;
}

export type Route = 'about' | 'catalog' | 'cart';

export interface AppState {
  route: Route;
  cart: CartItem[];
  filters: Filters;
  promo: PromoCode | null;
}
